import { SUBJECT_TO_MODIFIER_MAP } from "../SharedData/data";

export const cardTitles = {
  "Charms-Cantrips": true,
  "Charms-1st Level": false,
  "Charms-3rd Level": false,
  "Charms-4th Level": false,
  "Charms-5th Level": false,
  "Charms-6th Level": false,
  "Charms-9th Level": false,
  "Jinxes, Hexes & Curses-Cantrips": false,
  "Jinxes, Hexes & Curses-1st Level": false,
  "Jinxes, Hexes & Curses-2nd Level": false,
  "Jinxes, Hexes & Curses-3rd Level": false,
  "Jinxes, Hexes & Curses-4th Level": false,
  "Jinxes, Hexes & Curses-5th Level": false,
  "Jinxes, Hexes & Curses-7th Level": false,
  "Jinxes, Hexes & Curses-8th Level": false,
  "Transfigurations-Cantrips": false,
  "Transfigurations-1st Level": false,
  "Transfigurations-2nd Level": false,
  "Transfigurations-3rd Level": false,
  "Transfigurations-4th Level": false,
  "Transfigurations-5th Level": false,
  "Transfigurations-6th Level": false,
  "Elemental-Cantrips": false,
  "Elemental-1st Level": false,
  "Elemental-3rd Level": false,
  "Elemental-4th Level": false,
  "Elemental-8th Level": false,
  "Elemental-9th Level": false,
  "Valiant-Cantrips": false,
  "Valiant-1st Level": false,
  "Valiant-2nd Level": false,
  "Valiant-3rd Level": false,
  "Valiant-4th Level": false,
  "Valiant-5th Level": false,
  "Divinations-Cantrips": false,
  "Divinations-1st Level": false,
  "Divinations-2nd Level": false,
  "Divinations-3rd Level": false,
  "Divinations-4th Level": false,
  "Divinations-5th Level": false,
  "Divinations-6th Level": false,
  "Divinations-9th Level": false,
  "Healing-Cantrips": false,
  "Healing-1st Level": false,
  "Healing-2nd Level": false,
  "Healing-3rd Level": false,
  "Healing-4th Level": false,
  "Healing-5th Level": false,
  "Healing-6th Level": false,
  "Healing-7th Level": false,
  "Magizoo-Cantrips": false,
  "Magizoo-1st Level": false,
  "Magizoo-2nd Level": false,
  "Magizoo-3rd Level": false,
  "Magizoo-4th Level": false,
  "Magizoo-5th Level": false,
  "Magizoo-6th Level": false,
  "Magizoo-7th Level": false,
  "Magizoo-8th Level": false,
  "Grim-Cantrips": false,
  "Grim-1st Level": false,
  "Grim-2nd Level": false,
  "Grim-3rd Level": false,
  "Grim-4th Level": false,
  "Grim-6th Level": false,
  "Grim-9th Level": false,
};

export const getModifierForCombinedSchool = (schoolString) => {
  const schools = schoolString.toLowerCase().split("/");

  for (const school of schools) {
    const cleanSchool = school.trim();
    if (
      standardSchools.includes(cleanSchool) &&
      SUBJECT_TO_MODIFIER_MAP[cleanSchool]
    ) {
      return SUBJECT_TO_MODIFIER_MAP[cleanSchool];
    }
  }

  return null;
};

export const standardSchools = [
  "charms",
  "jhc",
  "transfiguration",
  "healing",
  "divinations",
];

