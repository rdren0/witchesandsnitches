import { SUBJECT_TO_MODIFIER_MAP } from "./data";

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
  "Justice-Cantrips": false,
  "Justice-1st Level": false,
  "Justice-2nd Level": false,
  "Justice-4th Level": false,
  "Justice-8th Level": false,
  "Justice-9th Level": false,
  "Gravetouched-Cantrips": false,
  "Gravetouched-1st Level": false,
  "Gravetouched-2nd Level": false,
  "Gravetouched-3rd Level": false,
  "Gravetouched-5th Level": false,
  "Gravetouched-8th Level": false,
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
  ["charms"],
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
          class: ["Charms"],
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          checkType: "none",
          description:
            "A target object is pulled directly to the caster as if carried by an invisible hand. The object is selected by pointing at it with a wand or by naming it, Accio broom. An object heavier than 20 pounds may not be summoned.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, you may select or stack one of the following effects for each slot level above 0: Increase spell range by 100 feet, Increase weight limit by 20 pounds, Increase the number of targetable objects by 5.",
        },
        {
          name: "Alohomora",
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 1,
          description:
            "This spell sends red (periculum) or green (verdimillious) sparks shooting from the casters wand for signaling purposes. It may also appear as a flare, traveling a desired distance before exploding in light and hovering in the air.",
        },
        {
          name: "Sonorus/Quietus",
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          name: "Arresto Momentum",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime:
            "1 reaction, which you take when you or a creature within 60 feet of you falls",
          range: "60 Feet",
          duration: "1 minute",
          year: 2,
          description:
            "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature. This spell is particularly useful for preventing fall damage from great heights or during aerial combat situations.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target two additional falling creatures for each slot level above 1st, and the duration increases by 1 minute for each slot level above 1st.",
        },
        {
          name: "Diffindo",
          class: ["Charms"],
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          checkType: "savingThrow",
          savingThrow: {
            ability: "dexterity",
            effect: "halfDamage",
          },
          damage: {
            dice: "4d4",
            type: "slashing",
          },
          description:
            "An object is precisely torn or cut, as if a magical blade extended from the tip of your wand. This spell was not designed to be used on creatures and only makes very shallow cuts. Choose a target you can see within range that fits within a 5-foot cube. If the target is a creature, it must make a Dexterity saving throw. It takes 4d4 slashing damage on a failed save or half as much damage on a successful one. This is the counterspell to incarcerous, immediately ending that spell's effects.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature or the cube's size increases by 5 feet for each slot level above 1st.",
        },
        {
          name: "Exhilaro",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
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
          class: ["Charms"],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Hour",
          year: 1,
          checkType: "savingThrow",
          savingThrow: {
            ability: "constitution",
            effect: "halfDamage",
          },
          damage: {
            dice: "3d8",
            type: "cold",
          },
          description:
            "You freeze an area of water that you can see within range and that fits within a 5-foot cube. The area becomes difficult terrain for the duration. Each Medium or smaller creature that is covered, submerged or partially submerged in the affected water has its speed halved and must make a Constitution saving throw. On a failed save, a creature takes 3d8 cold damage, or half as much damage on a successful one.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 and the cube's size increases by 5 feet for each slot level above 1st.",
        },
        {
          name: "Locomotor",
          class: ["Charms"],
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "1 Hour",
          year: 2,
          description:
            "One object that isn't being worn or carried of your choice that you can see within range rises 3 feet off the ground, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. If more weight than the limit is placed on top of the object, the spell ends, and it falls to the ground. The object is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the object follows you so that it remains within 20 feet of you.",
        },
        {
          name: "Mobilicorpus",
          class: ["Charms"],
          level: "1st Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 hour",
          year: 3,
          description:
            "You animate a corpse or unconscious creature to move under your control for the duration.",
        },
        {
          name: "Perfusorius",
          class: ["Charms"],
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 2,
          description:
            "This spell alters an object of up to 500 pounds, changing its weight to be just barely heavier than the atmosphere around it. The slightest force is needed to move, pick up, or carry this object for the duration. It can be easily thrown as well.",
        },
        {
          name: "Protego",
          class: ["Defense Against the Dark Arts"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
          level: "1st Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 hour",
          year: 3,
          description:
            "You cause an object that isn't being worn or carried and that you can see within range to shrink in size for the duration. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category – from Medium to Small, for example.",
        },
        {
          name: "Rictusempra",
          class: ["Charms"],
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
          class: ["Charms"],
          level: "1st Level",
          castingTime: "1 Minute",
          range: "30 Feet",
          duration: "8 Hours",
          year: 2,
          description:
            "You set a mental alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, a ping in your mind alerts you whenever a Tiny or larger creature touches or enters the warded area, if you are within 1 mile of the warded area. This ping awakens you if you are sleeping. When you cast the spell, you can designate creatures that won't set off the alarm.",
        },
      ],
      "2nd Level": [
        {
          name: "Abscondi",
          class: ["Charms"],
          level: "2nd Level",
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
          class: ["Charms"],
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
          class: ["Charms"],
          level: "2nd Level",
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
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          checkType: "spellAttack",
          attackType: "ranged",
          description:
            "Famous for being the spell that finally defeated Voldemort in the Second Wizarding War, this spell can harmlessly end duels by disarming a wizard of his wand. Make a ranged spell attack against a being within range. On a hit, you disarm the target, forcing it to drop one item of your choice that it's holding. The object lands 10 feet away from it in a random direction.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can choose the direction the object travels and the object's distance increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Finite Incantatem",
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "10 days",
          year: 3,
          description:
            "You tap an object that fits within a 1-foot cube with your wand and a perfect duplicate of it pops out from the object. The duplicate is indistinguishable from the object by normal means, but does not share any of its magical qualities or functions. The duplicate has one quarter of the original object's hit points and vanishes at the end of the spell's duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the cube's size increases by 1 foot for each slot level above 2nd.",
        },
        {
          name: "Immobulus",
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          name: "Pelucidi Pellis",
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "This spell magically reverses any damage done to any objects or structures within a 5-foot cube, collecting all the pieces or components and reassembling them. Anything previously contained by the broken target, like a spilled liquid, is not placed back inside it. This spell can physically repair a magic item, but the spell can't restore magic to such an object.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the cube's size increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Silencio",
          level: "2nd Level",
          class: ["Defense Against the Dark Arts"],
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
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "10 Minutes",
          year: 3,
          checkType: "spellAttack",
          attackType: "ranged",
          description:
            "This charm is the most common dueling spell in the wizarding world, harmlessly ending a duel between two wizards. Make a ranged spell attack against a being within range. On a hit, the target falls unconscious for the duration, or until they are revived with rennervate.",
          higherLevels:
            "If you cast this spell using a spell slot of 3rd level or higher, the duration increases to 1 hour (3rd level) or 8 hours (4th level). Alternatively, when you cast this spell using a spell slot of 4th level or higher, you can target a beast instead of a being, for a duration of 10 minutes (4th level), 1 hour (5th level) or 8 hours (6th level).",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo",
          level: "3rd Level",
          class: ["Defense Against the Dark Arts"],
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
          class: ["Defense Against the Dark Arts"],
          range: "60 Feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. Physical interaction with the image reveals it to be an illusion, because things can pass through it.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the shove distance is increased by 10 feet for each slot level above 3rd.",
        },
        {
          name: "Dissonus Ululatus",
          level: "3rd Level",
          class: ["Charms"],
          castingTime: "10 minutes",
          range: "Self (30-foot-radius hemisphere)",
          duration: "8 hours",
          year: 5,

          description:
            "You set an alarm to emit a piercing shriek when an unauthorized person enters the area. Until the spell ends, an alarm sounds whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures or areas within the hemisphere that won't set off the alarm. The alarm produces an unpleasant screaming sound for as long as the intruding creature is in the area of the spell, audible from as far away as 300 feet.",
        },
        {
          name: "Expecto Patronum",
          level: "3rd Level",
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 5,
          tags: ["Defensive"],
          description:
            "Whenever you cast this spell on an active defensive spell within range that improves a creature's AC or grants it temporary hit points, each creature affected by the targeted spell gains temporary hit points equal to twice your caster level + your spellcasting ability modifier. When the targeted spell ends or an affected creature is no longer affected by it, the creature loses any remaining temporary hit points from this spell. If you are maintaining concentration or dedication on a defensive spell, this spell can uniquely be cast on that active defensive spell without ending that spell or breaking your concentration or dedication.",
        },
        {
          name: "Fortissimum",
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Charms"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "1 hour",
          year: 3,
          description:
            "A 60-foot-radius sphere of light spreads out from a small floating ball of light that hovers in place. The sphere is bright light and sheds dim light for an additional 60 feet. As a bonus action, you can direct the ball of light to a new position within range.",
        },
        {
          name: "Novum Spirare",
          class: ["Charms"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "24 hours",
          year: 4,
          description:
            "Accurately named, the bubble-head charm forms a large bubble-like mask over a creature's mouth, nose, and ears that is magically filled with never-ending fresh air. This spell grants one willing creature you can see within range the ability to breathe underwater or in a vacuum until the spell ends. Additionally, the creature is immune to poison damage due to inhalation for the duration.",
        },
        {
          name: "Repello Inimicum",
          level: "3rd Level",
          class: ["Charms"],
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
          class: ["Charms"],
          level: "4th Level",
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
          class: ["Charms"],
          level: "4th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          description:
            "The Confundus Charm is a particularly powerful charm that leaves anything confused, forgetful, and impressionable, often causing people to wander off absent-mindedly. If the target is an object you can see within range that operates or functions on its own, it will operate erratically, malfunction, or completely shut down. If the target is a creature you can see within range, it must succeed on a Wisdom saving throw when you cast this spell or be affected by it.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, you can target one additional target for each slot level above 4th.",
        },

        {
          name: "Repello Muggletum",
          class: ["Charms"],
          level: "4th Level",
          castingTime: "10 minutes",
          range: "Self (60-foot-radius hemisphere)",
          duration: "8 hours",
          year: 7,
          description:
            "Frequently used around wizarding areas, this charm keeps Muggles away from dangerous situations or overtly magical locations. You enchant an area to suggest a course of activity and magically influence a non-magical human. Upon entering the warded area, the subject must make a Wisdom saving throw at disadvantage. On a failed save, it pursues a course of action that takes it away from the area of the spell.",
        },
      ],
      "5th Level": [
        {
          name: "Cave Inimicum",
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
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
          class: ["Charms"],
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
          class: ["Charms"],
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
          class: ["Defense Against the Dark Arts"],
          range: "Self (10-foot-radius sphere)",
          duration: "Concentration, up to 1 minute",
          year: 7,

          description:
            "Each creature within the spell's area gains temporary hit points equal to your spellcasting modifier at the beginning of its turn and advantage on all saving throws against spells.",
        },
      ],
      "6th Level": [],
      "7th Level": [
        {
          name: "Herbarifors",
          class: ["Defense Against the Dark Arts"],
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
      "8th Level": [],
      "9th Level": [],
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
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "The spell blasts whatever it hits, creating a localized concussive explosion upon impact. Make a ranged spell attack against a target within range. On a hit, the target takes 1d10 bludgeoning damage.",
          higherLevels:
            "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
        },
        {
          name: "Cantis",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Round",
          year: 1,
          description:
            "When struck by this spell, a being can't help but belt out a couple of lines from the first song that comes to mind. Make a ranged spell attack against a being within range. On a hit, the target must cast all other spells non-verbally until the end of its next turn. If it tries to cast a spell verbally, it must first succeed on an Intelligence saving throw, or the casting fails and the spell is wasted.",
        },
        {
          name: "Devicto",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "This weak jinx is a classic training spell between duelists, a startling sting on impact. Make a ranged spell attack against a creature within range. On a hit, it takes 1d6 force damage, and it can't take reactions until the start of its next turn.",
          higherLevels:
            "The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
        },
        {
          name: "Furnunculus",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          checkType: "spellAttack",
          attackType: "ranged",
          damage: {
            dice: "1d4",
            type: "psychic",
          },
          description:
            "Outbreaks of this jinx is a common occurrence when students get in fights, resulting in grotesque pimples covering the victims face. Make a ranged spell attack against a being within range. On a hit, it takes 1d4 psychic damage and has disadvantage on the next attack roll it makes before the end of its next turn. Additionally, it has disadvantage on the next Charisma ability check it makes.",
          higherLevels:
            "This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).",
        },
        {
          name: "Genu Recurvatum",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Minute",
          year: 1,
          description:
            "This hex flips around a beast or being's knees, forcing them to take awkward, uncoordinated steps. Make a ranged spell attack against a creature within range. On a hit, the target's speed is halved for the duration of the spell.",
        },
        {
          name: "Infirma Cerebra",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "1 Action",
          range: "60 Feet",
          duration: "1 Round",
          year: 2,
          description:
            "This jinxes a target's mind, giving them a brief moment of disorientation. Make a ranged spell attack against a creature within range. On a hit, the target takes 1d6 psychic damage, and the first time it makes a saving throw before the end of your next turn, it must roll a d4 and subtract the number rolled from the save.",
          higherLevels:
            "This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
        },
        {
          name: "Locomotor Wibbly",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "This will make a person's legs so unsteady and weak that they aren't able to keep their balance. Make a ranged spell attack against a being within range. On a hit, the target is knocked prone.",
        },
      ],
      "1st Level": [
        {
          name: "Colloshoo",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "Concentration, 1 Minute",
          year: 1,
          description:
            "This creative hex sticks a being's shoes to the ground, rooting them in place. Choose a being you can see within range that is wearing shoes to make a Dexterity saving throw. On a failed save, the target is restrained for the duration. If the saving throw fails by 5 or more, the target is knocked prone as well. The target can use its action to take off its shoes, or make a Strength check against your spell save DC. On a success, it pulls its shoes free.",
        },
        {
          name: "Densaugeo",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "A target's front two teeth grow abnormally long, protruding downwards past its chin. Make a ranged spell attack against a creature within range. On a hit, it takes 2d8 psychic damage and has disadvantage on the next attack roll it makes before the end of its next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage is increased by 1d8 for each slot level above 1st.",
        },
        {
          name: "Digitus Wibbly",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "1 Minute",
          year: 1,
          description:
            "This jinx makes fingers numb and relaxed. Make a ranged spell attack against a being within range. On a hit, the target has disadvantage on attack rolls for the duration. At the end of each of its turns, the target can make a Dexterity saving throw. On a success, the spell ends.",
        },
        {
          name: "Flipendo",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "The spell feels like a very heavy blow, sharply throwing a creature from its standing position to the ground. Choose a being you can see within range to make a Strength saving throw. On a failed save, a creature takes 1d10 bludgeoning damage, is knocked back a number of feet equal to five times your spellcasting ability modifier, and is knocked prone. On a successful save, the creature takes half as much damage, is knocked back 5 feet, and isn't knocked prone.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 and the knockback on a failed save increases by 5 feet for each slot level above 1st.",
        },
        {
          name: "Locomotor Mortis",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 Action",
          range: "90 Feet",
          duration: "1 Minute",
          year: 2,
          description:
            "A common tool among bullies, this 'curse' binds a creature's legs as if they were tied together with rope. A creature you can see within range must succeed on a Wisdom saving throw or have its speed halved and suffer disadvantage on Dexterity saving throws. Additionally, each time it moves within the duration, it must succeed on a Dexterity saving throw without disadvantage from this spell, or be knocked prone and take 2d4 bludgeoning damage.",
        },
        {
          name: "Mimblewimble",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "1 Round",
          year: 1,
          description:
            "If you're hit with this spell, this produces the strange sensation of your tongue being rolled up into the back of your mouth. Choose one being you can see within range. If it tries to cast a spell verbally before the end of its next turn, it must first succeed on a Dexterity saving throw, or the casting fails and the spell is wasted.",
        },
        {
          name: "Petrificus Totalus",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Dedication, up to 1 minute",
          year: 3,
          description:
            "This spell makes a being's arms and legs snap together, and it will fall down, stiff as a board. Make a ranged spell attack against a being within range. On a hit, the target is knocked prone and paralyzed for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target a beast instead of a being.",
        },
      ],
      "2nd Level": [
        {
          name: "Arania Exumai",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "Self (15 foot cube)",
          duration: "Instantaneous",
          year: 3,
          description:
            "This spell blasts away spiders, Acromantulas, or arachnids with a cone of bright scorching light. Each spider-like creature in a 30-foot cone must make a Constitution saving throw. On a failed save, a creature takes 4d6 radiant damage and is knocked back 5 feet plus a number of feet equal to five times your spellcasting ability modifier. On a successful save, it takes half as much damage and isn't knocked back. Any non-arachnid creatures within the area of the spell are unaffected.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 and the shove distance increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Oppugno",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          description:
            "You cast this jinx on a group of tiny objects or a group of birds within range. The targets start swarming in the air in a 5-foot-diameter sphere in an unoccupied space of your choice. Any creature that starts its turn within 5 feet of the swarm or enters the swarm's area for the first time on a turn must make a Dexterity saving throw. The creature takes 4d4 slashing damage on a failed save, or half as much damage on a successful one. As a bonus action, you can move the sphere up to 30 feet. While the swarm shares the same space with a creature, that creature has disadvantage on attack rolls. The swarm's space counts as difficult terrain.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d4 for each slot level above 2nd.",
        },
        {
          name: "Relashio",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "This spell forces both living and inanimate targets to release their grip. Choose an object or creature that you can see within range. The object can be a set of manacles, a padlock, chains, or another object that is wrapped around or restraining something. If the target is a creature, it must make a Wisdom saving throw. On a failed save, it must let go of whatever it is restraining. This effect ends any grappled or restrained condition that is being imposed by the target. An object that is secured by a mundane or magical lock or that is stuck becomes unlocked, unstuck, or unbarred. When you cast the spell on an object, a loud rattling or clanking, audible from as far away as 100 feet, emanates from the target object. A creature is not forced to drop any object that it is holding. The creature must be restraining the object in some way, like holding onto an object that has had accio cast upon it.",
        },
        {
          name: "Slugulus Eructo",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "1 round",
          year: 5,
          description:
            "This particularly nasty hex causes one to spit up slugs for the duration. Make a ranged spell attack against a creature within range. On a hit, it takes 3d8 psychic damage and gains one level of exhaustion. This spell cannot cause it to reach more than 5 levels of exhaustion. If it tries to cast a spell verbally before the end of its next turn, it must first succeed on a Constitution saving throw, or the casting fails and the spell is wasted.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
        },
        {
          name: "Tarantallegra",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 2,
          description:
            "This entertaining jinx forces its victim to do a comic dance in place: shuffling, tapping its feet, and capering. Make a ranged spell attack against a target within range. On a hit, a dancing creature must use all its movement to dance without leaving its space until the end of your next turn. While the creature is affected by this spell, it has disadvantage on Dexterity saving throws and attack rolls and other creatures have advantage on attack rolls against it. As an action, a dancing creature can make a Wisdom saving throw to regain control of itself. On a successful save, the spell ends.",
        },
        {
          name: "Ventus",
          class: ["Defense Against the Dark Arts"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 3,
          description:
            "A strong gust of air flows out from the tip of your wand, and creates one of the following effects at a point you can see within range: One Medium or smaller creature that you choose must succeed on a Strength saving throw or be instantaneously pushed up to 5 feet away from you and be rendered unable to move closer to you for the duration. You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you per round, for the duration of the spell. It isn't pushed with enough force to cause damage. You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze. If desired, the air can be hot and function like a blow dryer.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd. The creatures must be within 30 feet of each other when you target them.",
        },
      ],
      "3rd Level": [
        {
          name: "Confringo",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 5,
          checkType: "savingThrow",
          savingThrow: {
            ability: "dexterity",
            effect: "halfDamage",
          },
          damage: {
            dice: "8d6",
            type: "fire",
          },
          description:
            "A tiny ball of fire flashes from your wand to a point you choose within range and then explodes into a fiery blast on impact. Each creature in a 10-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren't worn or carried.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 and the radius increases by 5 feet for each slot level above 3rd.",
        },
        {
          name: "Conjunctivia",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "1 minute",
          year: 5,
          description:
            "When struck by this curse, a creature's eyes to become irritated and painful, swelling shut. Make a ranged spell attack against a creature within range. On a hit, the target takes 4d8 necrotic damage and is blinded for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends. Creatures that are normally magically resistant are vulnerable to this spell.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
        {
          name: "Expulso",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "The spell shoots out from your wand and a wave of thunderous force sweeps out from a point of your choice within range. Each creature in a 10-foot-radius sphere centered on that point must make a Constitution saving throw. On a failed save, a creature takes 4d8 thunder damage and is pushed 10 feet away from that point. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from that point by the spell's effect, and the spell emits a thunderous boom audible out to 100 feet.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
        {
          name: "Impedimenta",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "1 minute",
          year: 6,
          description:
            "A powerful dueling spell, this jinx alters time around one creature you can see within range, severely inhibiting its ability in combat. The target must succeed on a Wisdom saving throw or be affected by this spell for the duration. An affected target's speed is halved, it takes a -2 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature's abilities or magic items, it can't make more than one melee or ranged attack during its turn. If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until the creature's next turn, and the creature must use its action on that turn to complete the spell. If it can't, the spell is wasted. A creature affected by this spell makes another Wisdom saving throw at the end of its turn. On a successful save, the effect ends for it.",
        },
        {
          name: "Langlock",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime:
            "1 action or reaction, which you take when you see a creature within 60 feet of you casting a spell",
          range: "60 feet",
          duration: "1 round",
          year: 4,
          restriction: true,
          description:
            "You attempt to interrupt a being you can see in the process of casting a spell. If the creature is verbally casting a spell of 3rd level or lower, its spell fails and has no effect. If it is verbally casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect. On a success or if the being was casting the spell non-verbally, the target must cast all other spells non-verbally until the end of its next turn. If it tries to cast a spell verbally, it must first succeed on an Intelligence saving throw, or the casting fails and the spell is wasted.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.",
        },
      ],
      "4th Level": [
        {
          name: "Levicorpus/Liberacorpus",
          class: ["Defense Against the Dark Arts"],
          level: "4th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 minute",
          year: 4,
          description:
            "One of the few spells that are a non-verbal spell by design, this jinx yanks a being's feet out from under it and dangles it in the air, hanging by its ankle. This spell always is cast with the effects of the Subtle Spell metamagic, at no sorcery point cost and whether you have Subtle Spell or not. A creature you can see within range must make a Wisdom saving throw or take 3d10 psychic damage and be restrained. Additionally, if the target tries to cast a spell, it must first succeed on a Wisdom saving throw, or the casting fails and the spell is wasted.",
        },
        {
          name: "Muco Volatilis",
          class: ["Defense Against the Dark Arts"],
          level: "4th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          description:
            "This terrifying spell transforms the victim's bogies (or boogers) into nasty green bats that crawl out of their nose and attack. Make a ranged spell attack against a being within range. On a hit, the target and any hostile creatures within 5 feet of the target take 6d4 slashing damage. At the start of the target's turn and when any hostile creature starts its turn within 5 feet of the target, it takes 3d4 slashing damage. If any creature has to make a saving throw to maintain concentration because of this spell's damage, the saving throw is made at disadvantage.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the initial damage increases by 2d4 for each slot level above 4th.",
        },
        {
          name: "Reducto",
          class: ["Defense Against the Dark Arts"],
          level: "4th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 4,
          description:
            "This spell disintegrates a Large or smaller nonmagical object or transfigured/conjured construct you can see within range. If the target is a Huge or larger object or construct, this spell disintegrates a 10-foot-cube portion of it.",
        },
        {
          name: "Sectumsempra",
          class: ["Defense Against the Dark Arts"],
          level: "4th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: 6,
          restriction: true,
          description:
            "Make a ranged spell attack against a target within range. On a hit, the target must make a Constitution saving throw. On a failed save, a creature takes 10d6 slashing damage and another 5d6 slashing damage at the end of its next turn. On a successful save, a creature takes half the initial damage and half the damage at the end of its next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the initial damage increases by 2d6 for each slot level above 4th.",
        },
      ],
      "5th Level": [
        {
          name: "Imperio",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          checkType: "savingThrow",
          savingThrow: {
            ability: "wisdom",
            effect: "negates",
          },
          description:
            "You attempt to beguile a humanoid that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the target is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as 'Attack that creature,' 'Run over there,' or 'Fetch that object.' If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability. You can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
        },
        {
          name: "Nullum Effugium",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "10 minutes",
          range: "Self (60-foot-radius sphere)",
          duration: "8 hours",
          year: 7,
          restriction: true,
          description:
            "Commonly used by the Department of Magical Law enforcement, this wards an area against apparition or disapparition. No one may arrive in the warded area via apparition, nor may any creatures within the warded area cast the spell. Any attempt to do so results in the typical apparition effect, except the creature stays exactly where they are.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the radius of the sphere increases by 60 feet for each slot level above 5th.",
        },
        {
          name: "Omnifracto",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 7,
          restriction: true,
          description:
            "A piercing beam of light shoots out from the tip of your wand, shattering any defensive magic it passes through. Choose a target within range. Protego totalum, repello inimicum, and all defensive spells that are improving that creature's AC or granting it temporary hit points are dispelled.",
        },
      ],
      "7th Level": [
        {
          name: "Azreth",
          class: ["Defense Against the Dark Arts"],
          level: "7th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: null,
          description:
            "Fiendfyre - A cursed fire that takes the shape of fantastic beasts and is extremely difficult to control. The fire spreads rapidly and can destroy almost anything in its path, including Horcruxes. Only the most skilled dark wizards dare attempt this spell.",
        },
        {
          name: "Crucio",
          class: ["Defense Against the Dark Arts"],
          level: "7th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          description:
            "The Cruciatus Curse - One of the three Unforgivable Curses. Causes intense, excruciating pain to the victim. Prolonged use can cause permanent insanity. Using this curse on another human being is punishable by a life sentence in Azkaban.",
        },
        {
          name: "Nullum Effigium",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "10 minutes",
          range: "Self (60-foot-radius sphere)",
          duration: "8 hours",
          year: 7,
          description:
            "Commonly used by the Department of Magical Law enforcement, this wards an area against apparition or disapparition. No one may arrive in the warded area via apparition, nor may any creatures within the warded area cast the spell. Any attempt to do so results in the typical apparition effect, except the creature stays exactly where they are. At Higher Levels: When you cast this spell using a spell slot of 6th level or higher, the radius of the sphere increases by 60 feet for each slot level above 5th.",
        },
      ],
      "8th Level": [
        {
          name: "Avada Kedavra",
          class: ["Defense Against the Dark Arts"],
          level: "8th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: null,
          description:
            "The Killing Curse - One of the three Unforgivable Curses. Causes instant death with no known counter-curse. There is no way to block it except with physical barriers or sacrificial protection. Using this curse is punishable by a life sentence in Azkaban. Known to leave no trace of physical damage on the victim.",
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
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Self (30 Foot Cone)",
          duration: "Dedication, 1 Minute",
          year: 1,
          description:
            "A cone of clear, pure water shoots from the tip of the caster's wand with the desired force. The water doesn't go bad and extinguishes exposed flames in the area.",
        },
        {
          name: "Crinus Muto",
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "1 Action",
          range: "Self",
          duration: "1 Hour",
          year: 1,
          description:
            "Your hair is magically lengthened, shortened, styled, or colored. This may also be applied to eyebrows and facial hair. If your appearance is drastically changed, you may be hard to recognize. To discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your spell save DC.",
        },
        {
          name: "Epoximise",
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "This spell transfigures the surface of an object to become extremely sticky. One object of your choice that you can see within range and that fits within a 1-foot cube adheres to anything it touches for the duration. If a creature wants to overcome the sticking effect, it can use its action to make a Strength check against your spell save DC. On a success, it can pull the target object free or remove one thing from the target object's surface.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, the cube's size increases by 1 foot for each slot level above 0.",
        },
        {
          name: "Incendio Glacia",
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 1,
          description:
            "A flickering blue flame flows out from the tip of your wand, condensing on an object, in a container, or in your hand. The flame remains there for the duration and only emanates heat directly upwards. It doesn't harm anything beneath or around it, and seems to hover slightly above whatever it's resting upon. If placed beneath a flammable object, a natural fire may be started from the heat. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as a bonus action.",
        },
        {
          name: "Orchideous",
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "You conjure a blooming flower, bouquet, or wreath in the desired location within range.",
        },
        {
          name: "Vera Verto",
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Until Dispelled",
          year: 2,
          description:
            "This universal incantation is taught to Hogwarts students in their first Transfiguration class. You transfigure one nonmagical object that you can see within range and that fits within a 1-foot cube into another nonmagical object of similar size and mass and of equal or lesser value.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, you may select or stack one of the following effects for each slot level above 0.",
        },
      ],
      "1st Level": [
        {
          name: "Inanimatus Conjurus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Action",
          range: "10 Feet",
          duration: "1 Hour",
          year: 2,
          description:
            "You conjure up an inanimate object in your hand or in an unoccupied space within range that you can see. This object can be no larger than 2 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object disappears at the end of the spell's duration or if it takes any damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you may select or stack one of the following effects for each slot level above 1st: Increase the side length by 2 feet. Increase the weight limit by 10 pounds.",
        },
        {
          name: "Incendio",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "Concentration, up to 1 minute",
          year: 2,
          tags: ["Dark"],
          description:
            "You create a bonfire on ground that you can see within range. Until the spell ends, the bonfire fills a 5-foot cube. Any creature in the bonfire's space when you cast the spell must succeed on a Dexterity saving throw. It takes 3d6 fire damage on a failed save, or half as much damage on a successful one. A creature must also make the saving throw when it moves into the bonfire's space for the first time on a turn or ends its turn there. The bonfire ignites flammable objects in its area that aren't being worn or carried. If there is adequate fuel for the bonfire to burn, it will continue burning after the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 2d6 for each slot level above 2nd.",
        },
        {
          name: "Obscuro",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Until Dispelled",
          year: 2,
          description:
            "You can conjure a black blindfold that magically wraps itself around a foe's head. Choose one creature that you can see within range to make a Dexterity saving throw. If it fails, the target is blinded for the duration. The creature can remove the blindfold as an action.",
        },
        {
          name: "Sagittario",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "1 action",
          range: "150 feet",
          duration: "Instantaneous",
          year: 4,
          tags: ["Dark"],
          description:
            "A conjured arrow streaks toward a designated target. Make a ranged spell attack against a target within range. On a hit, the target takes piercing damage equal to 1d8 + your spellcasting ability modifier.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you conjure one additional arrow for each slot level above 1st. You can direct the arrows at the same target or at different ones. Make a separate attack roll for each arrow.",
        },
        {
          name: "Nebulus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "1 action",
          range: "120 feet",
          duration: "Concentration, up to 1 hour",
          year: 3,
          description:
            "You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Incarcerous",
          class: ["Transfiguration"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "24 hours",
          ritual: true,
          year: 3,
          description:
            "Black cords and ropes are conjured and wrap themselves forcefully around a target you can see within range. If the target is an unwilling creature, it must make a Strength saving throw. On a failed save, the creature is restrained for the duration. Upon casting, you can choose to anchor the ropes to the ground, preventing the target from being moved by external forces. The restrained creature or someone else who can reach it can use an action to make a Strength check against your spell save DC. On a success, the restrained effect ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the creature is also incapacitated, rendering it unable make a Strength check to escape.",
        },
        {
          name: "Orbis",
          class: ["Transfiguration"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 3,
          restriction: true,
          description:
            "You choose a space on the ground that is currently occupied by a Large or smaller creature you can see within range. The ground becomes a thick liquid and swirls out from under the creature in an orb-like shape. The material then slams back down and regains its solidity in an attempt to partially bury the creature. The target must make a Dexterity saving throw. On a failed save, the target takes 3d6 bludgeoning damage and is restrained for the spell's duration. As an action, you can cause the earth to crush the restrained target, who must make a Strength saving throw. It takes 3d6 bludgeoning damage on a failed save, or half as much damage on a successful one. To break out, the restrained target can use its action to make a Strength check against your spell save DC. On a success, the target pulls its legs free and is no longer restrained.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.",
        },
        {
          name: "Reparifarge",
          class: ["Transfiguration"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 3,
          tags: ["Defensive"],
          restriction: true,
          description:
            "Choose any creature, object, or magical effect within range. One Transfiguration spell of 2nd level or lower on the target ends. If you are aware of at least one spell affecting the target, you can specify that spell in your mind. If you are unaware of what spells are affecting the target, one randomly selected spell ends. For a spell of a higher level on the target, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a successful check, the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you automatically end the effects of a Transfiguration spell on the target if the spell's level is equal to or less than the level of the spell slot you used.",
        },
        {
          name: "Serpensortia",
          class: ["Transfiguration"],
          level: "2nd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 4,
          tags: ["Dark"],
          description:
            "You conjure a venomous snake from thin air. A pit viper appears in an unoccupied space that you can see within range. Roll initiative for the summoned creature, which has its own turns. Although the pit viper won't willingly attack the caster, you cannot control the actions or targets of the pit viper. It is possible for the pit viper to be turned against you through magical means.",
          higherLevels:
            "When you cast this spell using a higher level spell slot, multiple pit vipers are conjured in unoccupied spaces that you can see within range. Choose from the following options: two pit vipers (4th level), three pit vipers (6th level), or four pit vipers (8th level). Initiative is rolled as a group.",
        },
      ],
      "3rd Level": [
        {
          name: "Avis",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          year: 5,
          description:
            "You conjure either a Swarm of Small Birds or two Swarms of Tiny Birds that are a species of your choice. The swarm disappears when it drops to 0 hit points or when the spell ends. The conjured birds are friendly to you and your companions. Roll initiative for the summoned swarms as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The HM has the creatures' statistics.",
          higherLevels:
            "When you cast this spell using certain higher-level spell slots, more creatures appear - twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.",
        },
        {
          name: "Evanesco",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "30 ft",
          duration: "Instantaneous",
          year: 5,
          description:
            "One non-magical object or magical construct of your choice that you can see within range and that fits within a 1-foot cube is vanished. Vanished objects have been described as being transfigured to go 'into non-being, which is to say, everything.' Vanishing is often seen as the magical inverse of conjuration.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the cube's size increases by 1 foot for each slot level above 3rd.",
        },
        {
          name: "Ignis Laquis",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Dedication, up to 1 minute",
          year: 5,
          restriction: true,
          description:
            "You create a long, snaking whip of fire from the tip of your wand, lashing out and coiling around a creature in range. Make a melee spell attack against the target. On a hit, the creature takes 4d10 fire damage and is grappled for the duration. As an action, the target can make a Strength or Dexterity saving throw to end the spell's effects. On each of your following turns spent maintaining dedication, the whip tightens and you deal 4d10 fire damage to the target automatically. If the creature is Large or smaller, you can use a bonus action to pull the creature up to 10 feet closer to you.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the initial damage and subsequent turn damage increases by 1d10 for each slot level above 3rd.",
        },
        {
          name: "Melofors",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "1 minute",
          year: 4,
          description:
            "You conjure a pumpkin around a target's head, blinding and deafening it. Choose one creature that you can see within range to make a Wisdom saving throw. If it fails, the target is blinded and deafened for the duration. At the end of each of its turns, the target can make a Wisdom saving throw. On a success, the spell's effect ends for that target.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd.",
        },
      ],
      "4th Level": [
        {
          name: "Ebublio",
          class: ["Transfiguration"],
          level: "4th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          ritual: true,
          year: 6,
          description:
            "You conjure up a swirling sphere of water with a 5-foot radius at a point you can see within range. The sphere can hover but no more than 10 feet off the ground. The sphere remains for the spell's duration. Any creature in the sphere's space must make a Strength saving throw. On a successful save, a creature is ejected from that space to the nearest unoccupied space of the creature's choice outside the sphere. A Huge or larger creature succeeds on the saving throw automatically, and a Large or smaller creature can choose to fail it. On a failed save, a creature is restrained by the sphere and is engulfed by the swirling bubble of water. At the end of each of its turns, a restrained target can repeat the saving throw, ending the effect on itself on a success. The sphere can restrain as many as four Medium or smaller creatures or one Large creature. If the sphere restrains a creature that causes it to exceed this capacity, a random creature that was already restrained by the sphere falls out of it and lands prone in a space within 5 feet of it. As an action, you can move the sphere up to 30 feet in a straight line. If it moves over a pit, a cliff, or other drop-off, it safely descends until it is hovering 10 feet above the ground. Any creature restrained by the sphere moves with it. You can ram the sphere into creatures, forcing them to make the saving throw. When the spell ends, the sphere falls to the ground and extinguishes all normal flames within 30 feet of it. Any creature restrained by the sphere is knocked prone in the space where it falls. The water then vanishes.",
        },
        {
          name: "Lapifors",
          class: ["Transfiguration"],
          level: "4th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          ritual: true,
          year: 6,
          restriction: true,
          description:
            "This spell transforms a creature with at least 1 hit point that you can see within range into the form of a rabbit. An unwilling creature must make a Wisdom saving throw to avoid the effect. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The target's game statistics, including mental ability scores, are replaced by the statistics of a rabbit. It retains its alignment and personality. The HM has the creature's statistics. The target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. As long as the excess damage doesn't reduce the creature's normal form to 0 hit points, it isn't knocked unconscious. The creature is limited in the actions it can perform by the nature of its new form, and it can't speak, cast spells, or take any other action that requires hands or speech. The target's gear melds into the new form. The creature can't activate, use, wield, or otherwise benefit from any of its equipment.",
        },
      ],
      "5th Level": [
        {
          name: "Insectum Maxima",
          class: ["Transfiguration"],
          level: "5th Level",
          castingTime: "Action",
          range: "300 Feet",
          restriction: true,

          duration: "Concentration, up to 10 minutes",
          year: 6,
          description:
            "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.",
        },
        {
          name: "Draconifors",
          class: ["Transfiguration"],
          level: "5th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 10 minutes",
          year: 7,
          description:
            "A particularly intimidating display of transfiguration, this spell turns a desk-sized object into a miniature version of an adult dragon. Choose either one or two inanimate, nonmagical objects you can see within range that each fill a 5-foot cube and choose one of the following options: One dragon wyrmling of challenge rating 4 or lower, or Two dragon wyrmlings of challenge rating 2 or lower. The object becomes a Medium-sized dragon construct with the chosen wyrmling's statistics, which is untransfigured when it drops to 0 hit points or when the spell ends. The dragon construct is friendly to you and your companions for the duration. Roll initiative for the dragon construct, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you). If you don't issue any commands to it, it defends itself from hostile creatures, but otherwise takes no actions. If your concentration is broken, the dragon construct doesn't disappear. Instead, you lose control of the construct, it becomes hostile toward you and your companions, and it might attack. An uncontrolled dragon construct can't be dismissed by you, and it untransfigures 10 minutes after you transfigured it. The HM has the creature's statistics.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level, choose one of the following options: Two dragon wyrmlings of challenge rating 3 or lower, or Three dragon wyrmlings of challenge rating 2 or lower. When you cast this spell using a spell slot of 9th level, choose one of the following options: Two dragon wyrmlings of challenge rating 4 or lower, or Four dragon wyrmlings of challenge rating 2 or lower.",
        },
      ],
      "6th Level": [
        {
          name: "Ignis Furore",
          class: ["Transfiguration"],
          level: "6th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 7,
          tags: ["Dark"],
          description:
            "You create a ringed wall of fire within range up to 20 feet in diameter, 20 feet high, and 10 feet thick choosing whether it's touching the ground or in the air. The wall is opaque and lasts for the duration. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 4d8 fire damage, or half as much damage on a successful save. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. As an action, you can send a tendril of flames lashing out at any point within 60 feet of the center of the ring. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 4d8 fire damage on a failed save, or half as much damage on a successful one. A creature in the area of the wall and fiery burst is affected only once. The spell damages objects in the area and ignites flammable objects that aren't being worn or carried.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d8 and the ring's radius increases by 5 feet for each slot level above 6th.",
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
          name: "Ignis Lunalis",
          class: ["Divinations"],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
          higherLevels:
            "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
        },
        {
          name: "Lux",
          class: ["Divinations"],
          level: "Cantrip",
          castingTime: "Action",
          restricted: true,
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: 3,
          description:
            "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
        },
        {
          name: "Mumblio",
          class: ["Divinations"],
          level: "Cantrip",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 3,
          restriction: true,
          description:
            "You point your wand toward a being within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.",
        },
        {
          name: "Point Me",
          class: ["Divinations"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 3,
          description:
            "Placing your wand flat in your open palm, this spell picks up the wand and points north, much like a compass. The spell's usefulness is situational, but often grants advantage on Wisdom (Survival) checks to not get lost outdoors.",
        },
        {
          name: "Prior Incantato",
          class: ["Divinations"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 3,
          description:
            "Often used as an investigative tool in wizarding crimes, this spell produces a ghostly recreation of the previous spell cast by the currently used wand. If the previously cast spell cannot be represented visually, you learn the incantation that was used. This spell can be cast a total of three consecutive times on a single wand, revealing the three most recently cast spells.",
        },
      ],
      "1st Level": [
        {
          name: "Bestia Vinculum",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 10 minutes",
          year: 3,
          description:
            "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast's Intelligence is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other.",
        },
        {
          name: "Formidulosus",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          restricted: true,
          duration: "Instantaneous",
          year: 3,
          description:
            "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Linguarium",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 3,
          description:
            "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text.",
        },
        {
          name: "Lux Maxima",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          restricted: true,
          year: 3,
          description:
            "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 2d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Luxus Manus",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "1 Minute",
          range: "5 Feet",
          duration: "Concentration, 8 Hours",
          year: 4,
          description:
            "You create a Tiny incorporeal hand of shimmering light in an unoccupied space you can see within range. The hand exists for the duration, but it disappears if you apparate or use a portkey. When the hand appears, you name one major landmark, and the hand moves in the direction of the landmark.",
        },
        {
          name: "Martem",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "1 Minute",
          range: "Touch",
          duration: "8 Hours",
          year: 3,
          restriction: true,
          description:
            "You touch a willing creature. For the duration, the target can add 1d8 to its initiative rolls.",
        },
        {
          name: "Motus Revelio",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 1 Minute",
          year: 3,
          description:
            "You attune your senses to pick up the emotions of others for the duration. When you cast the spell, and as your action on each turn until the spell ends, you can focus your senses on one being you can see within 30 feet of you. You instantly learn the target's prevailing emotion.",
        },
        {
          name: "Specialis Revelio",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Instantaneous",
          year: 4,
          description:
            "You tap your wand on an object or area, revealing magical influences. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any.",
        },
        {
          name: "Venenum Revelio",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 10 Minutes",
          year: 3,
          description:
            "For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case.",
        },
      ],
      "2nd Level": [
        {
          name: "Absconditus Revelio",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 4,
          description:
            "For the duration, you see invisible creatures (excluding beings) and objects as if they were visible.",
        },

        {
          name: "Facultatem",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 4,
          restriction: true,
          description:
            "You temporarily gain knowledge by using your divination magic to guide you. Choose one skill in which you lack proficiency. For the spell's duration, you have proficiency in the chosen skill. The spell ends early if you cast it again.",
        },
        {
          name: "Inanimatus Revelio",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 10 Minutes",
          year: 4,
          description:
            "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement.",
        },
        {
          name: "Secundio",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "1 Minute",
          range: "60 Feet",
          duration: "1 Hour",
          year: 4,
          description:
            "You impart latent luck to yourself or one willing creature you can see within range. When the chosen creature makes an attack roll, an ability check, or a saving throw before the spell ends, it can dismiss this spell on itself to roll an additional d20 and choose which of the d20s to use.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
        },
        {
          name: "Trabem",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          restriction: true,
          range: "120 Feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          description:
            "A silvery beam of pale light shines down in a 5-foot radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it takes 2d10 radiant damage on a failed Constitution save, or half as much on a successful one.",
        },
      ],
      "3rd Level": [
        {
          name: "Annotatem",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "10 Minutes",
          range: "1 Mile",
          duration: "Concentration, 10 Minutes",
          year: 5,
          description:
            "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you. The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with.",
        },
        {
          name: "Legilimens",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          restriction: true,
          description: "Mind reading",
        },
        {
          name: "Linguarium Maxima",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 5,
          description:
            "This spell grants the being you touch the ability to understand any spoken language it hears. Moreover, when the target speaks, any creature that knows at least one language and can hear the target understands what it says.",
        },
        {
          name: "Mumblio Maxima",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "Action",
          range: "Unlimited",
          duration: "1 Round",
          year: 5,
          restriction: true,
          description:
            "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately.",
        },
        {
          name: "Revelio",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 5,
          description:
            "With a twist of your wand, the true appearance of a creature or object is revealed. A disguised, hidden, invisible or otherwise magically concealed target is made visible, dispelling any spell producing such effects and magically removing physical alterations.",
        },
        {
          name: "Stellaro",
          class: ["Divinations"],
          level: "3rd Level",
          castingTime: "Action",
          restriction: true,
          range: "Self (15 Foot Radius)",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          description:
            "You call forth Constellations to protect you. Tiny Stars flit around you to a distance of 15 feet for the duration. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil).",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
      ],
      "4th Level": [
        {
          name: "Appare Vestigium",
          class: ["Divinations"],
          level: "4th Level",
          castingTime: "1 Minute",
          range: "Self (30 Foot Radius Hemisphere)",
          duration: "Concentration, 10 Minutes",
          year: 7,
          description:
            "With a spin and a spray of golden mist, recent magical activity is revealed and illuminated through ghostly images hanging in the air, recreating the magical beings, magical creatures, or magical events that have been in the area within the last 10 minutes.",
          higherLevels:
            "When you cast this spell using a spell slot of a higher level, the historical window extends to 1 hour (5th level), 24 hours (6th level), or a week (7th level).",
        },
        {
          name: "Creatura Revelio",
          class: ["Divinations"],
          level: "4th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Dedication, 1 Hour",
          year: 6,
          description:
            "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement.",
        },
        {
          name: "Homenum Revelio",
          class: ["Divinations"],
          level: "4th Level",
          castingTime: "1 Action",
          range: "Self (60 Foot Sphere)",
          duration: "Instantaneous",
          year: 7,
          description:
            "You sense the presence and general direction of each human or magical being within range. If any being is moving, you know its direction. A being is alerted to being detected by this spell, as the spell produces an odd feeling of something standing right behind you or over you.",
        },
        {
          name: "Oculus Speculatem",
          class: ["Divinations"],
          level: "4th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Dedication, 1 Hour",
          year: 6,
          description:
            "You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.",
        },
        {
          name: "Relicuum",
          class: ["Divinations"],
          level: "4th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 6,
          restriction: true,
          description:
            "Your magic can put you in contact with arcanum to help divine the future. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The GM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen.",
        },
      ],
      "5th Level": [
        {
          name: "Annotatem Maxima",
          class: ["Divinations"],
          level: "5th Level",
          castingTime: "10 Minutes",
          range: "Self",
          duration: "Dedication, 10 Minutes",
          year: 6,
          restriction: true,
          description:
            "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it.",
        },
        {
          name: "Augurium",
          class: ["Divinations"],
          level: "5th Level",
          castingTime: "1 Minute",
          range: "Self",
          duration: "1 Minute",
          year: 6,
          description:
            "You wave your wand and connect with your third eye, asking up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question.",
        },

        {
          name: "Mumblio Totalum",
          class: ["Divinations"],
          level: "5th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "1 Hour",
          year: 6,
          restriction: true,
          description:
            "You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell.",
        },
      ],
      "6th Level": [
        {
          name: "Invenire Viam",
          class: ["Divinations"],
          level: "6th Level",
          castingTime: "1 Minute",
          range: "Self",
          duration: "Concentration, 1 Day",
          year: 7,
          restriction: true,
          description:
            "This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination that moves (such as a mobile fortress), or a destination that isn't specific (such as 'a green dragon's lair'), the spell fails.",
        },

        {
          name: "Verum Aspectum",
          class: ["Divinations"],
          level: "6th Level",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 7,
          description:
            "This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight and notices secret doors hidden by magic out to a range of 120 feet.",
        },
      ],
      "8th Level": [],
      "9th Level": [
        {
          name: "Providentium",
          class: ["Divinations"],
          level: "9th Level",
          castingTime: "1 Minute",
          range: "Touch",
          duration: "8 Hours",
          year: 7,
          restriction: true,
          description:
            "You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration.",
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
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 1,
          restriction: true,
          description: "Enhanced fire spell with explosive properties",
        },
      ],
      "1st Level": [
        {
          name: "Diffindo Glacia",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          restriction: true,
          description:
            "Ice-cutting spell that combines slicing and freezing effects",
        },
        {
          name: "Intonuit Fluctus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 3,
          restriction: true,
          description: "Thunder wave spell",
        },
      ],
      "3rd Level": [
        {
          name: "Fulgur",
          class: [],
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          restriction: true,
          description: "Lightning spell",
        },
        {
          name: "Respersio",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          year: 4,
          restriction: true,
          description: "Elemental spray or splash spell",
        },
      ],
      "4th Level": [
        {
          name: "Glacius Maxima",
          class: ["Charms"],
          level: "4th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Instantaneous",
          year: 6,
          restriction: true,
          description:
            "Enhanced version of Glacius with greater freezing power",
        },
      ],
      "8th Level": [
        {
          name: "Tempestus",
          class: ["Transfiguration"],
          level: "8th Level",
          castingTime: "1 Minute",
          range: "Sight",
          duration: "Concentration, up to 6 rounds",
          year: 7,
          restriction: true,
          description: "Storm conjuration spell",
        },
      ],
      "9th Level": [
        {
          name: "Fulgur Maxima",
          class: ["Transfiguration"],
          level: "9th Level",
          castingTime: "Action",
          range: "Self (120-foot line)",
          duration: "Instantaneous",
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
          class: ["Transfiguration"],
          level: "Cantrip",
          castingTime: "Action",
          range: "Self (5 Foot Radius)",
          duration: "1 Round",
          year: 1,
          restriction: true,
          description: "Magnification or enhancement spell",
        },
      ],
      "1st Level": [
        {
          name: "Clario",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
          year: 7,
          restriction: true,
          description: "Clarity or illumination spell for combat",
        },
        {
          name: "Ignis Ictus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Dedication, up to 1 minute",
          year: 2,
          restriction: true,
          description: "Fire strike spell",
        },
        {
          name: "Irus Ictus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 2,
          restriction: true,
          description: "Anger strike spell",
        },
        {
          name: "Pererro",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
          year: 1,
          restriction: true,
          description: "Wandering or erratic movement spell",
        },
        {
          name: "Tonitrus Ictus",
          class: ["Transfiguration"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 3,
          restriction: true,
          description: "Thunder strike spell",
        },
      ],
      "2nd Level": [
        {
          name: "Notam Ictus",
          class: ["Transfiguration"],
          level: "2nd Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restriction: true,
          description: "Mark strike spell",
        },
      ],
      "3rd Level": [
        {
          name: "Inanus Ictus",
          class: ["Transfiguration"],
          level: "3rd Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 5,
          restriction: true,
          description: "Void or empty strike spell",
        },
      ],
      "4th Level": [
        {
          name: "Titubo Ictus",
          class: ["Transfiguration"],
          level: "4th Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restriction: true,
          description: "Staggering strike spell",
        },
      ],
      "5th Level": [
        {
          name: "Clario Maxima",
          class: ["Transfiguration"],
          level: "5th Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
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
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "1 Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          restriction: true,
          description: "Clears breathing passages and airways",
        },
        {
          name: "Rennervate",
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "1 Round",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 2,
          description: "Revives unconscious persons",
        },
      ],
      "1st Level": [
        {
          name: "Episkey",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "bonus action",
          range: "10 feet",
          duration: "Instantaneous",
          year: 3,
          description: "Heals minor injuries",
        },
        {
          name: "Ferula",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "10 minutes",
          year: 4,
          description: "Conjures bandages and splints",
        },
        {
          name: "Reparifors",
          class: ["Defense Against the Dark Arts"],
          level: "1st Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Instantaneous",
          year: 3,
          description: "Heals magical transformations",
        },
      ],
      "2nd Level": [
        {
          name: "Adversus Interitus",
          class: [],
          level: "2nd Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "24 hours",
          year: null,
          restriction: true,
          description: "Protection against death",
        },
      ],
      "3rd Level": [
        {
          name: "Aculeo Sanentur",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 5,
          restriction: true,
          description: "Heals puncture wounds and stings",
        },
        {
          name: "Animatem",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Instantaneous",
          year: 4,
          restriction: true,
          description: "Restores life force or animation",
        },
        {
          name: "Intus Sunt",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restriction: true,
          description: "Internal healing spell",
        },
      ],
      "4th Level": [
        {
          name: "Brackium Emendo",
          class: ["Defense Against the Dark Arts"],
          level: "4th Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Instantaneous",
          year: 5,
          description: "Mends broken bones",
        },
      ],
      "5th Level": [
        {
          name: "Pervivo",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "1 Hour",
          range: "Touch",
          duration: "Instantaneous",
          year: 6,
          restriction: true,
          description: "Survival or life extension spell",
        },
      ],
      "6th Level": [
        {
          name: "Protego Totalum",
          level: "6th Level",
          class: ["Defense Against the Dark Arts"],
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
        {
          name: "Vulnera Sanentur",
          class: ["Defense Against the Dark Arts"],
          level: "6th Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
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
          class: ["Defense Against the Dark Arts"],
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 1,
          restriction: true,
          description: "Insect control or summoning spell",
        },
      ],
      "1st Level": [
        {
          name: "Beastia Vinculum",
          level: "1st Level",
          year: null,
          class: [],
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 10 minutes",
          restriction: true,
          description:
            "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast’s Intelligence is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
        },
        {
          name: "Beastia Amicatum",
          class: ["Charms"],
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: 2,
          restriction: true,
          description: "Befriends beasts and creatures",
        },
      ],
      "2nd Level": [
        {
          name: "Beastia Nuntium",
          class: ["Charms"],
          level: "2nd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: 3,
          restriction: true,
          description: "Allows communication with beasts",
        },
        {
          name: "Beastia Sensibus",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          restriction: true,
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 4,
          description:
            "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.",
        },
      ],
      "3rd Level": [
        {
          name: "Obtestor",
          class: ["Charms"],
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          year: 4,
          restriction: true,
          description:
            "You summon spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower, Two beasts of challenge rating 1 or lower, Four beasts of challenge rating 1/2 or lower, Eight beasts of challenge rating 1/4 or lower. Each beast spirit disappears when it drops to 0 hit points or when the spell ends. The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The DM has the creatures' statistics.",
          higherLevels:
            "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.",
        },
      ],
      "4th Level": [
        {
          name: "Imperio Creatura",
          class: ["Charms"],
          level: "4th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restriction: true,
          description:
            "You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence.",
          higherLevels:
            "When you cast this spell with a 5th-level spell slot, the duration is concentration, up to 10 minutes. When you use a 6th-level spell slot, the duration is concentration, up to 1 hour. When you use a spell slot of 7th level or higher, the duration is concentration, up to 8 hours.",
        },
        {
          name: "Engorgio Insectum",
          class: ["Charms"],
          level: "4th Level",
          castingTime: "1 Action",
          range: "30 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          restriction: true,
          description:
            "You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into giant versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion.",
        },
      ],
      "5th Level": [
        {
          name: "Insectum Maxima",
          class: ["Defense Against the Dark Arts"],
          level: "5th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          restriction: true,
          description:
            "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.",
        },
      ],
      "6th Level": [
        {
          name: "Natura Incantatem",
          class: ["Divinations"],
          level: "6th Level",
          castingTime: "1 Minute",
          range: "Self",
          restriction: true,
          duration: "Instantaneous",
          year: 7,
          description:
            "You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet.",
        },
      ],
      "7th Level": [
        {
          name: "Draconiverto",
          class: ["Transfiguration"],
          level: "7th Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restriction: true,
          description:
            "With a roar, you transform yourself, taking on draconic features. You gain the following benefits until the spell ends: Blindsight: You have blindsight with a range of 30 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature, unless the creature successfully hides from you. Breath Weapon: When you cast this spell, and as a bonus action on subsequent turns for the duration, you can exhale shimmering energy in a 60-foot cone. Each creature in that area must make a Dexterity saving throw, taking 6d8 force damage on a failed save, or half as much damage on a successful one. Wings: Incorporeal wings sprout from your back, giving you a flying speed of 60 feet.",
        },
      ],
      "8th Level": [
        {
          name: "Animato Maxima",
          class: ["Transfiguration"],
          level: "8th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 24 hours",
          year: 7,
          restriction: true,
          description:
            "Your magic turns others into beasts. Choose any number of willing creatures that you can see within range. You transfigure each target into the form of a large or smaller beast with a challenge rating of 4 or lower. On subsequent turns, you can use your actions to transform affected creatures into new forms. The transformation lasts for the duration for each target, or until the target drops to 0 hit points or dies. You can choose a different form for each target. A target's game statistics are replaced by the statistics of the chosen beast, though the target retains its alignment and Intelligence, Wisdom, and Charisma scores. The target assumes the hit points of its new form, and when it reverts to its normal form, it returns to the number of hit point it had before it transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. As long as the excess damage doesn't reduce the creature's normal form to 0 hit points, it isn't knocked unconscious. The creature is limited in the actions it can perform by the nature of its new form, and it can't speak or cast spells. The target's gear melds into the new form. The target can't activate, wield, or otherwise benefit from any of its equipment.",
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
          name: "Fraudemo",
          class: [],
          level: "Cantrip",
          year: 5,
          restriction: true,
          description: "Deception or illusion spell",
        },
      ],
      "1st Level": [
        {
          name: "Formidulosus",
          class: [],
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          restriction: true,
          tags: ["Dark"],
          description:
            "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Exspiravit",
          class: ["Divinations"],
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          restriction: "true",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          description:
            "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube.",
        },
      ],
      "3rd Level": [
        {
          name: "Fraudemo Maxima",
          class: ["Charms"],
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 Minutes",
          year: 5,
          restriction: true,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your Concentration.",
        },
        {
          name: "Timor",
          class: ["Charms"],
          level: "3rd Level",
          castingTime: "Action",
          range: "Self 30 Foot Radius",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          description: "Fear spell",
        },
      ],
      "4th Level": [
        {
          name: "Relicuum",
          class: [],
          level: "4th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 6,
          restriction: true,
          tags: ["R"],
          description:
            "Your magic can put you in contact with arcanum to help divine the future. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The GM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen. The spell doesn't take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion. If you cast the spell two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The GM makes this roll in secret.",
        },
      ],
      "5th Level": [],
      "6th Level": [
        {
          name: "Oculus Malus",
          class: [],
          level: "6th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restriction: true,
          description:
            "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration. On each of your turns until the spell ends, you can use your action to target another creature but can't target a creature again if it has succeeded on a saving throw against this casting of Oculus Malus. Asleep. The target falls unconscious. It wakes up if it takes any damage or if another creature uses its action to shake the sleeper awake. Panicked. The target is frightened of you. On each of its turns, the frightened creature must take the Dash action and move away from you by the safest and shortest available route, unless there is nowhere to move. If the target moves to a place at least 60 feet away from you where it can no longer see you, this effect ends. Sickened. The target has disadvantage on attack rolls and ability checks. At the end of each of its turns, it can make another Wisdom saving throw. If it succeeds, the effect ends.",
        },
      ],
      "9th Level": [
        {
          name: "Menus Eruptus",
          class: [],
          level: "9th Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "Instantaneous",
          year: 7,
          restriction: false,
          tags: ["Dark"],
          description:
            "You unleash the power of your mind to blast the intellect of up to ten creatures of your choice that you can see within range. Creatures that have an Intelligence score of 2 or lower are unaffected. Each target must make an Intelligence saving throw. On a failed save, a target takes 14d6 psychic damage and is stunned. On a successful save, a target takes half as much damage and isn't stunned. If a target is killed by this damage, its head explodes, assuming it has one. A stunned target can make an Intelligence saving throw at the end of each of its turns. On a successful save, the stunning effect ends.",
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
          class: [],
          level: "Cantrip",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          year: 2,
          restriction: false,
          tags: ["Dark"],
          description:
            "A beam of crackling black energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
          higherLevels:
            "The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
        },
      ],
      "1st Level": [
        {
          name: "Tenebris",
          class: [],
          level: "1st Level",
          castingTime: "Action",
          range: "Self (10-foot radius)",
          duration: "Instantaneous",
          year: 3,
          restriction: false,
          tags: ["Dark"],
          description:
            "You invoke the power of the Unseen Realm. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can't take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Ferio Maxima",
          class: [],
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 1 minute",
          year: 3,
          restriction: false,
          tags: ["Dark"],
          description:
            "A beam of crackling, black energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your bonus action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell's range or if it has total cover from you.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Sagittario Virius",
          class: [],
          level: "2nd Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "Instantaneous",
          year: 4,
          restriction: false,
          tags: ["Dark"],
          description:
            "A poisonous green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.",
        },
      ],
      "3rd Level": [
        {
          name: "Gehennus Conjurus",
          class: [],
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          year: 5,
          restriction: false,
          tags: ["Dark"],
          description:
            "You utter foul words, summoning an Inferius from the land of the dead. You choose the unoccupied spaces you can see within range where they appear. A summoned Inferi disappears when it drops to 0 hit points or when the spell ends. The Inferi are hostile to all creatures, including you. Roll initiative for the summoned Inferi which has its own turn(s). The Inferi pursue and attack the nearest non-Inferi to the best of their ability. As part of casting the spell, you can form a magical circle on the ground that is large enough to encompass your space. While the spell lasts, the summoned Inferi can't cross the circle or harm it, and they can't target anyone within it.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th or 7th level, you summon an Inferi Swarm. If you cast it using a spell slot of 8th or 9th level, you summon an Inferi Horde.",
        },
      ],
      "5th Level": [
        {
          name: "Combustio",
          class: [],
          level: "5th Level",
          castingTime: "Action",
          range: "90 Feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restriction: false,
          tags: ["Dark"],
          description:
            "Flames wreathe one creature you can see within range. The target must make a Dexterity saving throw. It takes 7d6 fire damage on a failed save, or half as much damage on a successful one. On a failed save, the target also burns for the spell's duration. The burning target sheds bright light in a 30-foot radius and dim light for an additional 30 feet. At the end of each of its turns, the target repeats the saving throw. It takes 3d6 fire damage on a failed save, and the spell ends on a successful one. These magical flames can't be extinguished through non-magical means. If damage from this spell reduces a target to 0 hit points, the target is turned to ash.",
        },
      ],
      "6th Level": [
        {
          name: "Inmoritatem",
          class: [],
          level: "6th Level",
          castingTime:
            "1 reaction, which you take when a being you can see within 60 feet of you dies",
          range: "60 Feet",
          duration: "Until Dispelled",
          year: 7,
          restriction: false,
          tags: ["Dark"],
          description:
            "This spell snatches the soul of a being from the clutches of Death as it dies and traps it inside the tiny magical cage. A stolen soul remains inside the cage until the spell ends or if the cage is destroyed by a Finite Incantatem, which ends the spell. While you have a soul inside the cage, you can exploit it in any of the ways described below. You can use a trapped soul up to six times. Once you exploit a soul for the sixth time, it is released, and the spell ends. While a soul is trapped, the dead being it came from can't be revived. Steal Life. You can use a bonus action to drain vigor from the soul and regain 2d8 hit points. Query Soul. You ask the soul a question (no action required) and receive a brief telepathic answer, which you can understand regardless of the language used. The soul knows only what it knew in life, but it must answer you truthfully and to the best of its ability. The answer is no more than a sentence or two and might be cryptic. Borrow Experience. You can use a bonus action to bolster yourself with the soul's life experience, making your next attack roll, ability check, or saving throw with advantage. If you don't use this benefit before the start of your next turn, it is lost. Eyes of the Dead. You can use an action to name a place the humanoid saw in life, which creates an invisible sensor somewhere in that place if it is on the plane of existence you're currently on. The sensor remains for as long as you concentrate, up to 10 minutes (as if you were concentrating on a spell). You receive visual and auditory information from the sensor as if you were in its space using your senses. A creature that can see the sensor (such as one using see invisibility or truesight) sees a translucent image of the tormented humanoid whose soul you caged.",
        },
        {
          name: "Undanem",
          class: [],
          level: "6th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Instantaneous",
          year: 7,
          restriction: false,
          tags: ["Dark"],
          description:
            "A sphere of malicious energy ripples out in a 60-foot-radius sphere from a point within range. Each creature in that area must make a Constitution saving throw. A target takes 8d6 necrotic damage on a failed save, or half as much damage on a successful one.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 2d6 for each slot level above 6th.",
        },
      ],
      "8th Level": [
        {
          name: "Tenebris Maxima",
          class: [],
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 7,
          restriction: false,
          tags: ["Dark"],
          description:
            "Magical darkness spreads from a point you choose within range to fill a 60-foot-radius sphere until the spell ends. The darkness spreads around corners. A creature with darkvision can't see through this darkness. Non-magical light, as well as light created by spells of 8th level or lower, can't illuminate the area. Shrieks, gibbering, and mad laughter from the land of the dead can be heard within the sphere. Whenever a creature starts its turn in the sphere, it must make a Wisdom saving throw, taking 8d8 psychic damage on a failed save, or half as much damage on a successful one.",
        },
        {
          name: "Insanio",
          class: [],
          level: "8th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restriction: false,
          tags: ["Dark"],
          description:
            "You shatter the barriers between realities and timelines, thrusting a creature into turmoil and madness. The target must succeed on a Wisdom saving throw, or it can't take reactions until the spell ends. The affected target must also roll a d10 at the start of each of its turns; the number rolled determines what happens to the target as shown on the Insanio Effects table. At the end of each of its turns, the affected target can repeat the Wisdom saving throw, ending the spell on itself on a success. Insanio Effects: d10 1-2 Vision of the land of the dead. The target takes 6d12 psychic damage, and it is stunned until the end of the turn. 3-5 Rending Rift. The target must make a Dexterity saving throw, taking 8d12 force damage on a failed save, or half as much damage on a successful save. 6-8 Wormhole. The target is teleported, along with everything it is wearing and carrying, up to 30 feet to an unoccupied space of your choice that you can see. The target also takes 10d12 force damage and is knocked prone. 9-10 Chill of the Touch of Death. The target takes 10d12 cold damage, and it is blinded until the end of the turn.",
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
          class: [],
          level: "Cantrip",
          castingTime: "Action",
          range: "10 Feet",
          duration: "1 hour",
          year: 1,
          restriction: false,
          tags: ["Arithmantic"],
          description:
            "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor. You instantaneously light or snuff out a candle, a torch, or a small campfire. You instantaneously clean or soil an object no larger than 1 cubic foot. You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour. You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour. You create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time, and you can dismiss such an effect as an action.",
        },
      ],
      "1st Level": [
        {
          name: "Facias Infirmitatem",
          class: [],
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 1 round",
          year: 2,
          restriction: false,
          tags: ["Runic"],
          description:
            "A magic rune appears on the target's weak spots. Any attacks made against the target are made with advantage until the start of your next turn. Bonus Action casting rules do not apply to this spell.",
        },
      ],
      "2nd Level": [
        {
          name: "Exagitatus",
          class: [],
          level: "2nd Level",
          castingTime: "Bonus Action",
          range: "90 Feet",
          duration: "Concentration, 1 hour",
          year: 4,
          restriction: false,
          tags: ["Runic"],
          description:
            "You choose a creature you can see within range and mystically mark it as your target. Until the spell ends, you deal an extra 1d6 Runic damage to the target whenever you: hit it with a spell or it fails your spell's saving throw. Additionally, you have advantage on any Wisdom (Perception) or Wisdom (Survival) checks you make to find it. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to mark a new creature.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 6th level or higher, you can maintain your concentration on the spell for up to 24 hours.",
        },
        {
          name: "Impulso",
          class: [],
          level: "2nd Level",
          castingTime: "Reaction",
          range: "Self",
          duration: "1 Minute",
          year: 4,
          restriction: false,
          tags: ["Arithmantic"],
          description:
            "The spell captures some of the incoming energy, lessening its effect on you and storing it for your next attack. When you are damaged by a spell, roll a number of D4 equal to that spell's level and add half of your proficiency bonus to the roll. You may reduce your damage taken by the triggering attack by that amount. Also, the next time you cast a spell that deals damage, in the next minute, one target of the spell takes extra damage equal to the damage reduced from the triggering attack and the spell ends.",
        },
      ],
      "4th Level": [
        {
          name: "Maledicto",
          class: [],
          level: "4th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, 1 minute",
          year: 6,
          restriction: false,
          tags: ["Runic", "Dark"],
          description:
            "You choose a creature you can see within range, that creature must succeed on a Wisdom saving throw or become Cursed for the Duration of the spell. When you cast this spell, choose one curse from the following options. • Choose one ability score. While Cursed, the target has disadvantage on Ability Checks and Saving Throws made with that ability score. • While Cursed, the target has disadvantage on Attack rolls against you. • While Cursed, the target must make a Wisdom saving throw at the start of each of its turns. If it fails, it wastes its Action that turn doing nothing. • While the target is Cursed, your spells deal an extra 1d8 damage to the target.",
          higherLevels:
            "If you cast this spell using a spell slot of 5th Level or higher, the Duration is Concentration, up to 10 minutes. If you use a spell slot of 6th Level or higher, the Duration is 8 hours. If you use a spell slot of 7th Level or higher, the Duration is 24 hours. If you use a 8th Level spell slot, the spell lasts until it is dispelled. Using a spell slot of 7th Level or higher grants a Duration that doesn't require Concentration.",
        },
        {
          name: "Sagittario Maxima",
          class: [],
          level: "4th Level",
          castingTime: "Action",
          range: "Self (60 Foot cone)",
          duration: "Instantaneous",
          year: 6,
          restriction: false,
          tags: ["Arithmantic", "Dark"],
          description:
            "A deadly rain of conjured arrows streaks down towards the earth. Each creature in a 60-foot cone must succeed on a Dexterity saving throw. Each creature takes damage equal to 4d8 + your spellcasting ability modifier on a failed save, or half as much damage on a successful one.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th Level or higher, the damage increases by 1d8 for each slot level above 5th.",
        },
      ],
      "6th Level": [
        {
          name: "Sanitatem",
          class: [],
          level: "6th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Dedication, 1 minute",
          year: 7,
          restriction: false,
          tags: ["Arithmantic"],
          description:
            "Healing equations appear on the chest of up to six Creatures of your choice that you can see within range. For a duration of 1 minute, each creature regains Hit Points equal to 1d4 + your Spellcasting ability modifier at the start of your turns as long as you maintain Dedication. This spell has no Effect on undead or Constructs.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th Level or higher, the Healing increases by 1d4 for each slot level above 7th.",
        },
      ],
      "7th Level": [
        {
          name: "Portentia Spiculum",
          class: [],
          level: "7th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 10 minutes",
          year: 7,
          restriction: false,
          tags: ["Runic"],
          description:
            "You endow yourself with a temporary surge of magic, making yourself lighter on your feet and more powerful in your spellcasting. You gain the following Benefits: You gain 50 temporary hit points. If any of these remain when the spell ends, they are lost. You have +2 to spell attack rolls. When you hit a target with a spell attack, that target takes an extra 1d12 Psychic damage. You have proficiency in Strength and Constitution saving throws. You can cast leveled spells twice, instead of once, when you cast a spell as an action on your turn. You ignore this benefit if you already have a feature, like Extra Attack, that gives you extra attacks. Immediately after the spell ends, you must succeed on a DC 15 Constitution saving throw or suffer one level of exhaustion.",
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
          class: [],
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: 2,
          restricted: true,
          tags: [],
          description:
            "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
        },
        {
          name: "Ignis Lunalis",
          class: [],
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          restriction: false,
          tags: [],
          description:
            "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
          higherLevels:
            "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
        },
      ],
      "1st Level": [
        {
          name: "Lux Maxima",
          class: ["Divinations"],
          level: "1st Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 3,
          restricted: true,
          tags: [],
          description:
            "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 2d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Trabem",
          class: [],
          level: "2nd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restriction: false,
          tags: [],
          description:
            "A silvery beam of pale light shines down in a 5-foot radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in radiant light that causes searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.",
        },
      ],
      "3rd Level": [
        {
          name: "Stellaro",
          class: [],
          level: "3rd Level",
          castingTime: "Action",
          range: "Self (15 Foot Radius)",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          restriction: false,
          tags: [],
          description:
            "You call forth Constellations to protect you. Tiny Stars flit around you to a distance of 15 feet for the duration. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
      ],
      "5th Level": [
        {
          name: "Lunativia",
          class: ["Divinations"],
          level: "5th Level",
          castingTime: "Action",
          range: "Self (60-foot line)",
          restriction: true,
          duration: "Concentration and Dedication, up to 1 minute",
          year: 6,
          description:
            "A beam of brilliant light flashes out from your hand in a 60-foot-line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell.",
        },
      ],
      "8th Level": [
        {
          name: "Solativia",
          class: ["Divinations"],
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          restriction: true,
          duration: "Instantaneous",
          year: 7,
          description:
            "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 20d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell.",
        },
      ],
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
          class: ["Charms"],
          level: "Cantrip",
          castingTime: "Action",
          range: "30 feet",
          duration: "1 Minute",
          year: 1,
          description:
            "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. The hand can't attack, activate magical items, or carry more than 10 pounds.",
        },
      ],
      "1st Level": [],
      "2nd Level": [
        {
          name: "Tranquillitatem",
          class: ["Charms"],
          level: "2nd Level",
          year: 3,
          restriction: true,
          description:
            "Suppress strong emotions in a 20-foot radius. Remove charm/fear effects or make hostile creatures indifferent toward chosen targets. Concentration, up to 1 minute",
        },
      ],
      "3rd Level": [
        {
          name: "Fictus",
          class: ["Charms"],
          level: "3rd Level",
          year: 4,
          restriction: true,
          description:
            "Create a realistic illusion up to 20-foot cube with sounds, smells, and temperature. Lasts 10 minutes with concentration. Physical interaction reveals it's fake. At 6th level+, becomes permanent without concentration",
        },
        {
          name: "Roboratum",
          class: ["Defense Against the Dark Arts"],
          level: "3rd Level",
          year: 5,
          restriction: true,
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
          class: ["Charms"],
          year: 7,
          restriction: true,
          description:
            "Bind a creature in an illusory cell only it perceives. Target takes 5d10 psychic damage and is restrained, unable to see/hear beyond the illusion. Moving through it deals 10d10 damage and ends the spell",
        },
      ],
      "7th Level": [],
      "8th Level": [
        {
          name: "Dubium/Fiducium",
          class: ["Charms"],
          level: "8th Level",
          castingTime: "1 Hour",
          range: "60 Feet",
          duration: "10 days",
          year: 7,
          description:
            "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 200-foot cube. Then specify an intelligent creature. You invest the target with an aura that either attracts or repels the specified intelligent creatures for the duration. Choose antipathy or sympathy as the aura's effect.",
        },
      ],
      "9th Level": [],
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
          name: "Diffindo (Ritual",
          class: [],
          level: "1st Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 2,
          restriction: true,
          tags: ["R"],
          description:
            "Your cuts have become so precise and strong that you've learned how to make this spell into a deadly weapon. When you cast Diffindo, you can affect any creature or object regardless of size, the spell's duration is increased to one minute, and if the target of the spell is a creature and fails it's dexterity save it is considered bleeding and must succeed on a Constitution saving throw against your spell save DC. On a failed save the creature takes 2d4 slashing damage per round. The creature may repeat this saving throw at the end of its turns to end the effect. This effect ends automatically if the bleeding creature is the target of a healing spell of first level or higher.",
          higherLevels:
            "When you cast a diffindo using a spell slot of 2nd level or higher the slashing damage and bleeding damage is increased by 1d4.",
        },
      ],
      "2nd Level": [
        {
          name: "Immobulus",
          class: [],
          level: "2nd Level",
          castingTime: "1 action",
          range: "Self (15 foot cube)",
          duration: "1 round",
          year: 2,
          restriction: true,
          tags: [],
          description:
            "You have learned how to improve the power of your Immobulus spell without catching your allies in the crossfire. When you cast Immobulus, the range is extended to a 15 foot cube within a 60 foot range, the duration can be increased to 2 rounds with the use of concentration, and any creature whose hit points is equal to or less than 40 and is wholly within the area is automatically affected by this spell for the duration and does not count against the number of hit points you can affect.",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo (Ritual)",
          class: [],
          level: "3rd Level",
          castingTime: "1 action",
          range: "120 feet",
          duration: "Instantaneous",
          year: 5,
          restriction: true,
          tags: ["R"],
          description:
            "You have learned how to put enough pressure on a creature to momentarily stun your enemies. When a target of your Deprimo spell fails its strength saving throw, it is knocked prone and is stunned for one round. On a successful save, the target is knocked prone. The duration of a creature's stun can be increased to 1 minute with the use of dedication. Any creature stunned this way can make a constitution saving throw at the beginning of its turn to shake off the effect.",
        },
      ],
      "4th Level": [
        {
          name: "Confundo (Ritual)",
          class: [],
          level: "4th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restriction: true,
          tags: ["R"],
          description:
            "Your Confundus Charm has become deadly and precise. When a creature fails its Wisdom save against your Confundus Charm you always choose the direction the affected creature moves in. If a creature who is immune to the charmed condition is targeted by this spell it must succeed on a Wisdom saving throw or be Incapacitated for one round.",
        },
      ],
      "5th Level": [],
      "9th Level": [
        {
          name: "Fidelius Mysteria Celare",
          class: ["Charms"],
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
  Justice: {
    hasRestriction: false,
    icon: "Shield",
    color: "#FFD700",
    description: "Protective and righteous magic",
    levels: {
      Cantrips: [
        {
          name: "Virtus",
          class: ["Justice"],
          level: "Cantrip",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "1 Round",
          school: "Healing",
          description:
            "You touch one creature, imbuing it with vitality. If the target has at least 1 hit point, it gains a number of temporary hit points equal to 1d4 + your spellcasting ability modifier. The temporary hit points are lost when the spell ends.",
        },
        {
          name: "Lumos Ruptis",
          class: ["Justice"],
          level: "Cantrip",
          castingTime: "Action",
          range: "5 Feet",
          duration: "Instantaneous",
          school: "Charms",
          description:
            "You raise your hand, and burning radiance erupts from it. Each creature of your choice that you can see within 5 feet of you must succeed on a Constitution saving throw or take 1d6 radiant damage.",
          higherLevels:
            "The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
        },
      ],
      "1st Level": [
        {
          name: "Increpa",
          class: ["Justice"],
          level: "1st Level",
          castingTime: "Reaction",
          range: "60 Feet",
          duration: "Instantaneous",
          school: "Charms",
          description:
            "You point your finger, and the creature that damaged you is momentarily surrounded by divine radiance. The creature must make a Dexterity saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. If the creature is undead, they take 3d10 radiant damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.",
        },
        {
          name: "Protego Fidelia",
          class: ["Justice"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "60 Feet",
          duration: "Concentration, up to 10 minutes",
          school: "Charms",
          tags: ["Defensive"],
          description:
            "A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
        },
        {
          name: "Tholus",
          class: ["Justice"],
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "30 Feet",
          duration: "1 Minute",
          school: "Charms",
          tags: ["Defensive"],
          description:
            "You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball. If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.",
        },
      ],
      "2nd Level": [
        {
          name: "Iuvo",
          class: ["Justice"],
          level: "2nd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "8 Hours",
          school: "Healing",
          description:
            "Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd.",
        },
      ],
      "4th Level": [
        {
          name: "Expello",
          class: ["Justice"],
          level: "4th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          school: "Charm",
          description:
            "You attempt to force one creature that you can see within range to apparate away. The target must succeed on a Charisma saving throw or be banished. While banished, the target is incapacitated. The target remains there until the spell ends, at which point the target reappears in the space it left or in the nearest unoccupied space if that space is occupied.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th.",
        },
        {
          name: "Ostium",
          class: ["Justice"],
          level: "4th Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          school: "Transfiguration",
          description:
            "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction, such as '100 feet straight downward' or 'upward to the northwest at a 45-degree angle, 60 feet'. You can bring along objects as long as their weight doesn't exceed what you can carry. You can also bring one willing creature of your size or smaller who is carrying gear up to its carrying capacity. The creature must be within 5 feet of you when you cast this spell. If you would arrive in a place already occupied by an object or a creature, you and any creature traveling with you each take 4d6 force damage, and the spell fails to teleport you.",
        },
      ],
      "8th Level": [
        {
          name: "Nulla Magica",
          class: ["Justice"],
          level: "8th Level",
          castingTime: "Action",
          range: "Self (10 Foot Radius Sphere)",
          duration: "Concentration, up to 1 hour",
          school: "Charms",
          description:
            "A 10-foot-radius invisible sphere of antimagic surrounds you. This area is divorced from magical energy. Within the sphere, spells can't be cast, summoned creatures disappear, and even magic items become mundane. Until the spell ends, the sphere moves with you, centered on you. Spells and other magical effects, are suppressed in the sphere and can't protrude into it. A slot expended to cast a suppressed spell is consumed. While an effect is suppressed, it doesn't function, but the time it spends suppressed counts against its duration. Targeted Effects: Spells and other magical effects that target a creature or an object in the sphere have no effect on that target. Areas of Magic: The area of another spell or magical effect, such as confringo, can't extend into the sphere. If the sphere overlaps an area of magic, the part of the area that is covered by the sphere is suppressed. Spells: Any active spell or other magical effect on a creature or an object in the sphere is suppressed while the creature or object is in it. Magic Items: The properties and powers of magic items are suppressed in the sphere. Magical Travel: Apparition and Portkeys fail to work in the sphere, whether the sphere is the destination or the departure point for such magical travel. Creatures and Objects: A creature or object summoned or created by magic temporarily winks out of existence in the sphere. Dispel Magic: Spells and magical effects such as Finite Incantatem have no effect on the sphere.",
        },
      ],
      "9th Level": [
        {
          name: "Incarcerous Maxima",
          class: ["Justice"],
          level: "9th Level",
          castingTime: "1 Minute",
          range: "30 Feet",
          duration: "Until Dispelled",
          school: "Transfiguration",
          description:
            "You create a magical restraint to hold a creature that you can see within range. The target must succeed on a Wisdom saving throw or be bound by the spell; if it succeeds, it is immune to this spell if you cast it again. While affected by this spell, the creature doesn't need to breathe, eat, or drink, and it doesn't age. Divination spells can't locate or perceive the target. During the casting of the spell, you can specify a condition that will cause the spell to end and release the target. The condition can be as specific or as elaborate as you choose, but the DM must agree that the condition is reasonable and has a likelihood of coming to pass. A Finite Incantatem spell can end the spell only if it is cast as a 9th-level spell, targeting the prison. When you cast the spell, you choose one of the following forms of imprisonment. Burial: The target is entombed far beneath the earth in a sphere of magical force that is just large enough to contain the target. Nothing can pass through the sphere, nor can any creature apparate to get into or out of it. Chaining: Heavy chains, firmly rooted in the ground, hold the target in place. The target is restrained until the spell ends, and it can't move or be moved by any means until then. Minimus Containment: The target shrinks to a height of 1 inch and is imprisoned inside a gemstone or similar object. Light can pass through the gemstone normally (allowing the target to see out and other creatures to see in), but nothing else can pass through, even by means of Apparition. The gemstone can't be cut or broken while the spell remains in effect. Slumber: The target falls asleep and can't be awoken.",
        },
      ],
    },
  },
  Gravetouched: {
    hasRestriction: false,
    icon: "Skull",
    color: "#8B0000",
    description: "Dark healing and necromantic magic",
    levels: {
      Cantrips: [
        {
          name: "Umbrus Notatem",
          class: ["Gravetouched"],
          level: "Cantrip",
          castingTime: "Bonus Action",
          range: "30 Feet",
          duration: "1 Round",
          school: "Jinxes, Hexes, Curses",
          tags: ["Dark"],
          description:
            "You brand a willing creature with a mark of shadow. Until the end of its next turn, the target's movement speed increases by 5 feet, and its next attack deals an additional 2d4 necrotic damage. The effect ends early if the attack hits. If the target casts a spell that incorporates this additional damage, that spell gains the Dark tag for the purpose of effects, resistances, and synergies.",
        },
      ],
      "1st Level": [
        {
          name: "Ictus Vitalus",
          class: ["Gravetouched"],
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          school: "Healing",
          description:
            "Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Destruunt",
          class: ["Gravetouched"],
          level: "2nd Level",
          castingTime:
            "1 reaction, when you see a creature cast a Healing spell",
          range: "60 Feet",
          duration: "Instantaneous",
          school: "Healing",
          description:
            "You lash out with a thread of dark magic that severs the connection between body and life. When a creature within range attempts to cast a Healing spell, you can use your reaction to disrupt the flow of healing energy. The spell is halted, and no hit points or other effects are restored. The target still expends the spell slot and sorcery points used. If the healing spell is of 3rd level or higher, the caster must succeed on a Intelligence saving throw (DC equals 10 + the level of the spell) or the spell fails.",
        },
        {
          name: "Quo Flora",
          class: ["Gravetouched"],
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          school: "Healing",
          tags: ["Dark"],
          description:
            "You invoke both death and life upon a 10-foot-radius sphere centered on a point within range. Each creature of your choice in that area must make a Constitution saving throw, taking 2d6 necrotic damage on a failed save, or half as much damage on a successful one. Nonmagical vegetation in that area withers. In addition, one creature of your choice in that area can spend and roll one of its unspent Hit Dice and regain a number of hit points equal to the roll plus your spellcasting ability modifier.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot above 2nd, and the number of Hit Dice that can be spent and added to the healing roll increases by one for each slot above 2nd.",
        },
      ],
      "3rd Level": [
        {
          name: "Gehennus Conjurus",
          class: ["Gravetouched"],
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          school: "Transfiguration",
          tags: ["Dark"],
          description:
            "You utter foul words, summoning an Inferius from the land of the dead. You choose the unoccupied spaces you can see within range where they appear. A summoned Inferi disappears when it drops to 0 hit points or when the spell ends. The Inferi are hostile to all creatures, including you. Roll initiative for the summoned Inferi which has its own turn(s). The Inferi pursue and attack the nearest non-Inferi to the best of their ability. As part of casting the spell, you can form a magical circle on the ground that is large enough to encompass your space. While the spell lasts, the summoned Inferi can't cross the circle or harm it, and they can't target anyone within it.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th or 7th level, you summon an Inferi Swarm. If you cast it using a spell slot of 8th or 9th level, you summon an Inferi Horde.",
        },
        {
          name: "Mortus Oratio",
          class: ["Gravetouched"],
          level: "3rd Level",
          castingTime: "Action",
          range: "10 Feet",
          duration: "10 Minutes",
          school: "Charms",
          description:
            "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead. The spell fails if the corpse was the target of this spell within the last 10 days. Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are hostile to it or it recognizes you as an enemy. This spell doesn't return the creature's soul to its body, only its animating spirit. Thus, the corpse can't learn new information, doesn't comprehend anything that has happened since it died, and can't speculate about future events.",
        },
      ],
      "5th Level": [
        {
          name: "Morbus",
          class: ["Gravetouched"],
          level: "5th Level",
          castingTime: "Action",
          range: "Touch",
          duration: "7 Days",
          school: "Healing",
          tags: ["Dark"],
          description:
            "Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, the target is poisoned. At the end of each of the poisoned target's turns, the target must make a Constitution saving throw. If the target succeeds on three of these saves, it is no longer poisoned, and the spell ends. If the target fails three of these saves, the target is no longer poisoned, but choose one of the diseases below. The target is subjected to the chosen disease for the spell's duration. Since this spell induces a natural disease in its target, any effect that removes a disease or otherwise ameliorates a disease's effects apply to it. Blinding Sickness: Pain grips the creature's mind, and its eyes turn milky white. The creature has disadvantage on Wisdom checks and Wisdom saving throws and is blinded. Filth Fever: A raging fever sweeps through the creature's body. The creature has disadvantage on Strength checks, Strength saving throws, and attack rolls that use Strength. Flesh Rot: The creature's flesh decays. The creature has disadvantage on Charisma checks and vulnerability to all damage. Mindfire: The creature's mind becomes feverish. The creature has disadvantage on Intelligence checks and Intelligence saving throws, and the creature behaves as if under the effects of the confusion spell during combat. Seizure: The creature is overcome with shaking. The creature has disadvantage on Dexterity checks, Dexterity saving throws, and attack rolls that use Dexterity. Slimy Doom: The creature begins to bleed uncontrollably. The creature has disadvantage on Constitution checks and Constitution saving throws. In addition, whenever the creature takes damage, it is stunned until the end of its next turn.",
        },
      ],
      "8th Level": [
        {
          name: "Pati",
          class: ["Gravetouched"],
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Instantaneous",
          school: "Healing",
          tags: ["Dark"],
          description:
            "You draw the moisture from every creature in a 30-foot cube centered on a point you choose within range. Each creature in that area must make a Constitution saving throw. Constructs and undead aren't affected, and plants and aquatic creatures make this saving throw with disadvantage. A creature takes 12d8 necrotic damage on a failed save, or half as much damage on a successful one. Nonmagical plants in the area that aren't creatures, such as trees and shrubs, wither and die instantly.",
        },
      ],
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
  "Defense Against the Dark Arts": SUBJECT_TO_MODIFIER_MAP.jhc,
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
  Justice: SUBJECT_TO_MODIFIER_MAP.healing,
  Gravetouched: SUBJECT_TO_MODIFIER_MAP.healing,
};