export const spellsData = {
  Charms: {
    hasRestriction: false,
    icon: "Wand2",
    color: "#51B5F6",
    description: "Utility and enhancement magic",
    levels: {
      Cantrips: [
        {
          name: "Accio",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "A target object is pulled directly to the caster as if carried by an invisible hand. The object is selected by pointing at it with a wand or by naming it, Accio broom. An object heavier than 20 pounds may not be summoned.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, you may select or stack one of the following effects for each slot level above 0: Increase spell range by 100 feet, Increase weight limit by 20 pounds, Increase the number of targetable objects by 5.",
        },
        {
          name: "Alohomora",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "Choose a door or window that you can see within range, that uses mundane or magical means to prevent access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked. If you choose a target that is held shut with Colloportus, that spell is removed. When you cast the spell, the mechanism noisily turns and unlocks. This noise emanates from the target object and is audible from as far away as 100 feet.",
        },
        {
          name: "Carpe Retractum",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Round",
          year: 2,
          description:
            "A bond of light shoots out from the caster and attaches to anything you can see within range, and then retracts, pulling caster and target each 10 feet closer. If the caster or target doesn't move or would easily resist the force of the other being pulled, the other moves 20 feet. If the target is an unwilling creature that is able to be moved, it must make a Strength saving throw to resist being moved. The bond of light keeps the caster and target attached for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, the range and pulling effect both increase by 5 feet for each slot level above 0.",
        },
        {
          name: "Capto",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "10 Minutes",
          year: 1,
          description:
            "One target object becomes quite easily gripped by one hand, almost sticky unless the holder willfully lets go. The holder has advantage against being non-magically disarmed.",
        },
        {
          name: "Cistem Aperio",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "Choose a box, chest, or another container that you can see within range that uses mundane or magical means to prevent access. A target that is held shut by a mundane lock or that is stuck or chained becomes unlocked, unstuck, or unchained. If the object has multiple locks, only one of them is unlocked. If you choose a target that is held shut with Colloportus, that spell is dispelled. When you cast the spell, the mechanism noisily turns and unlocks. This noise emanates from the target object and is audible from as far away as 100 feet.",
        },
        {
          name: "Colloportus",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Until Dispelled",
          year: 1,
          description:
            "You touch a closed door, window, gate, chest, or other entryway, and it becomes locked for the duration. It is impassable until it is broken or the spell is dispelled or suppressed. While affected by this spell, the object is more difficult to break or force open; the DC to break it or pick any locks on it increases by 10.",
        },
        {
          name: "Colovaria",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "1 Hour",
          year: 1,
          description:
            "You change the color of any target within range that lasts for the duration, to any desired complexity. The color may only be reverted by dispelling the charm. Physical interaction with the object reveals that the object has retained its original texture and material, but its color has truly changed.",
        },
        {
          name: "Defodio",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet (5 Foot Cube)",
          duration: "Instantaneous",
          year: 2,
          description:
            "You choose a portion of dirt or stone that you can see within range and that fits within a 5-foot cube. You manipulate it in one of the following ways: If you target an area of stone or earth, you can instantaneously excavate it, move it along the ground, and deposit it up to 5 feet away. This movement doesn't have enough force to cause damage. If the dirt or stone you target is on the ground, you cause it to become difficult terrain.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, the cube's size and distance the earth can be moved are each increased by 5 feet and the number of active normal/difficult terrain effects increase by 1 for each slot level above 0.",
        },
        {
          name: "Duro",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Minute",
          year: 1,
          description:
            "An object you can see within range becomes as hard and tough as stone. It gains resistance to all damage.",
        },
        {
          name: "Finestra",
          level: "Cantrip",
          castingTime: "1 Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "A pane of glass you can see within range turns to powder, discreetly turning it into an open entryway.",
        },
        {
          name: "Flagrate",
          level: "Cantrip",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "You trace your wand in the air or over an object, leaving fiery marks in that position. You may write any letters or depict any shapes, as if you were writing with a quill. Although the glowing letters appear to be made of fire, it is just an illusion and it cannot burn anything.",
        },
        {
          name: "Glisseo",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 1 minute",
          year: 2,
          description:
            "Famously used to protect the Hogwarts girls' dormitories from intruders, this spell changes the angle of all connected steps in a single flight of stairs within range. They angle downwards, turning into an abnormally slick ramp.",
        },
        {
          name: "Illegibilus",
          level: "Cantrip",
          castingTime: "Action",
          range: "10 Feet",
          duration: "1 Hour",
          year: 1,
          description:
            "For the duration, no one can understand any written language that the spell is cast upon. The pieces of all the letters are separated and scrambled, rendering it impossible to try to decode.",
        },
        {
          name: "Impervius",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 1,
          description:
            "For the duration, a target object that you can see within range is waterproof and completely protected from any gas. It's as if any liquid or gas runs into a magnetic field around the object by which it is repelled, but the spell has no effect against solids impacting the target object.",
        },
        {
          name: "Lumos/Nox",
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Until Dispelled",
          year: 2,
          description:
            "Upon muttering the incantation, the tip of your wand sheds bright light in a narrow 15-foot cone and dim light for an additional 15 feet, much like a flashlight. The light is a bright white with a slight bluish tint. Completely covering the tip of your wand with something opaque blocks the light. The spell ends if you dismiss it with the nox incantation, as a bonus action.",
        },
        {
          name: "Molliare",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 1,
          description:
            "This comfortable charm is most commonly found on a broomstick. One object you touch with your wand is wrapped in an invisible cushioning effect for the duration, almost like two magnets repelling one another.",
        },
        {
          name: "Pereo",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "You choose a flame that you can see within range and that fits within a 5-foot cube. You instantaneously extinguish the flames within the cube.",
        },
        {
          name: "Scourgify",
          level: "Cantrip",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "An object no larger than 5 cubic feet is flawlessly cleaned.",
        },
        {
          name: "Spongify",
          level: "Cantrip",
          castingTime:
            "1 action or reaction, which you take when a collision occurs within 30 feet",
          range: "30 Feet",
          duration: "1 Minute",
          year: 1,
          description:
            "This spell makes an object become soft and bouncy, like a sponge or mattress. Any damage from falling on or colliding with this object is nullified. This spell can be cast as a reaction to a collision affecting a creature you can see within range or between two objects within range.",
        },
        {
          name: "Periculum/Verdimillious",
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 2,
          description:
            "This spell sends red (periculum) or green (verdimillious) sparks shooting from the casters wand for signaling purposes. It may also appear as a flare, traveling a desired distance before exploding in light and hovering in the air.",
        },
        {
          name: "Sonorus/Quietus",
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Until Dispelled",
          year: 2,
          description:
            "When you hold the tip of your wand to your neck and cast this spell, your voice booms up to three times as loud as normal. Your voice is loud enough to fill a large stadium, but won't cause any hearing damage. Casting quietus with your wand to your throat is the counter-charm and ends the effect.",
        },
        {
          name: "Tergeo",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: 2,
          description:
            "You choose an specific liquid that you can see within range and that fits within a 5-foot cube. The liquid gathers up into a blob floating at the tip of your wand, and you can direct it to form into simple shapes, animate, or flow into a container.",
        },
        {
          name: "Wingardium Leviosa",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Dedication, 1 Minute",
          year: 1,
          description:
            "One creature other than yourself or object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 100 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected. The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, the weight limit is increased by 150 pounds for each slot level above 0.",
        },
      ],
      "1st Level": [
        {
          name: "Arrest Momentum",
          level: "1st Level",
          castingTime:
            "1 reaction, which you take when you or a creature within 60 feet of you falls",
          range: "60 Feet",
          duration: "1 minute",
          year: 2,
          tags: ["C", "R"],
          description:
            "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature. This spell is particularly useful for preventing fall damage from great heights or during aerial combat situations.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target two additional falling creatures for each slot level above 1st, and the duration increases by 1 minute for each slot level above 1st.",
        },
        {
          name: "Diffindo",
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          tags: ["R"],
          description:
            "An object is precisely torn or cut, as if a magical blade extended from the tip of your wand. This spell was not designed to be used on creatures and only makes very shallow cuts. Choose a target you can see within range that fits within a 5-foot cube. If the target is a creature, it must make a Dexterity saving throw. It takes 4d4 slashing damage on a failed save or half as much damage on a successful one. This is the counterspell to incarcerous, immediately ending that spell's effects.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature or the cube's size increases by 5 feet for each slot level above 1st.",
        },
        {
          name: "Exhilaro",
          level: "1st Level (ritual)",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 1 minute",
          year: 2,
          tags: ["R"],
          description:
            "A creature of your choice that you can see within range becomes quite cheerful. For the next 10 minutes, the target creature has advantage on any saving throw against becoming frightened. If concentration is maintained for one whole round, the creature perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 5 or less isn't affected. At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.",
        },
        {
          name: "Glacius",
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Hour",
          year: 1,
          tags: ["R"],
          description:
            "You freeze an area of water that you can see within range and that fits within a 5-foot cube. The area becomes difficult terrain for the duration. Each Medium or smaller creature that is covered, submerged or partially submerged in the affected water has its speed halved and must make a Constitution saving throw. On a failed save, a creature takes 3d8 cold damage, or half as much damage on a successful one.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 and the cube's size increases by 5 feet for each slot level above 1st.",
        },
        {
          name: "Locomotor",
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "1 Hour",
          year: 2,
          tags: ["R"],
          description:
            "One object that isn't being worn or carried of your choice that you can see within range rises 3 feet off the ground, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. If more weight than the limit is placed on top of the object, the spell ends, and it falls to the ground. The object is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the object follows you so that it remains within 20 feet of you.",
        },
        {
          name: "Mobilicorpus",
          level: "1st Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 hour",
          year: 3,
          tags: ["R"],
          description:
            "You animate a corpse or unconscious creature to move under your control for the duration.",
        },
        {
          name: "Perfusorius",
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 2,
          tags: ["R"],
          description:
            "This spell alters an object of up to 500 pounds, changing its weight to be just barely heavier than the atmosphere around it. The slightest force is needed to move, pick up, or carry this object for the duration. It can be easily thrown as well.",
        },
        {
          name: "Protego",
          level: "1st Level",
          castingTime:
            "1 action or reaction, which you take when you are hit by an attack",
          range: "Self",
          duration: "Dedication, up to 10 minutes",
          year: 3,

          description:
            "An invisible barrier of magical force appears in front of you and protects you. For the duration, you have a +5 bonus to AC, including against the triggering attack. If you are targeted by a spell that requires an attack roll and the spell's level is equal to or lower than half your proficiency bonus, the spell has no effect on you. You can use a bonus action to change which direction the shield is facing. If you are attacked from either of your sides or from behind while casting this spell, you must use your reaction to redirect the shield to point towards the threat. Otherwise, this spell doesn't protect you.",
        },
        {
          name: "Riddikulus",
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "This spell has a very specific application: forcing a boggart to transform into a comedic version of its current form. Only a boggart may be targeted by this spell.",
        },
        {
          name: "Reducio",
          level: "1st Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 hour",
          year: 3,
          tags: ["R"],
          description:
            "You cause an object that isn't being worn or carried and that you can see within range to shrink in size for the duration. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category – from Medium to Small, for example.",
        },
        {
          name: "Rictusempra",
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Round",
          year: 1,
          description:
            "This low-level dueling spell gives the recipient an intense tickling sensation. Make a ranged spell attack against a being within range. On a hit, the target will double over in laughter and become incapacitated with its speed halved until the start of your next turn.",
        },
        {
          name: "Vigilatus",
          level: "1st Level",
          castingTime: "1 Minute",
          range: "30 Feet",
          duration: "8 Hours",
          year: 2,
          tags: ["R"],
          description:
            "You set a mental alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, a ping in your mind alerts you whenever a Tiny or larger creature touches or enters the warded area, if you are within 1 mile of the warded area. This ping awakens you if you are sleeping. When you cast the spell, you can designate creatures that won't set off the alarm.",
        },
      ],
      "2nd Level": [
        {
          name: "Abscondi",
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "Self",
          duration: "Concentration, up to 1 hour",
          year: 4,
          tags: ["R"],
          description:
            "A magical aura makes your impact on your surroundings unseen, masking you and your companions from detection. For the duration, each creature you choose within 30 feet of you (including you) has a +10 bonus to Dexterity (Stealth) checks and can't be tracked except by magical means. A creature that receives this bonus leaves behind no tracks or other traces of its passage.",
        },
        {
          name: "Diminuendo",
          level: "2nd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          description:
            "Make a ranged spell attack against a creature within range. On a hit, the being or beast's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category - from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target deals 1d4 less damage (this can't reduce the damage below 1).",
        },
        {
          name: "Engorgio",
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "Touch",
          duration: "1 minute",
          year: 4,
          tags: ["R"],
          description:
            "You cause a creature or an object you can see within range to grow larger for the duration. Choose either a creature or an object that isn't being worn or carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category - from Medium to Large, for example. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. While enlarged, the target deals 1d4 extra damage.",
        },
        {
          name: "Expelliarmus",
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "Famous for being the spell that finally defeated Voldemort in the Second Wizarding War, this spell can harmlessly end duels by disarming a wizard of his wand. Make a ranged spell attack against a being within range. On a hit, you disarm the target, forcing it to drop one item of your choice that it's holding. The object lands 10 feet away from it in a random direction.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can choose the direction the object travels and the object's distance increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Finite Incantatem",
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "instantaneous",
          year: 3,

          description:
            "Choose any creature, object, or magical effect within range. One non-Transfiguration spell of 2nd level or lower on the target ends. If you are aware of at least one spell affecting the target, you can specify that spell in your mind. If you are unaware of what spells are affecting the target, one randomly selected spell ends. For a spell of a higher level on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you automatically end the effects of a non-Transfiguration spell on the target if the spell's level is equal to or less than the level of the spell slot you used.",
        },
        {
          name: "Fumos",
          level: "2nd Level",
          castingTime: "1 action",
          range: "Self (15 foot cube)",
          duration: "Concentration, up to 1 minute",
          year: 3,
          tags: ["C"],
          description:
            "A thick spray of smoke billows out from your wand, filling a 15-foot cube originating from you. This smoke spreads around corners. It lasts for the duration or until strong wind disperses the smoke, ending the spell. Its area is heavily obscured. When a creature enters the spell's area for the first time on a turn or starts its turn there, that creature must make a Constitution saving throw. The creature takes 3d6 poison damage on a failed save, or half as much damage on a successful one. Constructs and undead are immune to this damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d6 and the area increases by 5 feet for each slot level above 2nd.",
        },
        {
          name: "Geminio",
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "10 days",
          year: 3,
          tags: ["R"],
          description:
            "You tap an object that fits within a 1-foot cube with your wand and a perfect duplicate of it pops out from the object. The duplicate is indistinguishable from the object by normal means, but does not share any of its magical qualities or functions. The duplicate has one quarter of the original object's hit points and vanishes at the end of the spell's duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the cube's size increases by 1 foot for each slot level above 2nd.",
        },
        {
          name: "Immobulus",
          level: "2nd Level",
          castingTime: "Action",
          range: "Self (15 Feet Cube)",
          duration: "1 Round",
          year: 2,
          description:
            "You send a pulse through the area in front of you, freezing everything in space and time. Roll 7d10; the total is how many hit points of creatures this spell can affect. All creatures and objects in a 15-foot cube originating from you are affected in the order of nearest to farthest. Each creature affected by this spell is paralyzed until the spell ends. While paralyzed, the creature is fixed in the space they occupied when the spell was cast, which may leave it suspended in air.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, roll an additional 2d10 for each slot level above 2nd. When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 round for each two slot levels above 2nd.",
        },
        {
          name: "Muffliato",
          level: "2nd Level",
          castingTime: "1 action",
          range: "Self",
          duration: "Concentration, up to 1 hour",
          year: 3,
          restriction: true,
          description:
            "For the duration, each creature you choose within 30 feet of you (including you) are able to converse with each other without anyone or anything else hearing. Instead of the voices, nearby creatures hear a faint buzzing, like white noise. If a creature is within 15 feet of you and sees your mouth move when you speak, it is aware that your voice is being magically masked.",
        },
        {
          name: "Partis Temporus",
          level: "2nd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "This unique charm redirects magical effects to create an opening. On any area spell of 3rd level or lower that forms a line, wall, or perimeter, an opening appears in the spell's effect at a point of your choice that you can see within range and lasts for the duration. You choose the opening's dimensions: up to 5 feet wide and 8 feet tall.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you automatically create an opening in the spell if the spell's level is one level higher than, equal to or less than the level of the spell slot you used.",
        },
        {
          name: "Pellucidi Pellis",
          level: "2nd Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 4,
          description:
            "With a tap of a wand on the top of the head and a sensation of raw egg being broken where the wand was tapped, a creature becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target's person. The spell ends for a target that attacks or casts a spell.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
        },
        {
          name: "Protego Maxima",
          level: "2nd Level",
          castingTime:
            "1 action or reaction, which you take when you are hit by an attack",
          range: "Self",
          duration: "Dedication, up to 10 minutes",
          year: 4,

          description:
            "You cast a fully encompassing protego around yourself, sacrificing durability for coverage. For the duration, you have a +3 bonus to AC, including against the triggering attack. If you are subjected to an effect that allows you to make a Strength or Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail.",
        },
        {
          name: "Reparo",
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 3,
          tags: ["R"],
          description:
            "This spell magically reverses any damage done to any objects or structures within a 5-foot cube, collecting all the pieces or components and reassembling them. Anything previously contained by the broken target, like a spilled liquid, is not placed back inside it. This spell can physically repair a magic item, but the spell can't restore magic to such an object.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the cube's size increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Silencio",
          level: "2nd Level (ritual)",
          castingTime: "Action",
          range: "90 Feet",
          duration: "1 Minute",
          year: 4,
          tags: ["R"],
          description:
            "This charm is extremely effective against wizards unpracticed in non-verbal magic. Choose one target that you can see within range. If it's a creature, it must make a Wisdom saving throw. If it fails or if it's an object, all sound created by the target is made completely silent. Casting a spell that includes a verbal component is impossible while under the effect of this spell.",
        },
        {
          name: "Stupefy",
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "10 Minutes",
          year: 3,
          description:
            "This charm is the most common dueling spell in the wizarding world, harmlessly ending a duel between two wizards. Make a ranged spell attack against a being within range. On a hit, the target falls unconscious for the duration, or until they are revived with rennervate.",
          higherLevels:
            "If you cast this spell using a spell slot of 3rd level or higher, the duration increases to 1 hour (3rd level) or 8 hours (4th level). Alternatively, when you cast this spell using a spell slot of 4th level or higher, you can target a beast instead of a being, for a duration of 10 minutes (4th level), 1 hour (5th level) or 8 hours (6th level).",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo",
          level: "3rd Level (ritual)",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          year: 5,
          tags: ["R"],
          description:
            "You place immense downward pressure on a target. If the target is a creature, it must make a Strength saving throw. On a failed save, a creature takes 5d8 bludgeoning damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone. If the target is a flat surface, this will either create a crater or collapse the surface.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage is increased by 1d8 for each slot level above 3rd.",
        },
        {
          name: "Depulso",
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "A target is pushed directly away from the caster as if shoved by an invisible hand, being thrown 5 feet away plus a number of feet equal to five times your spellcasting ability modifier. The target is selected by pointing at it with a wand. If targeting a creature or object that is being worn or carried, make a check with 26 Strength (+8) contested by the Strength (Athletics) check of the target creature. If the target is Medium or smaller, you have advantage on the check. If you succeed, the target is thrown the same distance.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the shove distance is increased by 10 feet for each slot level above 3rd.",
        },
        {
          name: "Dissonus Ululatus",
          level: "3rd Level",
          castingTime: "10 minutes",
          range: "Self (30-foot-radius hemisphere)",
          duration: "8 hours",
          year: 5,

          description:
            "You set an alarm to emit a piercing shriek when an unauthorized person enters the area. Until the spell ends, an alarm sounds whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures or areas within the hemisphere that won't set off the alarm. The alarm produces an unpleasant screaming sound for as long as the intruding creature is in the area of the spell, audible from as far away as 300 feet.",
        },
        {
          name: "Expecto Patronum",
          level: "3rd Level (ritual)",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          tags: ["R"],
          description:
            "A Patronus Charm is a special bit of magic that requires a wizard to envision one of their happiest memories while casting the spell. The feeling of happiness must be genuine or strong enough to produce a radiant, ethereal beast, the embodiment of that wizard's positive emotions that serves as their protector. When you cast this spell, you can choose to conjure an incorporeal or corporeal patronus. If you attempt to cast this spell while frightened or within 60 feet of a dementor, you must make an ability check using your spellcasting ability. The DC equals 10 + the number of dementors within 60 feet of you. A roll of 19-20 on the die automatically succeeds. On a success, you cast the spell. On a failure, you can only conjure an incorporeal patronus, but if you fail the check by 5 or more, the spell fails entirely. At the end of your turn, if you are frightened or there are one or more dementors within 60 feet of you while concentrating on this spell, you must repeat the ability check. On a failure, your patronus vanishes and the spell ends. A patronus sheds light in a radius around it. You and friendly creatures can't be frightened while in your patronus's light. A dementor that starts its turn within this light or enters the light for the first time on a turn must succeed on a Wisdom saving throw or become frightened of the patronus until the start of its next turn. Incorporeal Patronus: Your patronus takes the form of a 5-foot burst of glowing mist in an unoccupied space adjacent to you, shedding bright light in its space and dim light in a 5-foot radius. Corporeal Patronus: Your patronus takes the form of a wispy silver animal in an unoccupied space that you can see within range, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. When you cast the spell and as a bonus action on subsequent turns, you can move the patronus up to 60 feet (Medium or smaller), 45 feet (Large), or 30 feet (Huge). At any time during the patronus's movement, you can direct it to charge into a dementor within 5 feet of it. Make a melee spell attack for the patronus. On a hit, the target takes 5d10 radiant damage and the patronus pushes the target up to 5 feet plus a number of feet equal to five times your spellcasting ability modifier.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d10 and the radius of the dim light increases by 5 feet for each slot level above 3rd.",
        },
        {
          name: "Fianto Duri",
          level: "3rd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 5,

          description:
            "Whenever you cast this spell on an active defensive spell within range that improves a creature's AC or grants it temporary hit points, each creature affected by the targeted spell gains temporary hit points equal to twice your caster level + your spellcasting ability modifier. When the targeted spell ends or an affected creature is no longer affected by it, the creature loses any remaining temporary hit points from this spell.",
        },
        {
          name: "Fortissimum",
          level: "3rd Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Until dispelled",
          year: 4,
          description:
            "One object of your choice that you can see within range and that fits within a 1-foot cube is made completely invulnerable to physical destruction. This renders it immune to any damage, magical or mundane, but it can still be affected by spells that directly change the object, such as vera verto or evanesco.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the cube's size increases by 1 foot for each slot level above 3rd.",
        },
        {
          name: "Herbivicus",
          level: "3rd Level",
          castingTime: "1 action or 1 minute",
          range: "90 feet",
          duration: "1 hour or Instantaneous",
          year: 3,
          description:
            "This spell channels vitality into plants within a specific area. There are two possible uses for the spell, granting either immediate or long-term benefits. If you cast this spell using 1 action, choose a point within range. All non-magical plants in a 60-foot radius centered on that point become thick and overgrown for 1 hour, turning the area into difficult terrain. If you cast this spell over 1 minute, you accelerate the growth of a single young plant you can see within range, magical or mundane.",
        },
        {
          name: "Lumos Maxima",
          level: "3rd Level (ritual)",
          castingTime: "1 action",
          range: "90 feet",
          duration: "1 hour",
          year: 3,
          tags: ["R"],
          description:
            "A 60-foot-radius sphere of light spreads out from a small floating ball of light that hovers in place. The sphere is bright light and sheds dim light for an additional 60 feet. As a bonus action, you can direct the ball of light to a new position within range.",
        },
        {
          name: "Novum Spirare",
          level: "3rd Level (ritual)",
          castingTime: "1 action",
          range: "Touch",
          duration: "24 hours",
          year: 4,
          tags: ["R"],
          description:
            "Accurately named, the bubble-head charm forms a large bubble-like mask over a creature's mouth, nose, and ears that is magically filled with never-ending fresh air. This spell grants one willing creature you can see within range the ability to breathe underwater or in a vacuum until the spell ends. Additionally, the creature is immune to poison damage due to inhalation for the duration.",
        },
        {
          name: "Repello Inimicum",
          level: "3rd Level",
          castingTime: "1 minute",
          range: "Self (20-foot-radius hemisphere)",
          duration: "1 hour",
          year: 5,

          description:
            "You create a 20-foot-radius hemisphere of magical energy to protect you from one or more of the following: Dark wizards, other Dark beings, or Dark beasts. The circle affects creatures of the chosen type(s) in the following ways: The affected creatures can't willingly enter the hemisphere by nonmagical means. The affected creatures have disadvantage on attack rolls against targets within the hemisphere. Targets within the hemisphere can't be charmed or frightened by affected creatures.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 hour for each slot level above 3rd.",
        },
      ],
      "4th Level": [
        {
          name: "Capacious Extremis",
          level: "4th Level (ritual)",
          castingTime: "10 minutes",
          range: "Touch",
          duration: "Until dispelled",
          year: 6,
          restriction: true,
          description:
            "Transform an ordinary small bag/pouch into a Handy Haversack's central pouch, a backpack into a Bag of Holding, or a trunk's internal capacity into a Bag of Holding with: 3 ft. long and 2 ft. wide opening; internal size of 6 ft. long, 4 ft. wide, and 4 ft. deep; 1000 pounds and 150 cubic ft. limits.",
        },
        {
          name: "Confundo",
          level: "4th Level (ritual)",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          tags: ["R"],
          description:
            "The Confundus Charm is a particularly powerful charm that leaves anything confused, forgetful, and impressionable, often causing people to wander off absent-mindedly. If the target is an object you can see within range that operates or functions on its own, it will operate erratically, malfunction, or completely shut down. If the target is a creature you can see within range, it must succeed on a Wisdom saving throw when you cast this spell or be affected by it.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, you can target one additional target for each slot level above 4th.",
        },
        {
          name: "Repello Muggletum",
          level: "4th Level (ritual)",
          castingTime: "10 minutes",
          range: "Self (60-foot-radius hemisphere)",
          duration: "8 hours",
          year: 7,
          tags: ["R"],
          description:
            "Frequently used around wizarding areas, this charm keeps Muggles away from dangerous situations or overtly magical locations. You enchant an area to suggest a course of activity and magically influence a non-magical human. Upon entering the warded area, the subject must make a Wisdom saving throw at disadvantage. On a failed save, it pursues a course of action that takes it away from the area of the spell.",
        },
      ],
      "5th Level": [
        {
          name: "Cave Inimicum",
          level: "5th Level",
          castingTime: "1 minute",
          range: "Self (10-foot-radius hemisphere)",
          duration: "1 hour",
          year: 7,

          description:
            "A forcefield-like dome forms a perimeter around the caster that filters vision of anything or anyone designated by the caster, rendering those objects infallibly invisible. The dome is undetectable from the outside, but slightly visible from the inside, like a wavering glass barrier. Anyone can move through the field freely to see the hidden contents.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, you may select or stack one of the following effects for each slot level above 5th: Increase the spell radius by 20 feet, Increase the duration to 8 hours, Add the ability to completely block sounds, Add the ability to completely block smells.",
        },
        {
          name: "Ne Ustio",
          level: "5th Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 6,

          description:
            "For the duration, the creature you touch or yourself has immunity to fire damage, excluding dragon fire and the azreth spell (Fiendfyre).",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the duration is doubled for each slot level above 5th. When you use a spell slot of 8th level or higher, concentration is no longer required and its effect applies to dragon fire.",
        },
        {
          name: "Obliviate",
          level: "5th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          restriction: true,
          description:
            "You attempt to reshape another being's memories. One being you can see within range must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target becomes charmed by you for the duration. You can eliminate the target's memory of an event or detail that it experienced or perceived within the last 24 hours and that lasted no more than 10 minutes.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, you can eliminate the target's memories of an event that took place up to 7 days ago (6th level), 30 days ago (7th level), 1 year ago (8th level), or any time in the creature's past (9th level).",
        },
        {
          name: "Piertotum Locomotor",
          level: "5th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restriction: true,
          description:
            "Objects come to life at your command. Choose up to five nonmagical objects within range that are not being worn or carried. Medium targets count as one object, Large targets count as two objects, Huge targets count as four objects. You can't animate any object larger than Huge. Each target animates and becomes a creature under your control until the spell ends or until reduced to 0 hit points.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, you can animate one additional object for each slot level above 5th.",
        },
        {
          name: "Salvio Hexia",
          level: "5th Level",
          castingTime: "Action",
          range: "Self (10-foot-radius sphere)",
          duration: "Concentration, up to 1 minute",
          year: 7,

          description:
            "Each creature within the spell's area gains temporary hit points equal to your spellcasting modifier at the beginning of its turn and advantage on all saving throws against spells.",
        },
      ],
      "6th Level": [
        {
          name: "Protego Totalum",
          level: "6th Level",
          castingTime: "Action",
          range: "Self (10-foot-radius sphere)",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restriction: true,

          description:
            "An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration. Any attack or spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot. Such a spell can target creatures and objects within the barrier, but the spell has no effect on them. Similarly, the area within the barrier is excluded from the areas affected by such spells.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the barrier blocks spells of one level higher for each slot level above 6th.",
        },
      ],
      "7th Level": [
        {
          name: "Herbarifors",
          level: "7th Level",
          castingTime: null,
          range: null,
          duration: null,
          year: 7,
          restriction: false,
          description:
            "You touch a creature, and magical healing plants begin to grow from its wounds stimulating its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute). The target’s severed body members (fingers, legs, tails, and so on), if any, grow limb shaped vines, restoring the limb after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the plants to reach out to knit to the stump.",
        },
      ],
      "9th Level": [
        {
          name: "Fidelius Mysteria Celare",
          level: "9th Level",
          castingTime: "1 hour",
          range: "Self (150-foot-radius hemisphere)",
          duration: "Until dispelled",
          year: 7,
          restriction: true,
          description:
            "When cast upon a single dwelling that fits within range, it becomes a secret, infallibly invisible and inaccessible by anyone else. This effect reaches to the dwelling's property lines, or if no property lines are defined, the edge of the hemisphere centered on the caster at the time of casting. You choose yourself or one person within the area of the spell to be the Secret-Keeper. If the Secret-Keeper tells someone the secret (the location of the dwelling) verbally or in writing, that person can see the secret like the Secret-Keeper and step onto the property.",
        },
      ],
    },
  },
  "Jinxes, Hexes & Curses": {
    hasRestriction: false,
    icon: "Zap",
    color: "#B751F6",
    description: "Offensive and mischievous magic",
    levels: {
      Cantrips: [
        {
          name: "Bombarda",
          level: "Cantrip",
          year: 3,
          description:
            "A controlled explosion emanates from your wand's tip, capable of blasting open doors and breaking barriers. This spell creates a focused burst of force that can damage structures while minimizing harm to nearby creatures.",
        },
        {
          name: "Cantis",
          level: "Cantrip",
          year: 1,
          description:
            "A minor jinx that causes the target to uncontrollably sing loudly for a short duration. While harmless, it can be quite embarrassing and disruptive in social situations.",
        },
        {
          name: "Devicto",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "An advanced hex that overwhelms the target with magical interference. The spell disrupts the target's concentration and magical abilities through a combination of mathematical precision and runic power. When enhanced through extensive study, this spell demonstrates the perfect fusion of analytical and symbolic magical theory.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, you can target one additional creature for each slot level above 0.",
          restriction: false, // Available to Researcher characters even though normally restricted
        },
        {
          name: "Furnunculus",
          level: "Cantrip",
          year: 2,
          description:
            "Causes painful boils to appear on the target's skin, creating discomfort and embarrassment without permanent harm.",
        },
        {
          name: "Genu Recurvatum",
          level: "Cantrip",
          year: 1,
          description:
            "A leg-locking jinx that temporarily reverses the target's knee joints, making walking extremely difficult and awkward.",
        },
        {
          name: "Infirma Cerebra",
          level: "Cantrip",
          year: 2,
          description:
            "A mind-weakening jinx that temporarily reduces the target's cognitive abilities, making complex thoughts and concentration difficult.",
        },
        {
          name: "Locomotor Wibbly",
          level: "Cantrip",
          year: 1,
          description:
            "Causes the target's legs to move uncontrollably in a wobbling motion, making coordinated movement nearly impossible.",
        },
      ],
      "1st Level": [
        {
          name: "Colloshoo",
          level: "1st Level",
          year: 1,
          description: "Stickfast hex",
        },
        {
          name: "Densaugeo",
          level: "1st Level",
          year: 2,
          description: "Tooth-growing hex",
        },
        {
          name: "Digitus Wibbly",
          level: "1st Level",
          year: 1,
          description: "Finger-removal jinx",
        },
        {
          name: "Flipendo",
          level: "1st Level",
          year: 3,
          description: "Knockback jinx",
        },
        {
          name: "Locomotor Mortis",
          level: "1st Level",
          year: 2,
          description: "Leg-locker curse",
        },
        {
          name: "Mimblewimble",
          level: "1st Level",
          year: 1,
          description: "Tongue-tying curse",
        },
        {
          name: "Petrificus Totalus",
          level: "1st Level",
          year: 3,
          description: "Full body-bind curse",
        },
      ],
      "2nd Level": [
        {
          name: "Arania Exumai",
          level: "2nd Level",
          year: 3,
          description: "Spider repelling charm",
        },
        {
          name: "Oppugno",
          level: "2nd Level",
          year: 4,
          description: "Oppugning charm",
        },
        {
          name: "Relashio",
          level: "2nd Level",
          year: 2,
          description: "Revulsion jinx",
        },
        {
          name: "Slugulus Eructo",
          level: "2nd Level",
          year: 5,
          description: "Slug-vomiting charm",
        },
        {
          name: "Tarantallegra",
          level: "2nd Level",
          year: 2,
          description: "Dancing feet spell",
        },
        {
          name: "Ventus",
          level: "2nd Level",
          year: 3,
          tags: ["R"],
          description: "Wind jinx",
        },
      ],
      "3rd Level": [
        {
          name: "Confringo",
          level: "3rd Level",
          year: 5,
          description: "Blasting curse",
        },
        {
          name: "Conjunctivia",
          level: "3rd Level",
          year: 5,
          description: "Conjunctivitis curse",
        },
        {
          name: "Expulso",
          level: "3rd Level",
          year: 3,
          description: "Exploding curse",
        },
        {
          name: "Impedimenta",
          level: "3rd Level",
          year: 6,
          description: "Impediment jinx",
        },
        {
          name: "Langlock",
          level: "3rd Level",
          year: 4,
          restriction: true,
          description: "Tongue-tying curse",
        },
      ],
      "4th Level": [
        {
          name: "Levicorpus/Liberacorpus",
          level: "4th Level",
          year: 4,
          description: "Dangles target by ankle",
        },
        {
          name: "Muco Volatilis",
          level: "4th Level",
          year: 5,
          description: "Bat-bogey hex",
        },
        {
          name: "Reducto",
          level: "4th Level",
          year: 4,
          description: "Reductor curse",
        },
        {
          name: "Sectumsempra",
          level: "4th Level",
          year: 6,
          restriction: true,
          description: "Slashing curse",
        },
      ],
      "5th Level": [
        {
          name: "Imperio",
          level: "5th Level",
          year: 6,
          description: "Imperius curse",
        },
        {
          name: "Nullum Effugium",
          level: "5th Level",
          year: 7,
          restriction: true,
          description: "No escape curse",
        },
        {
          name: "Omnifracto",
          level: "5th Level",
          year: 7,
          restriction: true,
          description: "Breaking curse",
        },
      ],
      "7th Level": [
        {
          name: "Azreth",
          level: "7th Level",
          year: null,
          description: "Killing curse variant",
        },
        {
          name: "Crucio",
          level: "7th Level",
          year: null,
          description: "Cruciatus curse",
        },
      ],
      "8th Level": [
        {
          name: "Avada Kedavra",
          level: "8th Level",
          year: null,
          description: "Killing curse",
        },
      ],
    },
  },
  Transfigurations: {
    hasRestriction: false,
    icon: "BookOpen",
    color: "#5BC257",
    description: "Transformation and alteration magic",
    levels: {
      Cantrips: [
        {
          name: "Aguamenti",
          level: "Cantrip",
          year: 1,
          description: "Water-making spell",
        },
        {
          name: "Crinus Muto",
          level: "Cantrip",
          year: 1,
          description: "Hair color change",
        },
        {
          name: "Epoximise",
          level: "Cantrip",
          year: 1,
          description: "Bonding agent",
        },
        {
          name: "Incendio Glacia",
          level: "Cantrip",
          year: 1,
          description: "Fire and ice spell",
        },
        {
          name: "Orchideous",
          level: "Cantrip",
          year: 1,
          description: "Orchid conjuration",
        },
        {
          name: "Vera Verto",
          level: "Cantrip",
          year: 2,
          description: "True transformation",
        },
      ],
      "1st Level": [
        {
          name: "Inanimatus Conjurus",
          level: "1st Level",
          year: 2,
          tags: ["R"],
          description: "Conjures inanimate objects",
        },
        {
          name: "Incendio",
          level: "1st Level",
          year: 2,
          tags: ["R"],
          description: "Fire-making spell",
        },
        {
          name: "Nebulus",
          level: "1st Level",
          year: 3,
          description: "Fog creation",
        },
        {
          name: "Obscuro",
          level: "1st Level",
          year: 2,
          tags: ["R"],
          description: "Blindfold hex",
        },
        {
          name: "Sagittario",
          level: "1st Level",
          year: 4,
          description: "Arrow conjuration",
        },
      ],
      "2nd Level": [
        {
          name: "Incarcerous",
          level: "2nd Level",
          year: 3,
          tags: ["R"],
          description: "Rope binding",
        },
        {
          name: "Orbis",
          level: "2nd Level",
          year: 3,
          restriction: true,
          description: "Orb creation",
        },
        {
          name: "Reparifarge",
          level: "2nd Level",
          year: 3,
          restriction: true,
          description: "Untransfiguration",
        },
        {
          name: "Serpensortia",
          level: "2nd Level",
          year: 4,
          description: "Snake conjuration",
        },
      ],
      "3rd Level": [
        {
          name: "Avis",
          level: "3rd Level",
          year: 5,
          description: "Bird conjuration",
        },
        {
          name: "Evanesco",
          level: "3rd Level",
          year: 5,
          description: "Vanishing spell",
        },
        {
          name: "Ignis Laquis",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Fire rope",
        },
        {
          name: "Melofors",
          level: "3rd Level",
          year: 4,
          description: "Pumpkin head jinx",
        },
      ],
      "4th Level": [
        {
          name: "Ebublio",
          level: "4th Level",
          year: 6,
          tags: ["R"],
          description: "Bubble creation",
        },
        {
          name: "Lapifors",
          level: "4th Level",
          year: 6,
          restriction: true,
          description: "Rabbit transformation",
        },
      ],
      "5th Level": [
        {
          name: "Draconifors",
          level: "5th Level",
          year: 7,
          description: "Dragon transformation",
        },
        {
          name: "Transmogrify",
          level: "5th Level",
          year: null,
          description: "Complete transformation",
        },
      ],
      "6th Level": [
        {
          name: "Ignis Furore",
          level: "6th Level",
          year: 7,
          description: "Raging fire",
        },
      ],
    },
  },
  Divinations: {
    hasRestriction: false,
    icon: "Eye",
    color: "#D2C90C",
    description: "Sight beyond sight and knowledge magic",
    levels: {
      Cantrips: [
        {
          name: "Mumblio",
          level: "Cantrip",
          year: 3,
          restriction: true,
          description: "Mumbling charm",
        },
        {
          name: "Point Me",
          level: "Cantrip",
          year: 3,
          description: "Four-point spell",
        },
        {
          name: "Prior Incantato",
          level: "Cantrip",
          year: 3,
          description: "Reveals last spell cast",
        },
      ],
      "1st Level": [
        {
          name: "Linguarium",
          level: "1st Level",
          year: 3,
          tags: ["R"],
          description: "Language comprehension",
        },
        {
          name: "Luxus Manus",
          level: "1st Level",
          year: 4,
          tags: ["R"],
          description: "Hand of light",
        },
        {
          name: "Martem",
          level: "1st Level",
          year: 3,
          restriction: true,
          description: "War sight",
        },
        {
          name: "Motus Revelio",
          level: "1st Level",
          year: 3,
          description: "Motion detection",
        },
        {
          name: "Specialis Revelio",
          level: "1st Level",
          year: 4,
          description: "Reveals magical properties",
        },
        {
          name: "Venenum Revelio",
          level: "1st Level",
          year: 3,
          tags: ["R"],
          description: "Poison detection",
        },
      ],
      "2nd Level": [
        {
          name: "Absconditus Revelio",
          level: "2nd Level",
          year: 4,
          description: "Reveals hidden objects",
        },
        {
          name: "Facultatem",
          level: "2nd Level",
          year: 4,
          restriction: true,
          description: "Ability detection",
        },
        {
          name: "Inanimatus Revelio",
          level: "2nd Level",
          year: 4,
          description: "Inanimate detection",
        },
        {
          name: "Secundio",
          level: "2nd Level",
          year: 4,
          description: "Secondary sight",
        },
      ],
      "3rd Level": [
        {
          name: "Annotatem",
          level: "3rd Level",
          year: 5,
          description: "Note-taking charm",
        },
        {
          name: "Legilimens",
          level: "3rd Level",
          year: null,
          restriction: true,
          description: "Mind reading",
        },
        {
          name: "Linguarium Maxima",
          level: "3rd Level",
          year: 5,
          description: "Enhanced language comprehension",
        },
        {
          name: "Mumblio Maxima",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Enhanced mumbling",
        },
        {
          name: "Revelio",
          level: "3rd Level",
          year: 5,
          description: "General revealing charm",
        },
      ],
      "4th Level": [
        {
          name: "Appare Vestigium",
          level: "4th Level",
          year: 7,
          tags: ["R"],
          description: "Tracking spell",
        },
        {
          name: "Creatura Revelio",
          level: "4th Level",
          year: 6,
          description: "Creature detection",
        },
        {
          name: "Homenum Revelio",
          level: "4th Level",
          year: 7,
          description: "Human detection",
        },
        {
          name: "Oculus Speculatem",
          level: "4th Level",
          year: 6,
          description: "Scrying eye",
        },
      ],
      "5th Level": [
        {
          name: "Annotatem Maxima",
          level: "5th Level",
          year: 6,
          restriction: true,
          description: "Superior note-taking",
        },
        {
          name: "Augurium",
          level: "5th Level",
          year: 6,
          tags: ["R"],
          description: "Divinations spell",
        },
        {
          name: "Mumblio Totalum",
          level: "5th Level",
          year: 6,
          tags: ["R"],
          restriction: true,
          description: "Total mumbling",
        },
      ],
      "6th Level": [
        {
          name: "Invenire Viam",
          level: "6th Level",
          year: 7,
          restriction: true,
          description: "Path finding",
        },
        {
          name: "Verum Aspectum",
          level: "6th Level",
          year: 7,
          description: "True sight",
        },
      ],
      "9th Level": [
        {
          name: "Providentum",
          level: "9th Level",
          year: 7,
          restriction: true,
          description: "Providence spell",
        },
      ],
    },
  },
  Elemental: {
    hasRestriction: true,
    icon: "Zap",
    color: "#97C00C",
    description: "Mastery over the elements",
    levels: {
      Cantrips: [
        {
          name: "Incendio Ruptis",
          level: "Cantrip",
          year: 1,
          restriction: true,
          description: "Enhanced fire spell with explosive properties",
        },
      ],
      "1st Level": [
        {
          name: "Diffindo Glacia",
          level: "1st Level",
          year: 2,
          restriction: true,
          description:
            "Ice-cutting spell that combines slicing and freezing effects",
        },
        {
          name: "Intonuit Fluctus",
          level: "1st Level",
          year: 3,
          restriction: true,
          description: "Thunder wave spell",
        },
      ],
      "3rd Level": [
        {
          name: "Fulgur",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Lightning spell",
        },
        {
          name: "Respersio",
          level: "3rd Level",
          year: 4,
          restriction: true,
          description: "Elemental spray or splash spell",
        },
      ],
      "4th Level": [
        {
          name: "Glacius Maxima",
          level: "4th Level",
          year: 6,
          restriction: true,
          description:
            "Enhanced version of Glacius with greater freezing power",
        },
      ],
      "8th Level": [
        {
          name: "Tempestus",
          level: "8th Level",
          year: 7,
          restriction: true,
          description: "Storm conjuration spell",
        },
      ],
      "9th Level": [
        {
          name: "Fulgur Maxima",
          level: "9th Level",
          year: null,
          restriction: true,
          description: "Maximum power lightning spell",
        },
      ],
    },
  },
  Valiant: {
    hasRestriction: true,
    icon: "Shield",
    color: "#7A5E0D",
    description: "Combat and valor magic",
    levels: {
      Cantrips: [
        {
          name: "Magno",
          level: "Cantrip",
          year: 1,
          restriction: true,
          description: "Magnification or enhancement spell",
        },
      ],
      "1st Level": [
        {
          name: "Clario",
          level: "1st Level",
          year: 7,
          restriction: true,
          description: "Clarity or illumination spell for combat",
        },
        {
          name: "Ignis Ictus",
          level: "1st Level",
          year: 2,
          restriction: true,
          description: "Fire strike spell",
        },
        {
          name: "Irus Ictus",
          level: "1st Level",
          year: 2,
          restriction: true,
          description: "Anger strike spell",
        },
        {
          name: "Pererro",
          level: "1st Level",
          year: 1,
          restriction: true,
          description: "Wandering or erratic movement spell",
        },
        {
          name: "Tonitrus Ictus",
          level: "1st Level",
          year: 3,
          restriction: true,
          description: "Thunder strike spell",
        },
      ],
      "2nd Level": [
        {
          name: "Notam Ictus",
          level: "2nd Level",
          year: 4,
          restriction: true,
          description: "Mark strike spell",
        },
      ],
      "3rd Level": [
        {
          name: "Inanus Ictus",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Void or empty strike spell",
        },
      ],
      "4th Level": [
        {
          name: "Titubo Ictus",
          level: "4th Level",
          year: 6,
          restriction: true,
          description: "Staggering strike spell",
        },
      ],
      "5th Level": [
        {
          name: "Clario Maxima",
          level: "5th Level",
          year: 7,
          restriction: true,
          description: "Maximum clarity spell for combat enhancement",
        },
      ],
    },
  },
  Healing: {
    hasRestriction: false,
    icon: "Heart",
    color: "#F31717",
    description: "Restoration and medical magic",
    levels: {
      Cantrips: [
        {
          name: "Anapneo",
          level: "Cantrip",
          year: 2,
          restriction: true,
          description: "Clears breathing passages and airways",
        },
        {
          name: "Rennervate",
          level: "Cantrip",
          year: 2,
          description: "Revives unconscious persons",
        },
      ],
      "1st Level": [
        {
          name: "Episkey",
          level: "1st Level",
          year: 3,
          description: "Heals minor injuries",
        },
        {
          name: "Ferula",
          level: "1st Level",
          year: 4,
          description: "Conjures bandages and splints",
        },
        {
          name: "Reparifors",
          level: "1st Level",
          year: 3,
          description: "Heals magical transformations",
        },
      ],
      "2nd Level": [
        {
          name: "Adversus Interitus",
          level: "2nd Level (ritual)",
          year: null,
          restriction: true,
          tags: ["R"],
          description: "Protection against death",
        },
      ],
      "3rd Level": [
        {
          name: "Aculeo Sanentur",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Heals puncture wounds and stings",
        },
        {
          name: "Animatem",
          level: "3rd Level",
          year: 4,
          restriction: true,
          description: "Restores life force or animation",
        },
        {
          name: "Intus Sunt",
          level: "3rd Level (ritual)",
          year: 4,
          restriction: true,
          tags: ["R"],
          description: "Internal healing spell",
        },
      ],
      "4th Level": [
        {
          name: "Brackium Emendo",
          level: "4th Level",
          year: 5,
          description: "Mends broken bones",
        },
      ],
      "5th Level": [
        {
          name: "Pervivo",
          level: "5th Level",
          year: 6,
          restriction: true,
          description: "Survival or life extension spell",
        },
      ],
      "6th Level": [
        {
          name: "Vulnera Sanentur",
          level: "6th Level",
          year: 6,
          restriction: true,
          description: "Heals serious wounds and cuts",
        },
      ],
      "7th Level": [],
    },
  },
  Magizoo: {
    hasRestriction: false,
    icon: "PawPrint",
    color: "#E6A327",
    description: "Beast and creature magic",
    levels: {
      Cantrips: [
        {
          name: "Insectum",
          level: "Cantrip",
          year: 6,
          restriction: true,
          description: "Insect control or summoning spell",
        },
      ],
      "1st Level": [
        {
          name: "Beastia Vinculum",
          level: "1st Level",
          year: null,
          restriction: true,
          description: "Creates a bond with beasts",
        },
        {
          name: "Beastia Amicatum",
          level: "1st Level",
          year: null,
          restriction: true,
          description: "Befriends beasts and creatures",
        },
      ],
      "2nd Level": [
        {
          name: "Beastia Nuntium",
          level: "2nd Level (ritual)",
          year: 3,
          restriction: true,
          tags: ["R"],
          description: "Allows communication with beasts",
        },
        {
          name: "Beastia Sensibus",
          level: "2nd Level (ritual)",
          year: 4,
          restriction: true,
          tags: ["R"],
          description: "Shares senses with beasts",
        },
      ],
      "3rd Level": [
        {
          name: "Obtestor",
          level: "3rd Level",
          year: 4,
          restriction: true,
          description: "Implores or commands creatures",
        },
      ],
      "4th Level": [
        {
          name: "Imperio Creatura",
          level: "4th Level",
          year: null,
          restriction: true,
          description: "Commands creatures (creature-specific Imperius)",
        },
        {
          name: "Engorgio Insectum",
          level: "4th Level",
          year: 6,
          restriction: true,
          description: "Enlarges insects to massive size",
        },
      ],
      "5th Level": [
        {
          name: "Insectum Maxima",
          level: "5th Level",
          year: 6,
          restriction: true,
          description: "Maximum insect control or summoning",
        },
      ],
      "6th Level": [
        {
          name: "Natura Incantatem",
          level: "6th Level (ritual)",
          year: 7,
          restriction: true,
          tags: ["R"],
          description: "Enchants nature itself",
        },
      ],
      "7th Level": [
        {
          name: "Draconiverto",
          level: "7th Level",
          year: 7,
          restriction: true,
          description: "Dragon transformation or control",
        },
      ],
      "8th Level": [
        {
          name: "Animato Maxima",
          level: "8th Level",
          year: 7,
          restriction: true,
          description: "Maximum animation of creatures",
        },
      ],
    },
  },
  Grim: {
    hasRestriction: true,
    icon: "Skull",
    color: "#F17FF1",
    description: "Dark and fear magic",
    levels: {
      Cantrips: [
        {
          name: "Ignis Lunalis",
          level: "Cantrip",
          year: 3,
          restriction: true,
          description: "Moonfire or eerie flame spell",
        },
        {
          name: "Fraudemo",
          level: "Cantrip",
          year: 5,
          restriction: true,
          description: "Deception or illusion spell",
        },
      ],
      "1st Level": [
        {
          name: "Formidulosus",
          level: "1st Level",
          year: 3,
          restriction: true,
          description: "Induces fear and dread",
        },
      ],
      "2nd Level": [
        {
          name: "Exspiravit",
          level: "2nd Level",
          year: 4,
          restriction: true,
          description: "Expiration or breath-stealing spell",
        },
      ],
      "3rd Level": [
        {
          name: "Fraudemo Maxima",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Enhanced deception spell",
        },
        {
          name: "Timor",
          level: "3rd Level",
          year: 4,
          description: "Fear spell",
        },
      ],
      "4th Level": [
        {
          name: "Relicuum",
          level: "4th Level (ritual)",
          year: 6,
          restriction: true,
          tags: ["R"],
          description: "Relic or remnant spell",
        },
      ],
      "6th Level": [
        {
          name: "Oculus Malus",
          level: "6th Level",
          year: 7,
          restriction: true,
          description: "Evil eye curse",
        },
      ],
      "9th Level": [
        {
          name: "Menus Eruptus",
          level: "9th Level",
          year: null,
          restriction: true,
          description: "Mind eruption or mental explosion spell",
        },
      ],
    },
  },
  Forbidden: {
    hasRestriction: true,
    icon: "Ban",
    color: "#000000",
    description: "Dangerous and forbidden magic",
    levels: {
      Cantrips: [
        {
          name: "Ferio",
          level: "Cantrip",
          year: null,
          restriction: true,
          description: "Strike or wound spell",
        },
      ],
      "1st Level": [
        {
          name: "Tenebris",
          level: "1st Level",
          year: null,
          restriction: true,
          description: "Darkness spell",
        },
        {
          name: "Ferio Maxima",
          level: "1st Level",
          year: null,
          restriction: true,
          description: "Enhanced wounding spell",
        },
      ],
      "2nd Level": [
        {
          name: "Sagittario Virius",
          level: "2nd Level",
          year: null,
          restriction: true,
          description: "Poisoned arrow spell",
        },
      ],
      "3rd Level": [
        {
          name: "Gehennus Conjurus",
          level: "3rd Level",
          year: null,
          restriction: true,
          description: "Conjures hellish flames",
        },
      ],
      "5th Level": [
        {
          name: "Combustio",
          level: "5th Level",
          year: null,
          restriction: true,
          description: "Spontaneous combustion spell",
        },
      ],
      "6th Level": [
        {
          name: "Inmoritatem",
          level: "6th Level",
          year: null,
          restriction: true,
          description: "Immortality or undeath spell",
        },
        {
          name: "Undanem",
          level: "6th Level",
          year: null,
          restriction: true,
          description: "Wave or flood spell",
        },
      ],
      "8th Level": [
        {
          name: "Tenebris Maxima",
          level: "8th Level",
          year: null,
          restriction: true,
          description: "Maximum darkness spell",
        },
        {
          name: "Insanio",
          level: "8th Level",
          year: null,
          restriction: true,
          description: "Madness spell",
        },
      ],
    },
  },
  Ancient: {
    hasRestriction: true,
    icon: "Scroll",
    color: "#941212",
    description: "Lost and ancient magics",
    levels: {
      Cantrips: [
        {
          name: "Utilitatem",
          level: "Cantrip",
          year: null,
          restriction: true,
          description: "Utility or usefulness spell",
        },
      ],
      "1st Level": [
        {
          name: "Facias Infirmitatem",
          level: "1st Level",
          year: null,
          restriction: true,
          description: "Causes weakness or infirmity",
        },
      ],
      "2nd Level": [
        {
          name: "Exagitatus",
          level: "2nd Level",
          year: null,
          restriction: true,
          description: "Agitation or disturbance spell",
        },
        {
          name: "Impulso",
          level: "2nd Level",
          year: null,
          restriction: true,
          description: "Impulse or driving force spell",
        },
      ],
      "4th Level": [
        {
          name: "Maledicto",
          level: "4th Level",
          year: null,
          restriction: true,
          description: "Curse or malediction spell",
        },
        {
          name: "Sagittario Maxima",
          level: "4th Level",
          year: null,
          restriction: true,
          description: "Maximum arrow spell",
        },
      ],
      "6th Level": [
        {
          name: "Sanitatem",
          level: "6th Level",
          year: null,
          restriction: true,
          description: "Health or sanity spell",
        },
      ],
      "7th Level": [
        {
          name: "Portentia Spiculum",
          level: "7th Level",
          year: null,
          restriction: true,
          description: "Portent spike or omen dart spell",
        },
      ],
    },
  },
  Astronomic: {
    hasRestriction: true,
    icon: "Moon",
    color: "#0E48D8",
    description: "Celestial and stellar magic",
    levels: {
      Cantrips: [
        {
          name: "Lux",
          level: "Cantrip",
          year: null,
          restriction: true,
          description: "Light spell with celestial properties",
        },
        {
          name: "Ignis Lunalis",
          level: "Cantrip",
          year: 3,
          restriction: true,
          description: "Moonfire spell",
        },
      ],
      "1st Level": [
        {
          name: "Lux Maxima",
          level: "1st Level",
          year: 3,
          restriction: true,
          description: "Maximum celestial light",
        },
      ],
      "2nd Level": [
        {
          name: "Trabem",
          level: "2nd Level",
          year: 4,
          restriction: true,
          description: "Beam or ray spell",
        },
      ],
      "3rd Level": [
        {
          name: "Stellaro",
          level: "3rd Level",
          year: 5,
          restriction: true,
          description: "Star-based spell",
        },
      ],
      "5th Level": [
        {
          name: "Lunativia",
          level: "5th Level",
          year: 6,
          restriction: true,
          description: "Lunar path or moon magic",
        },
      ],
      "8th Level": [
        {
          name: "Solativia",
          level: "8th Level",
          year: 7,
          restriction: true,
          description: "Solar path or sun magic",
        },
      ],
    },
  },
  "Prof. Charms": {
    hasRestriction: true,
    icon: "GraduationCap",
    color: "#51DDF6",
    description: "Professional and advanced charm work",
    levels: {
      "1st Level": [
        {
          name: "Diffindo",
          level: "1st Level (ritual)",
          year: 2,
          restriction: true,
          tags: ["R"],
          description: "Professional version of the cutting spell",
        },
      ],
      "2nd Level": [
        {
          name: "Immobulus",
          level: "2nd Level",
          year: 2,
          restriction: true,
          description: "Professional version of the freezing spell",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo",
          level: "3rd Level (ritual)",
          year: 5,
          restriction: true,
          tags: ["R"],
          description: "Depression or lowering spell",
        },
      ],
      "4th Level": [
        {
          name: "Confundo",
          level: "4th Level (ritual)",
          year: 6,
          restriction: true,
          tags: ["R"],
          description: "Professional version of the confusion charm",
        },
      ],
      "5th Level": [],
    },
  },
  Trickery: {
    hasRestriction: true,
    icon: "Star",
    color: "#d55713",
    description: "Illusion and misdirection magic",
    levels: {
      Cantrips: [
        {
          name: "Manus",
          level: "Cantrip",
          year: 1,
          restriction: false,
          description:
            "Create a spectral floating hand that can manipulate objects, open doors, and carry up to 10 pounds within 30 feet for 1 minute",
        },
      ],
      "1st Level": [],
      "2nd Level": [
        {
          name: "Tranquillitatem",
          level: "2nd Level",
          year: 3,
          restriction: false,
          description:
            "Suppress strong emotions in a 20-foot radius. Remove charm/fear effects or make hostile creatures indifferent toward chosen targets. Concentration, up to 1 minute",
        },
      ],
      "3rd Level": [
        {
          name: "Fictus",
          level: "3rd Level",
          year: 4,
          restriction: false,
          description:
            "Create a realistic illusion up to 20-foot cube with sounds, smells, and temperature. Lasts 10 minutes with concentration. Physical interaction reveals it's fake. At 6th level+, becomes permanent without concentration",
        },
        {
          name: "Roboratum",
          level: "3rd Level",
          year: 5,
          restriction: false,
          description:
            "Grant up to 5 creatures 5 temporary HP, advantage on Wisdom saves, and advantage on next attack after being hit. Lasts 1 hour. Higher levels add +5 temp HP per slot level",
        },
      ],
      "4th Level": [],
      "5th Level": [],
      "6th Level": [
        {
          name: "Incarcerebra",
          level: "6th Level",
          year: 7,
          restriction: false,
          description:
            "Bind a creature in an illusory cell only it perceives. Target takes 5d10 psychic damage and is restrained, unable to see/hear beyond the illusion. Moving through it deals 10d10 damage and ends the spell",
        },
      ],
      "7th Level": [],
      "8th Level": [
        {
          name: "Dubium/Fiducium",
          level: "8th Level",
          year: 7,
          restriction: false,
          description:
            "Enchant an object/area with an aura that repels (Dubium) or attracts (Fiducium) specified intelligent creatures. Lasts 10 days. Targets must save or be frightened away or compelled to approach within 60 feet",
        },
      ],
      "9th Level": [],
    },
  },
};

export const INDIVIDUAL_SPELL_MODIFIERS = {
  Ferio: SUBJECT_TO_MODIFIER_MAP.jhc,
  Tenebris: SUBJECT_TO_MODIFIER_MAP.jhc,
  "Ferio Maxima": SUBJECT_TO_MODIFIER_MAP.jhc,
  "Sagittario Virius": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Gehennus Conjurus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Combustio: SUBJECT_TO_MODIFIER_MAP.jhc,
  Inmoritatem: SUBJECT_TO_MODIFIER_MAP.jhc,
  Undanem: SUBJECT_TO_MODIFIER_MAP.jhc,
  "Tenebris Maxima": SUBJECT_TO_MODIFIER_MAP.jhc,
  Insanio: SUBJECT_TO_MODIFIER_MAP.jhc,

  Utilitatem: SUBJECT_TO_MODIFIER_MAP.charms,
  "Facias Infirmitatem": SUBJECT_TO_MODIFIER_MAP.charms,
  Exagitatus: SUBJECT_TO_MODIFIER_MAP.divinations,
  Impulso: SUBJECT_TO_MODIFIER_MAP.charms,
  Maledicto: SUBJECT_TO_MODIFIER_MAP.jhc,
  "Sagittario Maxima": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Sanitatem: SUBJECT_TO_MODIFIER_MAP.healing,
  "Portentia Spiculum": SUBJECT_TO_MODIFIER_MAP.transfiguration,

  Lux: SUBJECT_TO_MODIFIER_MAP.divinations,
  "Ignis Lunalis": SUBJECT_TO_MODIFIER_MAP.divinations,
  "Lux Maxima": SUBJECT_TO_MODIFIER_MAP.divinations,
  Trabem: SUBJECT_TO_MODIFIER_MAP.divinations,
  Stellaro: SUBJECT_TO_MODIFIER_MAP.divinations,
  Lunativia: SUBJECT_TO_MODIFIER_MAP.divinations,
  Solativia: SUBJECT_TO_MODIFIER_MAP.divinations,

  Insectum: SUBJECT_TO_MODIFIER_MAP.jhc,
  "Beastia Vinculum": SUBJECT_TO_MODIFIER_MAP.divinations,
  "Beastia Amicatum": SUBJECT_TO_MODIFIER_MAP.charms,
  "Beastia Nuntium R": SUBJECT_TO_MODIFIER_MAP.charms,
  "Beastia Sensibus R": SUBJECT_TO_MODIFIER_MAP.divinations,
  Obtestor: SUBJECT_TO_MODIFIER_MAP.charms,
  "Imperio Creatura": SUBJECT_TO_MODIFIER_MAP.charms,
  "Engorgio Insectum": SUBJECT_TO_MODIFIER_MAP.charms,
  "Insectum Maxima": SUBJECT_TO_MODIFIER_MAP.jhc,
  "Natura Incantatem R": SUBJECT_TO_MODIFIER_MAP.divinations,
  Draconiverto: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Animato Maxima": SUBJECT_TO_MODIFIER_MAP.transfiguration,

  Fraudemo: SUBJECT_TO_MODIFIER_MAP.charms,
  Formidulosus: SUBJECT_TO_MODIFIER_MAP.divinations,
  Exspiravit: SUBJECT_TO_MODIFIER_MAP.divinations,
  "Fraudemo Maxima": SUBJECT_TO_MODIFIER_MAP.divinations,
  Timor: SUBJECT_TO_MODIFIER_MAP.charms,
  "Relicuum R": SUBJECT_TO_MODIFIER_MAP.divinations,
  "Oculus Malus": SUBJECT_TO_MODIFIER_MAP.jhc,
  "Menus Eruptus": SUBJECT_TO_MODIFIER_MAP.divinations,

  Magno: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Clario: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Ignis Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Irus Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Pererro: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Tonitrus Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Notam Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Inanus Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Titubo Ictus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Clario Maxima": SUBJECT_TO_MODIFIER_MAP.transfiguration,

  "Incendio Ruptis": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Diffindo Glacia": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Intonuit Fluctus": SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Fulgur: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Respersio: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Glacius Maxima": SUBJECT_TO_MODIFIER_MAP.charms,
  Tempestus: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Fulgur Maxima": SUBJECT_TO_MODIFIER_MAP.transfiguration,
};

export const TRADITIONAL_SCHOOL_MAPPINGS = {
  Charms: SUBJECT_TO_MODIFIER_MAP.charms,
  "Jinxes, Hexes & Curses": SUBJECT_TO_MODIFIER_MAP.jhc,
  JHC: SUBJECT_TO_MODIFIER_MAP.jhc,
  Transfigurations: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Transfiguration: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Healing: SUBJECT_TO_MODIFIER_MAP.healing,
  Divinations: SUBJECT_TO_MODIFIER_MAP.divinations,
};

export const CATEGORY_DEFAULT_MAPPINGS = {
  Valiant: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  Forbidden: SUBJECT_TO_MODIFIER_MAP.jhc,
  Astronomic: SUBJECT_TO_MODIFIER_MAP.divinations,
  Ancient: null,
  Magizoo: SUBJECT_TO_MODIFIER_MAP.charms,
  Grim: SUBJECT_TO_MODIFIER_MAP.divinations,
  Elemental: SUBJECT_TO_MODIFIER_MAP.transfiguration,
  "Defense Against the Dark Arts": SUBJECT_TO_MODIFIER_MAP.jhc,
};
