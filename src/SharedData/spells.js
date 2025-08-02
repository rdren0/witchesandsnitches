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
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Until Dispelled",
          year: 2,
          description:
            "Upon muttering the incantation, the tip of your wand sheds bright light in a narrow 15-foot cone and dim light for an additional 15 feet, much like a flashlight. The light is a bright white with a slight bluish tint. Completely covering the tip of your wand with something opaque blocks the light. The spell ends if you dismiss it with the nox incantation, as a bonus action.",
        },
        {
          name: "Manus",
          restricted: true,
          class: "Charms",
          level: "Cantrip",
          castingTime: "Action",
          range: "30 feet",
          duration: "1 Minute",
          year: 1,
          description:
            "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it. The hand can't attack, activate magical items, or carry more than 10 pounds.",
        },
        {
          name: "Molliare",
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          name: "Beastia Amicatum",
          class: "Charms",
          restricted: true,
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: 2,
          description:
            "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.",
        },
        {
          name: "Diffindo",
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
          level: "1st Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "1 hour",
          year: 3,
          tags: ["R"],
          description:
            "One willing being of your choice that you can see within range rises 3 feet off the ground, and remains suspended there for the duration as if it were hoisted by invisible ropes under its arms. The spell can levitate a target that weighs up to 500 pounds. If more weight than the limit is placed on top of the being, the spell ends, and it falls to the ground.",
        },
        {
          name: "Perfusorius",
          class: "Charms",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          name: "Beastia Nuntium",
          class: "Charms",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: 3,
          description:
            "By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as 'a man or woman dressed in the uniform of the town guard' or 'a red-haired dwarf wearing a pointed hat.' You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.",
        },
        {
          name: "Diminuendo",
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
          level: "2nd Level",
          castingTime: "1 action",
          range: "Self",
          duration: "Concentration, up to 1 hour",
          year: 3,
          restricted: true,
          description:
            "For the duration, each creature you choose within 30 feet of you (including you) are able to converse with each other without anyone or anything else hearing. Instead of the voices, nearby creatures hear a faint buzzing, like white noise. If a creature is within 15 feet of you and sees your mouth move when you speak, it is aware that your voice is being magically masked.",
        },
        {
          name: "Partis Temporus",
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "DADA",
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
        {
          name: "Tranquillitatem",
          class: "Charms",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 3,
          description:
            "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects: You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime. Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo",
          class: "DADA",
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
          name: "Dissonus Ululatus",
          class: "Charms",
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
          class: "DADA",
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
          name: "Fictus",
          class: "Charms",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 4,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can't create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature. As long as you are within range of the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Similarly, you can cause the illusion to make different sounds at different times, even making it carry on a conversation, for example. Physical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration.",
        },
        {
          name: "Fianto Duri",
          class: "Charms",
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
          class: "Charms",
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
          name: "Fraudemo Maxima",
          class: "Charms",
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 Minutes",
          year: 5,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can't create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature. As long as you are within range of the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your Concentration.",
        },
        {
          name: "Herbivicus",
          class: "Charms",
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
          class: "Charms",
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
          class: "Charms",
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
          name: "Obtestor",
          class: "Charms",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          year: 4,
          description:
            "You summon spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower, Two beasts of challenge rating 1 or lower, Four beasts of challenge rating 1/2 or lower, Eight beasts of challenge rating 1/4 or lower. Each beast spirit disappears when it drops to 0 hit points or when the spell ends. The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The DM has the creatures' statistics.",
          higherLevels:
            "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.",
        },
        {
          name: "Repello Inimicum",
          class: "Charms",
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
        {
          name: "Timor",
          class: "Charms",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "Self 30 Foot Radius",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          description:
            "You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn't have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.",
        },
      ],
      "4th Level": [
        {
          name: "Capacious Extremis",
          class: "Charms",
          restricted: true,
          level: "4th Level (ritual)",
          castingTime: "10 minutes",
          range: "Touch",
          duration: "Until dispelled",
          year: 6,
          description:
            "Transform an ordinary small bag/pouch into a Handy Haversack's central pouch, a backpack into a Bag of Holding, or a trunk's internal capacity into a Bag of Holding with: 3 ft. long and 2 ft. wide opening; internal size of 6 ft. long, 4 ft. wide, and 4 ft. deep; 1000 pounds and 150 cubic ft. limits.",
        },
        {
          name: "Confundo",
          class: "Charms",
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
          name: "Engorgio Insectum",
          class: "Charms",
          restricted: true,
          level: "4th Level",
          castingTime: "1 Action",
          range: "30 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          description:
            "You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into giant versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion. Each creature obeys your verbal commands, and in combat, they act on your turn each round. The DM has the statistics for these creatures and resolves their actions and movement. A creature remains in its giant size for the duration, until it drops to 0 hit points, or until you use an action to dismiss the effect on it. The DM might allow you to choose different targets. For example, if you transform a bee, its giant version might have the same statistics as a giant wasp.",
        },
        {
          name: "Glacius Maxima",
          class: "Charms",
          restricted: true,
          level: "4th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Instantaneous",
          year: 6,
          description:
            "A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one. Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.",
        },
        {
          name: "Imperio Creatura",
          class: "Charms",
          restricted: true,
          level: "4th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          description:
            "You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as 'Attack that creature,' 'Run over there,' or 'Fetch that object.' If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability. You can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
          higherLevels:
            "When you cast this spell with a 5th-level spell slot, the duration is concentration, up to 10 minutes. When you use a 6th-level spell slot, the duration is concentration, up to 1 hour. When you use a spell slot of 7th level or higher, the duration is concentration, up to 8 hours.",
        },
        {
          name: "Repello Muggletum",
          class: "Charms",
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
          class: "Charms",
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
          class: "DADA",
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
          class: "Charms",
          restricted: true,
          level: "5th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          description:
            "You attempt to reshape another being's memories. One being you can see within range must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target becomes charmed by you for the duration. You can eliminate the target's memory of an event or detail that it experienced or perceived within the last 24 hours and that lasted no more than 10 minutes.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, you can eliminate the target's memories of an event that took place up to 7 days ago (6th level), 30 days ago (7th level), 1 year ago (8th level), or any time in the creature's past (9th level).",
        },
        {
          name: "Piertotum Locomotor",
          class: "Charms",
          restricted: true,
          level: "5th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          description:
            "Objects come to life at your command. Choose up to five nonmagical objects within range that are not being worn or carried. Medium targets count as one object, Large targets count as two objects, Huge targets count as four objects. You can't animate any object larger than Huge. Each target animates and becomes a creature under your control until the spell ends or until reduced to 0 hit points.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, you can animate one additional object for each slot level above 5th.",
        },
        {
          name: "Salvio Hexia",
          class: "DADA",
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
          name: "Incarcerebra",
          class: "Charms",
          restricted: true,
          level: "6th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 7,
          description:
            "You attempt to bind a creature within an illusory cell that only it perceives. One creature you can see within range must make an Intelligence saving throw. The target succeeds automatically if it is immune to being charmed. On a successful save, the target takes 5d10 psychic damage, and the spell ends. On a failed save, the target takes 5d10 psychic damage, and you make the area immediately around the target's space appear dangerous to it in some way. You might cause the target to perceive itself as being surrounded by fire, floating razors, or hideous maws filled with dripping teeth. Whatever form the illusion takes, the target can't see or hear anything beyond it and is restrained for the spell's duration. If the target is moved out of the illusion, makes a melee attack through it, or reaches any part of its body through it, the target takes 10d10 psychic damage, and the spell ends.",
        },
        {
          name: "Oculus Malus",
          class: "DADA",
          restricted: true,
          level: "6th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 7,
          description:
            "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration. On each of your turns until the spell ends, you can use your action to target another creature but can't target a creature again if it has succeeded on a saving throw against this casting of Oculus Malus. Asleep: The target falls unconscious. It wakes up if it takes any damage or if another creature uses its action to shake the sleeper awake. Panicked: The target is frightened of you. On each of its turns, the frightened creature must take the Dash action and move away from you by the safest and shortest available route, unless there is nowhere to move. If the target moves to a place at least 60 feet away from you where it can no longer see you, this effect ends. Sickened: The target has disadvantage on attack rolls and ability checks. At the end of each of its turns, it can make another Wisdom saving throw. If it succeeds, the effect ends.",
        },
        {
          name: "Protego Totalum",
          class: "DADA",
          restricted: true,
          level: "6th Level",
          castingTime: "Action",
          range: "Self (10-foot-radius sphere)",
          duration: "Concentration, up to 1 minute",
          year: 7,
          description:
            "An immobile, faintly shimmering barrier springs into existence in a 10-foot radius around you and remains for the duration. Any attack or spell of 5th level or lower cast from outside the barrier can't affect creatures or objects within it, even if the spell is cast using a higher level spell slot. Such a spell can target creatures and objects within the barrier, but the spell has no effect on them. Similarly, the area within the barrier is excluded from the areas affected by such spells.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the barrier blocks spells of one level higher for each slot level above 6th.",
        },
      ],
      "7th Level": [
        {
          name: "Herbarifors",
          class: "DADA",
          level: "7th Level",
          castingTime: null,
          range: null,
          duration: null,
          year: 7,
          description:
            "You touch a creature, and magical healing plants begin to grow from its wounds stimulating its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute). The target's severed body members (fingers, legs, tails, and so on), if any, grow limb shaped vines, restoring the limb after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the plants to reach out to knit to the stump.",
        },
      ],
      "8th Level": [
        {
          name: "Dubium/Fiducium",
          class: "Charms",
          restricted: true,
          level: "8th Level",
          castingTime: "1 Hour",
          range: "60 Feet",
          duration: "10 days",
          year: 7,
          description:
            "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 200-foot cube. Then specify an intelligent creature. You invest the target with an aura that either attracts or repels the specified intelligent creatures for the duration. Choose antipathy or sympathy as the aura's effect. Dubium: The enchantment causes creatures of the kind you designated to feel an intense urge to leave the area and avoid the target. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or become frightened. Fiducium: The enchantment causes the specified creatures to feel an intense urge to approach the target while within 60 feet of it or able to see it. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or use its movement on each of its turns to enter the area or move within reach of the target.",
        },
      ],
      "9th Level": [
        {
          name: "Fidelius Mysteria Celare",
          class: "Charms",
          restricted: true,
          level: "9th Level",
          castingTime: "1 hour",
          range: "Self (150-foot-radius hemisphere)",
          duration: "Until dispelled",
          year: 7,

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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "Outbreaks of this jinx is a common occurrence when students get in fights, resulting in grotesque pimples covering the victims face. Make a ranged spell attack against a being within range. On a hit, it takes 1d4 psychic damage and has disadvantage on the next attack roll it makes before the end of its next turn. Additionally, it has disadvantage on the next Charisma ability check it makes.",
          higherLevels:
            "This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).",
        },
        {
          name: "Genu Recurvatum",
          class: "DADA",
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
          class: "DADA",
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
          name: "Insectum",
          class: "DADA",
          restricted: true,
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 1,
          description:
            "You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet. Roll a d4 for the direction: 1, north; 2, south; 3, east; or 4, west. This movement doesn't provoke opportunity attacks, and if the direction rolled is blocked, the target doesn't move.",
          higherLevels:
            "The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
        },
        {
          name: "Locomotor Wibbly",
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 3,
          tags: ["R"],
          description:
            "A strong gust of air flows out from the tip of your wand, and creates one of the following effects at a point you can see within range: One Medium or smaller creature that you choose must succeed on a Strength saving throw or be instantaneously pushed up to 5 feet away from you and be rendered unable to move closer to you for the duration. You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you per round, for the duration of the spell. It isn't pushed with enough force to cause damage. You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters shut, or your clothing to ripple in a breeze. If desired, the air can be hot and function like a blow dryer.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd. The creatures must be within 30 feet of each other when you target them.",
        },
      ],
      "3rd Level": [
        {
          name: "Confringo",
          class: "DADA",
          level: "3rd Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 5,
          description:
            "A tiny ball of fire flashes from your wand to a point you choose within range and then explodes into a fiery blast on impact. Each creature in a 10-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren't worn or carried.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 and the radius increases by 5 feet for each slot level above 3rd.",
        },
        {
          name: "Conjunctivia",
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
          restricted: true,
          level: "3rd Level",
          castingTime:
            "1 action or reaction, which you take when you see a creature within 60 feet of you casting a spell",
          range: "60 feet",
          duration: "1 round",
          year: 4,
          description:
            "You attempt to interrupt a being you can see in the process of casting a spell. If the creature is verbally casting a spell of 3rd level or lower, its spell fails and has no effect. If it is verbally casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect. On a success or if the being was casting the spell non-verbally, the target must cast all other spells non-verbally until the end of its next turn. If it tries to cast a spell verbally, it must first succeed on an Intelligence saving throw, or the casting fails and the spell is wasted.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.",
        },
      ],
      "4th Level": [
        {
          name: "Levicorpus",
          class: "DADA",
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
          class: "DADA",
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
          class: "DADA",
          level: "4th Level (ritual)",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          year: 4,
          tags: ["R"],
          description:
            "This spell disintegrates a Large or smaller nonmagical object or transfigured/conjured construct you can see within range. If the target is a Huge or larger object or construct, this spell disintegrates a 10-foot-cube portion of it.",
        },
        {
          name: "Sectumsempra",
          class: "DADA",
          level: "4th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Instantaneous",
          year: 6,
          description:
            "Make a ranged spell attack against a target within range. On a hit, the target must make a Constitution saving throw. On a failed save, a creature takes 10d6 slashing damage and another 5d6 slashing damage at the end of its next turn. On a successful save, a creature takes half the initial damage and half the damage at the end of its next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the initial damage increases by 2d6 for each slot level above 4th.",
        },
      ],
      "5th Level": [
        {
          name: "Insectum Maxima",
          class: "DADA",
          restricted: true,
          level: "5th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          description:
            "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.",
        },
        {
          name: "Nullum Effigium",
          class: "DADA",
          restricted: true,
          level: "5th Level",
          castingTime: "10 minutes",
          range: "Self (60-foot-radius sphere)",
          duration: "8 hours",
          year: 7,
          description:
            "Commonly used by the Department of Magical Law enforcement, this wards an area against apparition or disapparition. No one may arrive in the warded area via apparition, nor may any creatures within the warded area cast the spell. Any attempt to do so results in the typical apparition effect, except the creature stays exactly where they are.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the radius of the sphere increases by 60 feet for each slot level above 5th.",
        },
        {
          name: "Omnifracto",
          class: "DADA",
          restricted: true,
          level: "5th Level",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Instantaneous",
          year: 7,
          description:
            "A piercing beam of light shoots out from the tip of your wand, shattering any defensive magic it passes through. Choose a target within range. Protego totalum, repello inimicum, and all defensive spells that are improving that creature's AC or granting it temporary hit points are dispelled.",
        },
      ],
      "7th Level": [
        {
          name: "Azreth",
          class: "DADA",
          restricted: true,
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
          class: "DADA",
          restricted: true,
          level: "7th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          description:
            "The Cruciatus Curse - One of the three Unforgivable Curses. Causes intense, excruciating pain to the victim. Prolonged use can cause permanent insanity. Using this curse on another human being is punishable by a life sentence in Azkaban.",
        },
      ],
      "8th Level": [
        {
          name: "Avada Kedavra",
          class: "DADA",
          restricted: true,
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
          class: "Transfiguration",
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
          class: "Transfiguration",
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
          class: "Transfiguration",
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
          class: "Transfiguration",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 1,
          description:
            "A flickering blue flame flows out from the tip of your wand, condensing on an object, in a container, or in your hand. The flame remains there for the duration and only emanates heat directly upwards. It doesn't harm anything beneath or around it, and seems to hover slightly above whatever it's resting upon. If placed beneath a flammable object, a natural fire may be started from the heat. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as a bonus action.",
        },
        {
          name: "Incendio Ruptis",
          class: "Transfiguration",
          level: "Cantrip",
          restricted: true,
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 1,
          description:
            "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
          higherLevels:
            "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
        },
        {
          name: "Magno",
          class: "Transfiguration",
          level: "Cantrip",
          restricted: true,
          castingTime: "Action",
          range: "Self (5 Foot Radius)",
          duration: "1 Round",
          year: 1,
          description:
            "You brandish your Transfigured Armament in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming magic until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
          higherLevels:
            "At 5th level, the melee attack deals an extra 1d8 thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).",
        },
        {
          name: "Orchideous",
          class: "Transfiguration",
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
          class: "Transfiguration",
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Until Dispelled",
          year: 2,
          description:
            "This universal incantation is taught to Hogwarts students in their first Transfiguration class. You transfigure one nonmagical object that you can see within range and that fits within a 1-foot cube into another nonmagical object of similar size and mass and of equal or lesser value.",
          higherLevels:
            "When you cast this spell using a spell slot of 1st level or higher, you may select or stack one of the following effects for each slot level above 0: Increase the cube's size by 1 foot, Affect a magical object, Affect a living creature (3rd level+), Create an object of greater value.",
        },
      ],
      "1st Level": [
        {
          name: "Diffindo",
          class: "Transfiguration",
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "A thin, purple beam shoots from the tip of your wand, slicing through whatever it touches. Choose one creature, object, or magical effect within range. A creature must make a Dexterity saving throw. On a failed save, a creature takes 2d8 slashing damage. On a successful save, it takes half damage. This spell can slice through rope, clothing, or thin materials automatically.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
        },
        {
          name: "Engorgio",
          class: "Transfiguration",
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "10 Minutes",
          year: 3,
          description:
            "You cause a creature or an object to grow larger. If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once. Choose a creature or object that you can see within range to grow to double its size in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the target grows to triple its size for 3rd level, or quadruple for 5th level.",
        },
        {
          name: "Reducio",
          class: "Transfiguration",
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "10 Minutes",
          year: 3,
          description:
            "You cause a creature or an object to shrink. If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once. Choose a creature or object that you can see within range to shrink to half its size in all dimensions, and its weight is multiplied by one-eighth. This reduction decreases its size by one category.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the target shrinks to one-third its size for 3rd level, or one-quarter for 5th level.",
        },
      ],
      "2nd Level": [
        {
          name: "Animato",
          class: "Transfiguration",
          level: "2nd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          description:
            "Objects come to life at your command. Choose up to ten nonmagical objects within range that are not being worn or carried. You can also choose a smaller number of larger objects; treat a Large object as four objects, a Huge object as nine objects, and a Gargantuan object as sixteen objects. Each target animates and becomes a creature under your control until the spell ends or until reduced to 0 hit points.",
        },
        {
          name: "Glacius",
          class: "Transfiguration",
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "You create a frigid blast of cold air. Each creature in a 15-foot cone must make a Constitution saving throw. A creature takes 3d8 cold damage on a failed save, or half as much damage on a successful one. A creature killed by this spell becomes a frozen statue until it thaws.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
        },
      ],
      "3rd Level": [
        {
          name: "Fulgur",
          class: "Transfiguration",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          description:
            "A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see within range directly above you. The spell fails if you can't see a point in the air where the storm cloud could appear. When you cast the spell, choose a point you can see under the cloud. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th or higher level, the damage increases by 1d10 for each slot level above 3rd.",
        },
        {
          name: "Ignis Laquis",
          class: "Transfiguration",
          restricted: true,
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Dedication, up to 1 minute",
          year: 5,
          description:
            "You create a long, snaking whip of fire from the tip of your wand, lashing out and coiling around a creature in range. Make a melee spell attack against the target. On a hit, the creature takes 4d10 fire damage and is grappled for the duration. As an action, the target can make a Strength or Dexterity saving throw to end the spell's effects. On each of your following turns spent maintaining dedication, the whip tightens and you deal 4d10 fire damage to the target automatically.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the initial damage and subsequent turn damage increases by 1d10 for each slot level above 3rd.",
        },
        {
          name: "Melofors",
          class: "Transfiguration",
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "1 minute",
          year: 4,
          description:
            "You conjure a pumpkin around a target's head, blinding and deafening it. Choose a creature you can see within range to make a Dexterity saving throw. On a failed save, the target is blinded and deafened for the duration. At the end of each of its turns, the target can make a Constitution saving throw. On a success, the spell ends on the target.",
        },
      ],
      "4th Level": [
        {
          name: "Incendio",
          class: "Transfiguration",
          level: "4th Level",
          castingTime: "Action",
          range: "Self (30-foot radius)",
          duration: "Concentration, up to 1 minute",
          year: 5,
          description:
            "A wave of thunderous force sweeps out from you. Each creature in a 30-foot radius must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. Additionally, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect.",
        },
      ],
      "5th Level": [
        {
          name: "Draconiverto",
          class: "Transfiguration",
          level: "5th Level",
          castingTime: "1 minute",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          year: 6,
          description:
            "You transfigure raw materials within range into a dragon construct. Choose a pile of bones, a corpse of a Large or smaller creature, or a collection of raw materials like metal, stone, or clay. Your spell imbues the target with foul mimicry of life, raising it as a dragon wyrmling of challenge rating 2 or lower. The creature is under your control for 24 hours, after which it stops obeying any command you've given it. To maintain control of the creature for another 24 hours, you must cast this spell on the creature again before the current 24-hour period ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level, choose one of the following options: Two dragon wyrmlings of challenge rating 3 or lower, Three dragon wyrmlings of challenge rating 2 or lower. When you cast this spell using a spell slot of 9th level, choose one of the following options: Two dragon wyrmlings of challenge rating 4 or lower, Four dragon wyrmlings of challenge rating 2 or lower.",
        },
        {
          name: "Transmogrify",
          class: "Transfiguration",
          level: "5th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          year: null,
          description:
            "You attempt to turn one creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target's. The target's game statistics are replaced by the statistics of the chosen beast. It retains its alignment and personality.",
        },
      ],
      "6th Level": [
        {
          name: "Ignis Furore",
          class: "Transfiguration",
          level: "6th Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: 7,
          description:
            "You create a ringed wall of fire within range up to 20 feet in diameter, 20 feet high, and 10 feet thick choosing whether it's touching the ground or in the air. The wall is opaque and lasts for the duration. When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 4d8 fire damage, or half as much damage on a successful save. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the damage increases by 1d8 for each slot level above 6th.",
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
          class: "Divinations",
          restricted: true,
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
          class: "Divinations",
          restricted: true,
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: 3,
          description:
            "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
        },
        {
          name: "Mumblio",
          class: "Divinations",
          restricted: true,
          level: "Cantrip",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 3,
          description:
            "You point your wand toward a being within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn't have to follow a straight line and can travel freely around corners or through openings.",
        },
        {
          name: "Point Me",
          class: "Divinations",
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
          class: "Divinations",
          level: "Cantrip",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 3,
          description:
            "Often used as an investigative tool in wizarding crimes, this spell produces a ghostly recreation of the previous spell cast by the currently used wand. If the previously cast spell cannot be represented visually, you learn the incantation that was used, regardless of whether the incantation was spoken aloud at the time of casting. This spell can be cast a total of three consecutive times on a single wand, revealing the three most recently cast spells.",
        },
      ],
      "1st Level": [
        {
          name: "Bestia Vinculum",
          class: "Divinations",
          restricted: true,
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 10 minutes",
          year: 3,
          description:
            "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast's Intelligence is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
        },
        {
          name: "Formidulosus",
          class: "Divinations",
          restricted: true,
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Linguarium",
          class: "Divinations",
          level: "1st Level (Ritual)",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 3,
          tags: ["R"],
          description:
            "For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn't decode secret messages in a text or glyph, such as a Arithmantic Equation or Runic Script, that isn't part of a written language.",
        },
        {
          name: "Lux Maxima",
          class: "Divinations",
          restricted: true,
          level: "1st Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 3,
          description:
            "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 2d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Luxus Manus",
          class: "Divinations",
          level: "1st Level (Ritual)",
          castingTime: "1 Minute",
          range: "5 Feet",
          duration: "Concentration, 8 Hours",
          year: 4,
          tags: ["R"],
          description:
            "You create a Tiny incorporeal hand of shimmering light in an unoccupied space you can see within range. The hand exists for the duration, but it disappears if you apparate or use a portkey. When the hand appears, you name one major landmark, such as a city, mountain, castle, or battlefield. Someone in history must have visited the site and mapped it. If the landmark appears on no map in existence, the spell fails. Otherwise, whenever you move toward the hand, it moves away from you at the same speed you moved, and it moves in the direction of the landmark, always remaining 5 feet away from you. If you don't move toward the hand, it remains in place until you do and beckons for you to follow once every 1d4 minutes.",
        },
        {
          name: "Martem",
          class: "Divinations",
          restricted: true,
          level: "1st Level",
          castingTime: "1 Minute",
          range: "Touch",
          duration: "8 Hours",
          year: 3,
          description:
            "You touch a willing creature. For the duration, the target can add 1d8 to its initiative rolls.",
        },
        {
          name: "Motus Revelio",
          class: "Divinations",
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 1 Minute",
          year: 3,
          description:
            "You attune your senses to pick up the emotions of others for the duration. When you cast the spell, and as your action on each turn until the spell ends, you can focus your senses on one being you can see within 30 feet of you. You instantly learn the target's prevailing emotion, whether it's love, anger, pain, fear, calm, or something else. If the target isn't actually a being or it is immune to being charmed, you sense that it is calm.",
        },
        {
          name: "Specialis Revelio",
          class: "Divinations",
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Instantaneous",
          year: 4,
          description:
            "You tap your wand on an object or area, revealing magical influences. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it. If cast on an area, you learn what spells, if any, are currently active within a 5-foot cube in front of you. The border of each spell's effect is illuminated within that cube, much like blowing dust through laser beams.",
        },
        {
          name: "Venenum Revelio",
          class: "Divinations",
          level: "1st Level (Ritual)",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 10 Minutes",
          year: 3,
          tags: ["R"],
          description:
            "For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case. The spell can penetrate most barriers, but is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.",
        },
      ],
      "2nd Level": [
        {
          name: "Absconditus Revelio",
          class: "Divinations",
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 4,
          description:
            "For the duration, you see invisible creatures (excluding beings) and objects as if they were visible.",
        },
        {
          name: "Beastia Sensibus",
          class: "Divinations",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 4,
          description:
            "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.",
        },
        {
          name: "Exspiravit",
          class: "Divinations",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          description:
            "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs. The phantasm includes sound, temperature, and other stimuli, also evident only to the creature. The target can use its action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends. While a target is affected by the spell, the target treats the phantasm as if it were real. The target rationalizes any illogical outcomes from interacting with the phantasm. For example, a target attempting to walk across a phantasmal bridge that spans a chasm falls once it steps onto the bridge. If the target survives the fall, it still believes that the bridge exists and comes up with some other explanation for its fall; it was pushed, it slipped, or a strong wind might have knocked it off. An affected target is so convinced of the phantasm's reality that it can even take damage from the illusion. A phantasm created to appear as a creature can attack the target. Similarly, a phantasm created to appear as fire, a pool of acid, or lava can burn the target. Each round on your turn, the phantasm can deal 1d6 psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm, provided that the illusion is of a creature or hazard that could logically deal damage, such as by attacking. The target perceives the damage as a type appropriate to the illusion.",
        },
        {
          name: "Facultatem",
          class: "Divinations",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: 4,
          description:
            "You temporarily gain knowledge by using your divination magic to guide you. Choose one skill in which you lack proficiency. For the spell's duration, you have proficiency in the chosen skill. The spell ends early if you cast it again.",
        },
        {
          name: "Inanimatus Revelio",
          class: "Divinations",
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, 10 Minutes",
          year: 4,
          description:
            "Describe or name an object that is familiar to you. You sense the direction to the object's location, as long as that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement. The spell can locate a specific object known to you, as long as you have seen it up close – within 30 feet – at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon. This spell can't locate an object if any thickness of lead, even a thin sheet, blocks a direct path between you and the object.",
        },
        {
          name: "Secundio",
          class: "Divinations",
          level: "2nd Level",
          castingTime: "1 Minute",
          range: "60 Feet",
          duration: "1 Hour",
          year: 4,
          description:
            "You impart latent luck to yourself or one willing creature you can see within range. When the chosen creature makes an attack roll, an ability check, or a saving throw before the spell ends, it can dismiss this spell on itself to roll an additional d20 and choose which of the d20s to use. Alternatively, when an attack roll is made against the chosen creature, it can dismiss this spell on itself to roll a d20 and choose which of the d20s to use, the one it rolled or the one the attacker rolled. If the original d20 roll has advantage or disadvantage, the creature rolls the additional d20 after advantage or disadvantage has been applied to the original roll.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
        },
        {
          name: "Trabem",
          class: "Divinations",
          restricted: true,
          level: "2nd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          description:
            "A silvery beam of pale light shines down in a 5-foot radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in radiant light that causes searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.",
        },
      ],
      "3rd Level": [
        {
          name: "Annotatem",
          class: "Divinations",
          level: "3rd Level",
          castingTime: "10 Minutes",
          range: "1 Mile",
          duration: "Concentration, 10 Minutes",
          year: 5,
          description:
            "You create an invisible sensor within range in a location familiar to you (a place you have visited or seen before) or in an obvious location that is unfamiliar to you (such as behind a door, around a corner, or in a grove of trees). The sensor remains in place for the duration, and it can't be attacked or otherwise interacted with. When you cast the spell, you choose seeing or hearing. You can use the chosen sense through the sensor as if you were in its space. As an action, you can switch between seeing and hearing. A creature that can see the sensor (such as a creature benefitting from absconditus revelio or verum aspectum) sees a luminous, intangible orb about the size of your fist.",
        },
        {
          name: "Legilimens",
          class: "Divinations",
          restricted: true,
          level: "3rd Level",
          castingTime: "1 action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          description:
            "You attempt to read the thoughts of a creature you can see within range. The target must make a Wisdom saving throw. If the target's Intelligence is 3 or lower or if it doesn't speak a language, it is unaffected. On a successful save, you learn that the spell failed, and the target knows you attempted to read its thoughts. On a failed save, you gain insight into the target's reasoning, emotional state, and thoughts that loom large in its mind (including things the target worries about, loves, or hates). You can also search the target's memory for information about a specific topic, which requires an opposed Intelligence check. If you succeed, you learn the information if the target knows it. Each time you maintain concentration on this spell, you can choose to either gain new insights or search for specific information.",
        },
        {
          name: "Linguarium Maxima",
          class: "Divinations",
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
          class: "Divinations",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "Unlimited",
          duration: "1 Round",
          year: 5,
          description:
            "You send a short message of twenty-five words or less to a creature with which you are familiar. The creature hears the message in its mind, recognizes you as the sender if it knows you, and can answer in a like manner immediately. The spell enables creatures with Intelligence scores of at least 1 to understand the meaning of your message. You can send the message across any distance and even to other planes of existence, but if the target is on a different plane than you, there is a 5 percent chance that the message doesn't arrive.",
        },
        {
          name: "Revelio",
          class: "Divinations",
          level: "3rd Level",
          castingTime: "Action",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 5,
          description:
            "With a twist of your wand, the true appearance of a creature or object is revealed. A disguised, hidden, invisible or otherwise magically concealed target is made visible, dispelling any spell producing such effects and magically removing physical alterations. Your wand must be pointing at the target for this spell to take effect.",
        },
        {
          name: "Stellaro",
          class: "Divinations",
          restricted: true,
          level: "3rd Level",
          castingTime: "Action",
          range: "Self (15 Foot Radius)",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          description:
            "You call forth Constellations to protect you. Tiny Stars flit around you to a distance of 15 feet for the duration. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
      ],
      "4th Level": [
        {
          name: "Appare Vestigium",
          class: "Divinations",
          level: "4th Level (Ritual)",
          castingTime: "1 Minute",
          range: "Self (30 Foot Radius Hemisphere)",
          duration: "Concentration, 10 Minutes",
          year: 7,
          tags: ["R"],
          description:
            "With a spin and a spray of golden mist, recent magical activity is revealed and illuminated through ghostly images hanging in the air, recreating the magical beings, magical creatures, or magical events that have been in the area within the last 10 minutes. Magical footprints and track marks are also highlighted on the ground. Any of the effects can be hidden, highlighted, or expanded for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of a higher level, the historical window extends to 1 hour (5th level), 24 hours (6th level), or a week (7th level).",
        },
        {
          name: "Creatura Revelio",
          class: "Divinations",
          level: "4th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Dedication, 1 Hour",
          year: 6,
          description:
            "Describe or name a creature that is familiar to you. You sense the direction to the creature's location, as long as that creature is within 1,000 feet of you. If the creature is moving, you know the direction of its movement. The spell can locate a specific creature known to you, or the nearest creature of a specific kind (such as a human or a unicorn), so long as you have seen such a creature up close—within 30 feet—at least once. If the creature you described or named is in a different form, such as being under the effects of a polymorph spell, this spell doesn't locate the creature. This spell can't locate a creature if running water at least 10 feet wide blocks a direct path between you and the creature.",
        },
        {
          name: "Homenum Revelio",
          class: "Divinations",
          level: "4th Level",
          castingTime: "1 Action",
          range: "Self (60 Foot Sphere)",
          duration: "Instantaneous",
          year: 7,
          description:
            "You sense the presence and general direction of each human or magical being within range. If any being is moving, you know its direction. If the being is transfigured into a beast or object, this spell won't sense that being. A being is alerted to being detected by this spell, as the spell produces an odd feeling of something standing right behind you or over you.",
        },
        {
          name: "Oculus Speculatem",
          class: "Divinations",
          level: "4th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Dedication, 1 Hour",
          year: 6,
          description:
            "You create an invisible, magical eye within range that hovers in the air for the duration. You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction. As an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move. A solid barrier blocks the eye's movement, but the eye can pass through an opening as small as 1 inch in diameter.",
        },
      ],
      "5th Level": [
        {
          name: "Annotatem Maxima",
          class: "Divinations",
          restricted: true,
          level: "5th Level",
          castingTime: "10 Minutes",
          range: "Self",
          duration: "Dedication, 10 Minutes",
          year: 6,
          description:
            "You can see and hear a particular creature you choose that is on the same plane of existence as you. The target must make a Wisdom saving throw, which is modified by how well you know the target and the sort of physical connection you have to it. If a target knows you're casting this spell, it can fail the saving throw voluntarily if it wants to be observed. On a successful save, the target isn't affected, and you can't use this spell against it again for 24 hours. On a failed save, the spell creates an invisible sensor within 10 feet of the target. You can see and hear through the sensor as if you were there. The sensor moves with the target, remaining within 10 feet of it for the duration. A creature that can see invisible objects sees the sensor as a luminous orb about the size of your fist. Instead of targeting a creature, you can choose a location you have seen before as the target of this spell. When you do, the sensor appears at that location and doesn't move.",
        },
        {
          name: "Augurium",
          class: "Divinations",
          level: "5th Level (Ritual)",
          castingTime: "1 Minute",
          range: "Self",
          duration: "1 Minute",
          year: 6,
          tags: ["R"],
          description:
            "You wave your wand and connect with your third eye, asking up to three questions that can be answered with a yes or no. You must ask your questions before the spell ends. You receive a correct answer for each question. Divination Magic isn't necessarily omniscient, so you might receive 'unclear' as an answer if a question pertains to information that lies beyond your own capabilities. In a case where a one-word answer could be misleading or contrary to your interests, the DM might offer a short phrase as an answer instead. If you cast the spell two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer. The DM makes this roll in secret.",
        },
        {
          name: "Lunativia",
          class: "Divinations",
          restricted: true,
          level: "5th Level",
          castingTime: "Action",
          range: "Self (60-foot line)",
          duration: "Concentration and Dedication, up to 1 minute",
          year: 6,
          description:
            "A beam of brilliant light flashes out from your hand in a 60-foot-line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw. You can create a new line of radiance when you maintain dedication on subsequent turns until the spell ends. For the duration, a mote of brilliant radiance shines in your hand. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. The light is moonlight.",
        },
        {
          name: "Mumblio Totalum",
          class: "Divinations",
          restricted: true,
          level: "5th Level (Ritual)",
          castingTime: "Action",
          range: "30 Feet",
          duration: "1 Hour",
          year: 6,
          tags: ["R"],
          description:
            "You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can't extend to other planes of existence.",
        },
      ],
      "6th Level": [
        {
          name: "Invenire Viam",
          class: "Divinations",
          restricted: true,
          level: "6th Level",
          castingTime: "1 Minute",
          range: "Self",
          duration: "Concentration, 1 Day",
          year: 7,
          description:
            "This spell allows you to find the shortest, most direct physical route to a specific fixed location that you are familiar with on the same plane of existence. If you name a destination that moves (such as a mobile fortress), or a destination that isn't specific (such as 'a green dragon's lair'), the spell fails. For the duration, as long as you are on the same plane of existence as the destination, you know how far it is and in what direction it lies. While you are traveling there, whenever you are presented with a choice of paths along the way, you automatically determine which path is the shortest and most direct route (but not necessarily the safest route) to the destination.",
        },
        {
          name: "Natura Incantatem",
          class: "Divinations",
          restricted: true,
          level: "6th Level",
          castingTime: "1 Minute",
          range: "Self",
          duration: "Instantaneous",
          year: 7,
          description:
            "You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in dungeons and towns. You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area: terrain and bodies of water, prevalent plants, minerals, animals, or peoples, powerful celestials, fey, fiends, elementals, or undead, influence from other planes of existence, Buildings. For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.",
        },
        {
          name: "Verum Aspectum",
          class: "Divinations",
          level: "6th Level",
          castingTime: "Action",
          range: "Touch",
          duration: "1 Hour",
          year: 7,
          description:
            "This spell gives the willing creature you touch the ability to see things as they actually are. For the duration, the creature has truesight and notices secret doors hidden by magic out to a range of 120 feet.",
        },
      ],
      "8th Level": [
        {
          name: "Solativia",
          class: "Divinations",
          restricted: true,
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Instantaneous",
          year: 7,
          description:
            "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 20d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw. A creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded. This spell dispels any magical darkness in its area.",
        },
      ],
      "9th Level": [
        {
          name: "Providentium",
          class: "Divinations",
          restricted: true,
          level: "9th Level",
          castingTime: "1 Minute",
          range: "Touch",
          duration: "8 Hours",
          year: 7,
          description:
            "You touch a willing creature and bestow a limited ability to see into the immediate future. For the duration, the target can't be surprised and has advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against the target for the duration. This spell immediately ends if you cast it again before its duration ends.",
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 1,
          restricted: true,
          description:
            "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
          higherLevels:
            "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
        },
      ],
      "1st Level": [
        {
          name: "Diffindo Glacia",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 2,
          restricted: true,
          description:
            "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of the point where the ice exploded must succeed on a Dexterity saving throw or take 2d6 cold damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.",
        },
        {
          name: "Intonuit Fluctus",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 3,
          restricted: true,
          description:
            "A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
        },
      ],
      "3rd Level": [
        {
          name: "Fulgur",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          restricted: true,
          description:
            "A storm cloud appears in the shape of a cylinder that is 10 feet tall with a 60-foot radius, centered on a point you can see within range directly above you. The spell fails if you can't see a point in the air where the storm cloud could appear (for example, if you are in a room that can't accommodate the cloud). When you cast the spell, choose a point you can see under the cloud. A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes 3d10 lightning damage on a failed save, or half as much damage on a successful one. On each of your turns until the spell ends, you can use your action to call down lightning in this way again, targeting the same point or a different one. If you are outdoors in stormy conditions when you cast this spell, the spell gives you control over the existing storm instead of creating a new one. Under such conditions, the spell's damage increases by 1d10.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th or higher level, the damage increases by 1d10 for each slot level above 3rd.",
        },
        {
          name: "Respersio",
          class: "Transfiguration",
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          year: 4,
          restricted: true,
          description:
            "You conjure up a wave of water that crashes down on an area within range. The area can be up to 30 feet long, up to 10 feet wide, and up to 10 feet tall. Each creature in that area must make a Dexterity saving throw. On a failure, a creature takes 4d8 bludgeoning damage and is knocked prone. On a success, a creature takes half as much damage and isn't knocked prone. The water then spreads out across the ground in all directions, extinguishing unprotected flames in its area and within 30 feet of it.",
        },
      ],
      "4th Level": [
        {
          name: "Glacius Maxima",
          class: null,
          level: "4th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Instantaneous",
          year: 6,
          restricted: true,
          description:
            "A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one. Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.",
        },
      ],
      "8th Level": [
        {
          name: "Tempestus",
          class: null,
          level: "8th Level",
          castingTime: "1 Minute",
          range: "Sight",
          duration: "Concentration, up to 6 rounds",
          year: 7,
          restricted: true,
          description:
            "A wall of water springs into existence at a point you choose within range. You can make the wall up to 300 feet long, 300 feet high, and 50 feet thick. The wall lasts for the duration. When the wall appears, each creature within its area must make a Strength saving throw. On a failed save, a creature takes 6d10 bludgeoning damage, or half as much damage on a successful save. At the start of each of your turns after the wall appears, the wall, along with any creatures in it, moves 50 feet away from you. Any Huge or smaller creature inside the wall or whose space the wall enters when it moves must succeed on a Strength saving throw or take 5d10 bludgeoning damage. A creature can take this damage only once per round. At the end of the turn, the wall's height is reduced by 50 feet, and the damage creatures take from the spell on subsequent rounds is reduced by 1d10. When the wall reaches 0 feet in height, the spell ends. A creature caught in the wall can move by swimming. Because of the force of the wave, though, the creature must make a successful Strength (Athletics) check against your spell save DC in order to move at all. If it fails the check, it can't move. A creature that moves out of the area falls to the ground.",
        },
      ],
      "9th Level": [
        {
          name: "Fulgur Maxima",
          class: null,
          level: "9th Level",
          castingTime: "Action",
          range: "Self (120-foot line)",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You unleash the ultimate expression of lightning magic. A stroke of pure elemental lightning forming a line 120 feet long and 10 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 12d8 lightning damage on a failed save, or half as much damage on a successful one. The lightning ignites flammable objects in the area that aren't being worn or carried. This spell can be heard from up to 10 miles away and creates a thunderclap that forces each creature within 60 feet of the line to make a Constitution saving throw or be deafened for 1 minute. The raw elemental power of this spell can disrupt magic itself - any spell effects of 4th level or lower in the area are immediately dispelled.",
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "Self (5 Foot Radius)",
          duration: "1 Round",
          year: 1,
          restricted: true,
          description:
            "You brandish your Transfigured Armament in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming magic until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
          higherLevels:
            "At 5th level, the melee attack deals an extra 1d8 thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).",
        },
      ],
      "1st Level": [
        {
          name: "Clario",
          class: null,
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
          year: 7,
          restricted: true,
          description:
            "You imbue a weapon you touch with radiant power. Until the spell ends, the weapon emits bright light in a 15-foot radius and dim light for an additional 15 feet. In addition, weapon attacks made with it deal an extra 1d4 radiant damage on a hit. If the weapon isn't already a magic weapon, it becomes one for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the extra damage increases by 1d4 for each slot level above 1st.",
        },
        {
          name: "Ignis Ictus",
          class: null,
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Dedication, up to 1 minute",
          year: 2,
          restricted: true,
          description:
            "The next time you hit a creature with your Transfigured Armament during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. If you dedicate on this spell, the target must make a Constitution saving throw at the start of each of its turns until the spell ends. On a failed save, it takes 1d6 fire damage. On a successful save, the spell ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot above 1st.",
        },
        {
          name: "Irus Ictus",
          class: null,
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 2,
          restricted: true,
          description:
            "The next time you hit with your Transfigured Armament during this spell's duration, your attack deals an extra 1d6 psychic damage. Additionally, if the target is a creature, it must make a Wisdom saving throw or be frightened of you until the spell ends. As an action, the creature can make a Wisdom check against your spell save DC to steel its resolve and end this spell.",
        },
        {
          name: "Pererro",
          class: null,
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
          year: 1,
          restricted: true,
          description:
            "You touch your Transfigured Armament. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.",
        },
        {
          name: "Tonitrus Ictus",
          class: null,
          level: "1st Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 3,
          restricted: true,
          description:
            "The first time you hit with your Transfigured Armament during this spell's duration, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals an extra 2d6 thunder damage to the target. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and knocked prone.",
        },
      ],
      "2nd Level": [
        {
          name: "Notam Ictus",
          class: null,
          level: "2nd Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restricted: true,
          description:
            "The next time you hit a creature with your Transfigured Armament before this spell ends, the weapon gleams with radiance as you strike. The attack deals an extra 2d6 radiant damage to the target, which becomes visible if it is invisible, and the target sheds dim light in a 5-foot radius and can't become invisible until the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the extra damage increases by 1d6 for each slot level above 2nd.",
        },
      ],
      "3rd Level": [
        {
          name: "Inanus Ictus",
          class: null,
          level: "3rd Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 5,
          restricted: true,
          description:
            "The next time you hit a creature with your Transfigured Armament during this spell's duration, your weapon flares with a bright light, and the attack deals an extra 3d8 radiant damage to the target. Additionally, the target must succeed on a Constitution saving throw or be blinded until the spell ends. A creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded.",
        },
      ],
      "4th Level": [
        {
          name: "Titubo Ictus",
          class: null,
          level: "4th Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restricted: true,
          description:
            "The next time you hit a creature with your Transfigured Armament during this spell's duration, your weapon pierces both body and mind, and the attack deals an extra 4d6 psychic damage to the target. The target must make a Wisdom saving throw. On a failed save, it has disadvantage on attack rolls and ability checks, and can't take reactions until the end of its next turn.",
        },
      ],
      "5th Level": [
        {
          name: "Clario Maxima",
          class: null,
          level: "5th Level",
          castingTime: "Bonus Action",
          range: "Touch",
          duration: "Dedication, up to 1 hour",
          year: 7,
          restricted: true,
          description:
            "You imbue a weapon you touch with power. Until the spell ends, the weapon emits bright light in a 30-foot radius and dim light for an additional 30 feet. In addition, weapon attacks made with it deal an extra 2d8 radiant damage on a hit. If the weapon isn't already a magic weapon, it becomes one for the duration. As a bonus action on your turn, you can dismiss this spell and cause the weapon to emit a burst of radiance. Each creature of your choice that you can see within 30 feet of the weapon must make a Constitution saving throw. On a failed save, a creature takes 4d8 radiant damage, and it is blinded for 1 minute. On a successful save, a creature takes half as much damage and isn't blinded. At the end of each of its turns, a blinded creature can make a Constitution saving throw, ending the effect on itself on a success.",
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
          class: "DADA",
          level: "Cantrip",
          castingTime: "1 Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          restricted: true,
          description:
            "A being's airway is cleared and they are assisted in breathing. If used on a living being that has 0 hit points, the being becomes stable.",
        },
        {
          name: "Rennervate",
          class: "DADA",
          level: "Cantrip",
          castingTime: "1 Round",
          range: "10 Feet",
          duration: "Instantaneous",
          year: 2,
          description:
            "The counterspell to stupefy, this incantation is invaluable in extended combat or team dueling. Magically induced unconsciousness is ended for a being of your choice you can see within range.",
        },
      ],
      "1st Level": [
        {
          name: "Episkey",
          class: "DADA",
          level: "1st Level",
          castingTime: "bonus action",
          range: "10 feet",
          duration: "Instantaneous",
          year: 3,
          description:
            "A being of your choice that you can see within range regains hit points equal to 2d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.",
        },
        {
          name: "Ferula",
          class: "DADA",
          level: "1st Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "10 minutes",
          year: 4,
          description:
            "Bandages and splints are conjured on a being you can see within range, with no more than half of its hit point maximum, and it gains hit points equal to two times your spellcasting ability modifier. Additionally, any Wisdom (Medicine) checks to stabilize that target within the duration are made at advantage, and if the target is successfully stabilized, it regains 1 hit point.",
        },
        {
          name: "Reparifors",
          class: "DADA",
          level: "1st Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Instantaneous",
          year: 3,
          description:
            "With a tap of your wand, a being that you can see within range regains 1d8 hit points. You can also end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Adversus Interitus",
          class: null,
          level: "2nd Level (ritual)",
          castingTime: "1 action",
          range: "Touch",
          duration: "24 hours",
          year: null,
          restricted: true,
          tags: ["R"],
          description:
            "You touch a willing creature and imbue it with protection against death. For the duration, the target has advantage on death saving throws and gains resistance to necrotic damage. If the target drops to 0 hit points while under this protection, it automatically stabilizes and regains 1 hit point at the start of its next turn. Once this automatic revival occurs, the spell ends.",
        },
      ],
      "3rd Level": [
        {
          name: "Aculeo Sanentur",
          class: "DADA",
          level: "3rd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 5,
          restricted: true,
          description:
            "You sacrifice some of your health to mend another creature's injuries. You take 4d8 necrotic damage, which can't be reduced in any way, and one creature of your choice that you can see within range regains a number of hit points equal to twice the necrotic damage you take.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
        {
          name: "Animatem",
          class: "DADA",
          level: "3rd Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Instantaneous",
          year: 4,
          restricted: true,
          description:
            "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts.",
        },
        {
          name: "Intus Sunt",
          class: "DADA",
          level: "3rd Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restricted: true,
          description:
            "Invented by Urquhart Rackharrow, this medieval remedy causes the recipient to purge and experience great abdominal pain. Choose one being that you can see within range to make a Constitution saving throw. If it fails, the target's exhaustion is set to 2 levels for the duration. At the end of each of its turns, the target can make a Constitution saving throw, without disadvantage from exhaustion. On a success, the spell ends. If the target has higher levels of exhaustion than the spell's effect, the spell does not change its levels of exhaustion. If the target gains any levels of exhaustion within the duration of this spell, it stacks with this spell's effect. Additionally, if the target is suffering any condition or negative effects from something it ingested, such as drinking a poison, this spell ends those effects.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, the target's exhaustion is set to 3 levels (6th level), 4 levels (7th level), or 5 levels (8th level).",
        },
        {
          name: "Roboratum",
          class: "DADA",
          level: "3rd Level",
          castingTime: "1 Minute",
          range: "60 Feet",
          duration: "1 Hour",
          year: 5,
          restricted: true,
          description:
            "Choose up to five creatures within range that can hear you. For the duration, each affected creature gains 5 temporary hit points and has advantage on Wisdom saving throws. If an affected creature is hit by an attack, it has advantage on the next attack roll it makes. Once an affected creature loses the temporary hit points granted by this spell, the spell ends for that creature.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the temporary hit points increase by 5 for each slot level above 3rd.",
        },
      ],
      "4th Level": [
        {
          name: "Brackium Emendo",
          class: "DADA",
          level: "4th Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Instantaneous",
          year: 5,
          description:
            "This spell heals a being's broken bones immediately, although the process is quite painful. A being you can see that you tap with your wand regains a number of hit points equal to 5d10 + your spellcasting ability modifier, and gains a level of exhaustion.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the healing increases by 1d10 for each slot level above 4th.",
        },
      ],
      "5th Level": [
        {
          name: "Pervivo",
          class: "DADA",
          level: "5th Level",
          castingTime: "1 Hour",
          range: "Touch",
          duration: "Instantaneous",
          year: 6,
          restricted: true,
          description:
            "You return a dead creature you touch to life, provided that it has been dead no longer than 10 days. If the creature's soul is both willing and at liberty to rejoin the body, the creature returns to life with 1 hit point. This spell also neutralizes any poison and cures non-magical diseases that affected the creature at the time it died. This spell doesn't, however, remove magical diseases, curses, or similar effects; if these aren't first removed prior to casting the spell, they take effect when the creature returns to life. The spell can't return an undead creature to life. This spell closes all mortal wounds, but it doesn't restore missing body parts. If the creature is lacking body parts or organs integral for its survival – its head, for instance – the spell automatically fails. Coming back from the dead is an ordeal. The target takes a -4 penalty to all attack rolls, saving throws, and ability checks. Every time the target finishes a long rest, the penalty is reduced by 1 until it disappears.",
        },
      ],
      "6th Level": [
        {
          name: "Vulnera Sanentur",
          class: "DADA",
          level: "6th Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restricted: true,
          description:
            "Tracing your wand over a being's wounds, you weave a complex counter-curse that undoes the damage dealt to a being. The target regains four times your spellcasting ability modifier + 4d8 hit points instantaneously, and then 4d4 hit points for every following turn for the duration of the spell. If the target has lost body members (fingers, legs, and so on) and the severed part is held to its place throughout the entire duration of the spell, the spell causes the limb to heal back on after 1 minute of casting.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the instantaneous healing increases by 1d8 and the subsequent healing increases by 3d4 for each slot level above 6th.",
        },
      ],
      "7th Level": [
        {
          name: "Herbarifors",
          class: null,
          level: "7th Level",
          castingTime: "1 action",
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 7,
          description:
            "You touch a creature, and magical healing plants begin to grow from its wounds stimulating its natural healing ability. The target regains 4d8 + 15 hit points. For the duration of the spell, the target regains 1 hit point at the start of each of its turns (10 hit points each minute). The target's severed body members (fingers, legs, tails, and so on), if any, grow limb shaped vines, restoring the limb after 2 minutes. If you have the severed part and hold it to the stump, the spell instantaneously causes the plants to reach out to knit to the stump.",
        },
      ],
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 6,
          restricted: true,
          description:
            "You cause a cloud of mites, fleas, and other parasites to appear momentarily on one creature you can see within range. The target must succeed on a Constitution saving throw, or it takes 1d6 poison damage and moves 5 feet in a random direction if it can move and its speed is at least 5 feet. Roll a d4 for the direction: 1, north; 2, south; 3, east; or 4, west. This movement doesn't provoke opportunity attacks, and if the direction rolled is blocked, the target doesn't move.",
          higherLevels:
            "The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
        },
      ],
      "1st Level": [
        {
          name: "Beastia Amicatum",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: null,
          restricted: true,
          description:
            "This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast's Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell's duration. If you or one of your companions harms the target, the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional beast for each slot level above 1st.",
        },
        {
          name: "Beastia Vinculum",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 10 minutes",
          year: null,
          restricted: true,
          description:
            "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast's Intelligence is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
        },
      ],
      "2nd Level": [
        {
          name: "Beastia Nuntium",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "24 Hours",
          year: 3,
          restricted: true,
          tags: ["R"],
          description:
            "By means of this spell, you use an animal to deliver a message. Choose a Tiny beast you can see within range, such as a squirrel, a blue jay, or a bat. You specify a location, which you must have visited, and a recipient who matches a general description, such as 'a man or woman dressed in the uniform of the town guard' or 'a red-haired dwarf wearing a pointed hat.' You also speak a message of up to twenty-five words. The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.",
        },
        {
          name: "Beastia Sensibus",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 hour",
          year: 4,
          restricted: true,
          tags: ["R"],
          description:
            "You touch a willing beast. For the duration of the spell, you can use your action to see through the beast's eyes and hear what it hears, and continue to do so until you use your action to return to your normal senses.",
        },
      ],
      "3rd Level": [
        {
          name: "Obtestor",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          year: 4,
          restricted: true,
          description:
            "You summon spirits that take the form of beasts and appear in unoccupied spaces that you can see within range. Choose one of the following options for what appears: One beast of challenge rating 2 or lower, Two beasts of challenge rating 1 or lower, Four beasts of challenge rating 1/2 or lower, Eight beasts of challenge rating 1/4 or lower. Each beast spirit disappears when it drops to 0 hit points or when the spell ends. The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group, which has its own turns. They obey any verbal commands that you issue to them (no action required by you). If you don't issue any commands to them, they defend themselves from hostile creatures, but otherwise take no actions. The DM has the creatures' statistics.",
          higherLevels:
            "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 5th-level slot, three times as many with a 7th-level slot, and four times as many with a 9th-level slot.",
        },
      ],
      "4th Level": [
        {
          name: "Engorgio Insectum",
          class: null,
          level: "4th Level",
          castingTime: "1 Action",
          range: "30 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          restricted: true,
          description:
            "You transform up to ten centipedes, three spiders, five wasps, or one scorpion within range into giant versions of their natural forms for the duration. A centipede becomes a giant centipede, a spider becomes a giant spider, a wasp becomes a giant wasp, and a scorpion becomes a giant scorpion. Each creature obeys your verbal commands, and in combat, they act on your turn each round. The DM has the statistics for these creatures and resolves their actions and movement. A creature remains in its giant size for the duration, until it drops to 0 hit points, or until you use an action to dismiss the effect on it. The DM might allow you to choose different targets. For example, if you transform a bee, its giant version might have the same statistics as a giant wasp.",
        },
        {
          name: "Imperio Creatura",
          class: null,
          level: "4th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          restricted: true,
          description:
            "You attempt to beguile a beast that you can see within range. It must succeed on a Wisdom saving throw or be charmed by you for the duration. If you or creatures that are friendly to you are fighting it, it has advantage on the saving throw. While the beast is charmed, you have a telepathic link with it as long as the two of you are on the same plane of existence. You can use this telepathic link to issue commands to the creature while you are conscious (no action required), which it does its best to obey. You can specify a simple and general course of action, such as 'Attack that creature,' 'Run over there,' or 'Fetch that object.' If the creature completes the order and doesn't receive further direction from you, it defends and preserves itself to the best of its ability. You can use your action to take total and precise control of the target. Until the end of your next turn, the creature takes only the actions you choose, and doesn't do anything that you don't allow it to do. During this time, you can also cause the creature to use a reaction, but this requires you to use your own reaction as well. Each time the target takes damage, it makes a new Wisdom saving throw against the spell. If the saving throw succeeds, the spell ends.",
          higherLevels:
            "When you cast this spell with a 5th-level spell slot, the duration is concentration, up to 10 minutes. When you use a 6th-level spell slot, the duration is concentration, up to 1 hour. When you use a spell slot of 7th level or higher, the duration is concentration, up to 8 hours.",
        },
      ],
      "5th Level": [
        {
          name: "Insectum Maxima",
          class: "Transfiguration",
          level: "5th Level",
          castingTime: "Action",
          range: "300 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 6,
          restricted: true,
          description:
            "Swarming, biting locusts fill a 20-foot-radius sphere centered on a point you choose within range. The sphere spreads around corners. The sphere remains for the duration, and its area is lightly obscured. The sphere's area is difficult terrain. When the area appears, each creature in it must make a Constitution saving throw. A creature takes 4d10 piercing damage on a failed save, or half as much damage on a successful one. A creature must also make this saving throw when it enters the spell's area for the first time on a turn or ends its turn there.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d10 for each slot level above 5th.",
        },
      ],
      "6th Level": [
        {
          name: "Natura Incantatem",
          class: null,
          level: "6th Level",
          castingTime: "1 Minute",
          range: "Self",
          duration: "Instantaneous",
          year: 7,
          restricted: true,
          tags: ["R"],
          description:
            "You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in dungeons and towns. You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area: terrain and bodies of water, prevalent plants, minerals, animals, or peoples, powerful celestials, fey, fiends, elementals, or undead, influence from other planes of existence, Buildings. For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.",
        },
      ],
      "7th Level": [
        {
          name: "Draconiverto",
          class: null,
          level: "7th Level",
          castingTime: "Bonus Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restricted: true,
          description:
            "With a roar, you transform yourself, taking on draconic features. You gain the following benefits until the spell ends: Blindsight: You have blindsight with a range of 30 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature, unless the creature successfully hides from you. Breath Weapon: When you cast this spell, and as a bonus action on subsequent turns for the duration, you can exhale shimmering energy in a 60-foot cone. Each creature in that area must make a Dexterity saving throw, taking 6d8 force damage on a failed save, or half as much damage on a successful one. Wings: Incorporeal wings sprout from your back, giving you a flying speed of 60 feet.",
        },
      ],
      "8th Level": [
        {
          name: "Animato Maxima",
          class: null,
          level: "8th Level",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Concentration, up to 24 hours",
          year: 7,
          restricted: true,
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          restricted: true,
          description:
            "You create a minor illusion that appears within range. The illusion can be a sound, an image, or a smell that lasts for the duration. If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends. If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.",
        },
        {
          name: "Ignis Lunalis",
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          restricted: true,
          description:
            "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
          higherLevels:
            "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
        },
      ],
      "1st Level": [
        {
          name: "Formidulosus",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          restricted: true,
          description:
            "You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn't move into obviously dangerous ground, such as a fire or a pit. On a successful save, the target takes half as much damage and doesn't have to move away. A deafened creature automatically succeeds on the save.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Exspiravit",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          restricted: true,
          description:
            "You craft an illusion that takes root in the mind of a creature that you can see within range. The target must make an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other visible phenomenon of your choice that is no larger than a 10-foot cube and that is perceivable only to the target for the duration. This spell has no effect on undead or constructs. The phantasm includes sound, temperature, and other stimuli, also evident only to the creature. The target can use its action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends. While a target is affected by the spell, the target treats the phantasm as if it were real. The target rationalizes any illogical outcomes from interacting with the phantasm. For example, a target attempting to walk across a phantasmal bridge that spans a chasm falls once it steps onto the bridge. If the target survives the fall, it still believes that the bridge exists and comes up with some other explanation for its fall; it was pushed, it slipped, or a strong wind might have knocked it off. An affected target is so convinced of the phantasm's reality that it can even take damage from the illusion. A phantasm created to appear as a creature can attack the target. Similarly, a phantasm created to appear as fire, a pool of acid, or lava can burn the target. Each round on your turn, the phantasm can deal 1d6 psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm, provided that the illusion is of a creature or hazard that could logically deal damage, such as by attacking. The target perceives the damage as a type appropriate to the illusion.",
        },
      ],
      "3rd Level": [
        {
          name: "Fraudemo Maxima",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 Minutes",
          year: 5,
          restricted: true,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can't create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature. As long as you are within range of the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Similarly, you can cause the illusion to make different sounds at different times, even making it carry on a conversation, for example. Physical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your Concentration.",
        },
        {
          name: "Timor",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "Self 30 Foot Radius",
          duration: "Concentration, Up to 1 minute",
          year: 4,
          description:
            "You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a Wisdom saving throw or drop whatever it is holding and become frightened for the duration. While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn't have line of sight to you, the creature can make a Wisdom saving throw. On a successful save, the spell ends for that creature.",
        },
      ],
      "4th Level": [
        {
          name: "Relicuum",
          class: "Divinations",
          level: "4th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: 6,
          restricted: true,
          tags: ["R"],
          description:
            "Your magic can put you in contact with arcanum to help divine the future. You ask a single question concerning a specific goal, event, or activity to occur within 7 days. The GM offers a truthful reply. The reply might be a short phrase, a cryptic rhyme, or an omen. The spell doesn't take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion. If you cast the spell two or more times before finishing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The GM makes this roll in secret.",
        },
      ],
      "6th Level": [
        {
          name: "Oculus Malus",
          class: null,
          level: "6th Level",
          castingTime: "Action",
          range: "Self",
          duration: "Concentration, up to 1 minute",
          year: 7,
          restricted: true,
          description:
            "For the spell's duration, your eyes become an inky void imbued with dread power. One creature of your choice within 60 feet of you that you can see must succeed on a Wisdom saving throw or be affected by one of the following effects of your choice for the duration. On each of your turns until the spell ends, you can use your action to target another creature but can't target a creature again if it has succeeded on a saving throw against this casting of Oculus Malus. Asleep: The target falls unconscious. It wakes up if it takes any damage or if another creature uses its action to shake the sleeper awake. Panicked: The target is frightened of you. On each of its turns, the frightened creature must take the Dash action and move away from you by the safest and shortest available route, unless there is nowhere to move. If the target moves to a place at least 60 feet away from you where it can no longer see you, this effect ends. Sickened: The target has disadvantage on attack rolls and ability checks. At the end of each of its turns, it can make another Wisdom saving throw. If it succeeds, the effect ends.",
        },
      ],
      "9th Level": [
        {
          name: "Menus Eruptus",
          class: null,
          level: "9th Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You unleash a devastating assault on the minds of all creatures in a 30-foot radius sphere centered on a point you can see within range. Each creature in the area must make a Wisdom saving throw. A creature takes 8d8 psychic damage and is stunned for 1 minute on a failed save, or half as much damage and isn't stunned on a successful save. Creatures that fail their save by 10 or more have their minds temporarily shattered - they gain a long-term madness (as determined by the DM). The psychic eruption creates visible distortions in reality around the affected area, and the screams of mental anguish are audible up to 1 mile away. Any creature with telepathic abilities within 5 miles of the spell experiences painful feedback and must make a Constitution saving throw or be incapacitated for 1 round. This spell can only be cast during times of great emotional distress or in locations steeped in fear and suffering.",
        },
      ],
    },
  },
  Gravetouched: {
    description:
      "Dark necromantic magic that blurs the line between healing and harming, accessible to Necromantic Healers who practice forbidden arts.",
    color: "#4c1d95",
    levels: {
      Cantrips: [
        {
          name: "Umbrus Notatem",
          class: "Necromantic Healer",
          level: "Cantrip",
          castingTime: "Bonus Action",
          range: "30 Feet",
          duration: "1 Round",
          year: null,
          tags: ["Dark"],
          description:
            "You brand a willing creature with a mark of shadow. Until the end of its next turn, the target's movement speed increases by 5 feet, and its next attack deals an additional 2d4 necrotic damage. The effect ends early if the attack hits. If the target casts a spell that incorporates this additional damage, that spell gains the Dark tag for the purpose of effects, resistances, and synergies.",
        },
      ],
      "1st Level": [
        {
          name: "Ictus Vitalus",
          class: "Necromantic Healer",
          level: "1st Level",
          castingTime: "Action",
          range: "Self",
          duration: "1 Hour",
          year: null,
          description:
            "Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Destruunt",
          class: "Necromantic Healer",
          level: "2nd Level",
          castingTime:
            "1 reaction, when you see a creature cast a Healing spell",
          range: "60 Feet",
          duration: "Instantaneous",
          year: null,
          description:
            "You lash out with a thread of dark magic that severs the connection between body and life. When a creature within range attempts to cast a Healing spell, you can use your reaction to disrupt the flow of healing energy. The spell is halted, and no hit points or other effects are restored. The target still expends the spell slot and sorcery points used. If the healing spell is of 3rd level or higher, the caster must succeed on a Intelligence saving throw (DC equals 10 + the level of the spell) or the spell fails.",
        },
        {
          name: "Quo Flora",
          class: "Necromantic Healer",
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: null,
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
          class: "Necromantic Healer",
          level: "3rd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 hour",
          year: null,
          tags: ["Dark"],
          description:
            "You utter foul words, summoning an Inferius from the land of the dead. You choose the unoccupied spaces you can see within range where they appear. A summoned Inferi disappears when it drops to 0 hit points or when the spell ends. The Inferi are hostile to all creatures, including you. Roll initiative for the summoned Inferi which has its own turn(s). The Inferi pursue and attack the nearest non-Inferi to the best of their ability. As part of casting the spell, you can form a magical circle on the ground that is large enough to encompass your space. While the spell lasts, the summoned Inferi can't cross the circle or harm it, and they can't target anyone within it.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th or 7th level, you summon an Inferi Swarm. If you cast it using a spell slot of 8th or 9th level, you summon an Inferi Horde.",
        },
        {
          name: "Mortus Oratio",
          class: "Necromantic Healer",
          level: "3rd Level",
          castingTime: "Action",
          range: "10 Feet",
          duration: "10 Minutes",
          year: null,
          description:
            "You grant the semblance of life and intelligence to a corpse of your choice within range, allowing it to answer the questions you pose. The corpse must still have a mouth and can't be undead. The spell fails if the corpse was the target of this spell within the last 10 days. Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew. Answers are usually brief, cryptic, or repetitive, and the corpse is under no compulsion to offer a truthful answer if you are hostile to it or it recognizes you as an enemy. This spell doesn't return the creature's soul to its body, only its animating spirit. Thus, the corpse can't learn new information, doesn't comprehend anything that has happened since it died, and can't speculate about future events.",
        },
      ],
      "4th Level": [],
      "5th Level": [
        {
          name: "Morbus",
          class: "Necromantic Healer",
          level: "5th Level",
          castingTime: "Action",
          range: "Touch",
          duration: "7 Days",
          year: null,
          tags: ["Dark"],
          description:
            "Your touch inflicts disease. Make a melee spell attack against a creature within your reach. On a hit, the target is poisoned. At the end of each of the poisoned target's turns, the target must make a Constitution saving throw. If the target succeeds on three of these saves, it is no longer poisoned, and the spell ends. If the target fails three of these saves, the target is no longer poisoned, but choose one of the diseases below. The target is subjected to the chosen disease for the spell's duration. Since this spell induces a natural disease in its target, any effect that removes a disease or otherwise ameliorates a disease's effects apply to it. Blinding Sickness: Pain grips the creature's mind, and its eyes turn milky white. The creature has disadvantage on Wisdom checks and Wisdom saving throws and is blinded. Filth Fever: A raging fever sweeps through the creature's body. The creature has disadvantage on Strength checks, Strength saving throws, and attack rolls that use Strength. Flesh Rot: The creature's flesh decays. The creature has disadvantage on Charisma checks and vulnerability to all damage. Mindfire: The creature's mind becomes feverish. The creature has disadvantage on Intelligence checks and Intelligence saving throws, and the creature behaves as if under the effects of the confusion spell during combat. Seizure: The creature is overcome with shaking. The creature has disadvantage on Dexterity checks, Dexterity saving throws, and attack rolls that use Dexterity. Slimy Doom: The creature begins to bleed uncontrollably. The creature has disadvantage on Constitution checks and Constitution saving throws. In addition, whenever the creature takes damage, it is stunned until the end of its next turn.",
        },
      ],
      "6th Level": [],
      "7th Level": [],
      "8th Level": [
        {
          name: "Pati",
          class: "Necromantic Healer",
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Instantaneous",
          year: null,
          tags: ["Dark"],
          description:
            "You draw the moisture from every creature in a 30-foot cube centered on a point you choose within range. Each creature in that area must make a Constitution saving throw. Constructs and undead aren't affected, and plants and aquatic creatures make this saving throw with disadvantage. A creature takes 12d8 necrotic damage on a failed save, or half as much damage on a successful one. Nonmagical plants in the area that aren't creatures, such as trees and shrubs, wither and die instantly.",
        },
      ],
      "9th Level": [],
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "60 feet",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You point your wand at a creature and inflict a grievous wound. Make a ranged spell attack against a target within range. On a hit, the target takes 1d8 necrotic damage and begins bleeding. At the start of each of the target's turns, it takes 1 necrotic damage until it receives any amount of magical healing or succeeds on a DC 10 Constitution saving throw. Using this spell leaves a dark mark on your soul - each time you cast it, you gain 1 point of corruption that can only be removed through powerful atonement magic.",
          higherLevels:
            "This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
        },
      ],
      "1st Level": [
        {
          name: "Ferio Maxima",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Concentration, up to 1 minute",
          year: null,
          restricted: true,
          description:
            "You create a festering wound that resists healing. Make a ranged spell attack against a creature within range. On a hit, the target takes 3d8 necrotic damage and is cursed for the duration. While cursed, the target cannot regain hit points through any means, and at the start of each of its turns, it takes 1d4 necrotic damage. The curse can be ended early with remove curse or similar magic. Casting this spell requires you to sacrifice 1d4 of your own hit points, which cannot be healed for 24 hours.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d8 and the ongoing damage increases by 1 for each slot level above 1st.",
        },
        {
          name: "Tenebris",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Concentration, up to 10 minutes",
          year: null,
          restricted: true,
          description:
            "You create an area of supernatural darkness that devours light itself. Choose a point within range. Magical darkness spreads from that point to fill a 20-foot-radius sphere for the duration. The darkness spreads around corners and is impenetrable to darkvision. Even creatures with truesight cannot see through this darkness. Light created by spells of 2nd level or lower is suppressed in the area. Any creature that starts its turn in the darkness must make a Wisdom saving throw or become frightened until the start of its next turn. Casting this spell drains your life force - you age 1 month each time you cast it.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the radius increases by 10 feet and it suppresses light spells of one higher level for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Sagittario Virius",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "150 feet",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You conjure an arrow of pure venom and malice. Make a ranged spell attack against a target within range. On a hit, the target takes 2d8 piercing damage and 3d6 poison damage. The target must make a Constitution saving throw. On a failed save, the target is poisoned for 1 hour and takes 1d6 poison damage at the start of each of its turns. On a successful save, the target is poisoned until the end of its next turn. If the target dies from this spell's damage within 24 hours, it rises as a zombie under your control after 1d4 hours. Creating undeath in this manner corrupts your soul - you permanently lose 1 point from your highest ability score.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.",
        },
      ],
      "3rd Level": [
        {
          name: "Gehennus Conjurus",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          year: null,
          restricted: true,
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
          class: null,
          level: "5th Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You cause a creature to spontaneously combust from within. Choose a creature you can see within range. The target must make a Constitution saving throw. On a failed save, the creature takes 8d8 fire damage and catches fire, taking 2d8 fire damage at the start of each of its turns until someone uses an action to douse the flames or the creature is immersed in water. On a successful save, the creature takes half the initial damage and doesn't catch fire. If this spell reduces a creature to 0 hit points, it is completely incinerated, leaving only ash - it cannot be resurrected by any means short of true resurrection or wish. The dark magic of spontaneous combustion permanently reduces your maximum hit points by 1d4 each time you cast it.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the initial damage increases by 1d8 for each slot level above 5th.",
        },
      ],
      "6th Level": [
        {
          name: "Inmoritatem",
          class: null,
          level: "6th Level",
          castingTime: "8 hours",
          range: "Touch",
          duration: "Until dispelled",
          year: null,
          restricted: true,
          description:
            "You attempt to cheat death itself through dark magic. This ritual can only be performed on a creature that has died within the last hour. The target returns to life with all its hit points, but it becomes undead (retaining its original type as well). The creature gains resistance to necrotic damage and immunity to being charmed or frightened, but it gains vulnerability to radiant damage and is harmed by holy water as if it were a true undead. The creature does not age and cannot die of old age, but if it is reduced to 0 hit points, it crumbles to dust and cannot be resurrected by any means. Performing this ritual requires the sacrifice of a sentient creature and permanently reduces the caster's Constitution score by 2. The caster also gains the attention of death itself - they are forever marked and may face supernatural consequences.",
        },
        {
          name: "Undanem",
          class: null,
          level: "6th Level",
          castingTime: "Action",
          range: "1 mile",
          duration: "Concentration, up to 10 minutes",
          year: null,
          restricted: true,
          description:
            "You summon a devastating flood or tidal wave. Choose a point within range. A wall of water 300 feet long, 300 feet high, and 50 feet thick rises from the ground at that point. When the wall appears, each creature within its area must make a Strength saving throw. On a failed save, a creature takes 6d10 bludgeoning damage and is swept away by the water. On a successful save, the creature takes half damage and manages to stay in place. The wall moves 100 feet away from you each round, carrying any creatures caught in it. The magical flood destroys most structures in its path and permanently alters the landscape. Using this spell to cause mass destruction marks you as a terrorist in the eyes of magical law enforcement and may result in immediate Auror intervention.",
          higherLevels:
            "When you cast this spell using a spell slot of 7th level or higher, the wall's dimensions increase by 100 feet in each direction for each slot level above 6th.",
        },
      ],
      "8th Level": [
        {
          name: "Insanio",
          class: null,
          level: "8th Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Until dispelled",
          year: null,
          restricted: true,
          description:
            "You shatter the mind of a creature, driving it into permanent madness. Choose a creature within range. The target must make a Wisdom saving throw. On a failed save, the creature's Intelligence and Charisma scores become 1, and it gains a permanent madness (determined by the DM). The creature cannot cast spells, speak coherently, or use any Intelligence- or Charisma-based skills. On a successful save, the creature takes 8d8 psychic damage and is stunned until the end of its next turn. This curse can only be removed by wish, divine intervention, or similar magic of the highest order. The psychic backlash of destroying a mind permanently reduces your own Wisdom score by 1, and you must make a DC 20 Wisdom saving throw or gain a short-term madness yourself.",
          higherLevels:
            "When you cast this spell using a 9th level slot, you can target up to 3 creatures within range.",
        },
        {
          name: "Tenebris Maxima",
          class: null,
          level: "8th Level",
          castingTime: "Action",
          range: "1 mile",
          duration: "24 hours",
          year: null,
          restricted: true,
          description:
            "You plunge a vast area into supernatural darkness that devours all light and hope. The spell creates a 1-mile-radius sphere of absolute darkness centered on a point you can see. Within this area, no light of any kind can exist - not magical, not natural, not even divine light can penetrate this darkness. All creatures within the area are blinded and frightened for the duration. The darkness is so complete that it muffles sound, making verbal communication nearly impossible. Plants within the area begin to wither and die, and the very land becomes cursed. Animals flee the area in terror, and even undead creatures are unnerved by the absolute void. Casting this spell ages you 10 years instantly and attracts the attention of powerful entities from the Shadowfell. The area remains tainted with dark magic for years after the spell ends.",
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
          class: null,
          level: "Cantrip",
          castingTime: "1 minute",
          range: "Touch",
          duration: "24 hours",
          year: null,
          restricted: true,
          description:
            "You touch an object and imbue it with ancient utility magic. The object gains one of the following properties for the duration: it becomes unbreakable (immune to all damage), it provides perfect insulation against heat and cold, it becomes weightless while maintaining its mass, or it glows with steady light equivalent to a torch. This ancient magic is unpredictable - each time you cast this spell, roll a d20. On a 1, the effect is permanent but the object becomes cursed in some way (DM's discretion). The spell draws on primal magical forces that modern wizards have largely forgotten.",
        },
      ],
      "1st Level": [
        {
          name: "Facias Infirmitatem",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "60 feet",
          duration: "Concentration, up to 1 hour",
          year: null,
          restricted: true,
          description:
            "You speak words in the Old Tongue that sap vitality from your target. Choose a creature within range. The target must make a Constitution saving throw. On a failed save, the target's Strength and Constitution scores are each reduced by 1d4 for the duration. If either score is reduced to 0, the target falls unconscious but stabilizes. This ancient curse bypasses most modern magical defenses - creatures with magic resistance do not have advantage on this saving throw. The spell affects the target's life force directly, causing visible signs of rapid aging and frailty that restore when the spell ends.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Exagitatus",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "90 feet",
          duration: "Concentration, up to 10 minutes",
          year: null,
          restricted: true,
          description:
            "You invoke ancient words of discord that disturb the natural order around a target location. Choose a point within range. For the duration, the area within a 20-foot radius of that point becomes magically agitated. The ground trembles slightly, winds swirl unpredictably, temperatures fluctuate, and reality itself seems unsettled. Any creature that starts its turn in the area must make a Wisdom saving throw. On a failed save, the creature becomes confused (as the confusion spell) until the start of its next turn. Additionally, all concentration saves within the area are made with disadvantage, and spells cast within the area have a 25% chance of producing a minor magical surge (roll on a wild magic table or similar effect at DM's discretion).",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the radius increases by 10 feet for each slot level above 2nd.",
        },
        {
          name: "Impulso",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "Self",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You channel primal force through your body and release it in a devastating push. Each creature within a 30-foot cone must make a Strength saving throw. On a failed save, a creature takes 3d8 force damage and is pushed 20 feet away from you and knocked prone. On a successful save, the creature takes half damage and is pushed 10 feet but remains standing. Objects in the area that aren't worn or carried are also pushed 20 feet away. This ancient magic is more raw and uncontrolled than modern spells - you must also make a Constitution saving throw against your own spell save DC. On a failure, you take 1d8 force damage as the ancient energies rebound through your body.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
        },
      ],
      "4th Level": [
        {
          name: "Maledicto",
          class: null,
          level: "4th Level",
          castingTime: "1 minute",
          range: "Touch",
          duration: "Until removed",
          year: null,
          restricted: true,
          description:
            "You place an ancient curse upon a creature you touch. The target must make a Charisma saving throw. On a failed save, choose one of the following curses: Curse of Failure - The target has disadvantage on ability checks and saving throws; Curse of Frailty - The target's hit point maximum is reduced by half; Curse of Misfortune - Once per day, the DM can force the target to reroll any successful attack roll, ability check, or saving throw; Curse of Isolation - The target cannot benefit from the Help action, bardic inspiration, or similar assistance from others. The curse lasts until removed by remove curse cast using a spell slot of 5th level or higher, greater restoration, wish, or by fulfilling a specific condition related to the curse (DM's discretion). Ancient curses are notoriously difficult to break and may require special components or rituals.",
        },
        {
          name: "Sagittario Maxima",
          class: null,
          level: "4th Level",
          castingTime: "Action",
          range: "500 feet",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You conjure a massive ethereal arrow of pure magical force, based on techniques from the earliest ages of wizardry. Make a ranged spell attack against a target within range. This attack ignores cover and has advantage against targets wearing armor. On a hit, the target takes 6d10 force damage and must make a Strength saving throw. On a failed save, the target is pushed 30 feet directly away from you and knocked prone. If the target strikes a solid object or another creature during this movement, both take an additional 1d6 bludgeoning damage per 10 feet traveled. The arrow can pass through multiple targets - if your attack roll exceeds the AC of creatures in a line between you and your primary target by 5 or more, those creatures also take half damage but are not pushed.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th.",
        },
      ],
      "6th Level": [
        {
          name: "Sanitatem",
          class: null,
          level: "6th Level",
          castingTime: "10 minutes",
          range: "Touch",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You invoke the most ancient words of healing and restoration, drawing upon magical techniques from the dawn of civilization. Touch a creature that has at least 1 hit point. The target is completely healed of all damage, diseases, poisons, curses, and negative conditions. Lost limbs regrow, missing organs regenerate, and even mental trauma is soothed. The target's ability scores return to their normal maximum if they have been reduced. Additionally, the target gains immunity to disease and poison for 24 hours and advantage on death saving throws for one week. However, this ancient magic draws heavily from the recipient's life force - the target ages 1d4 years, and the caster ages 1 year. This spell cannot restore life to the dead, but it can heal any living creature regardless of how severe their injuries.",
        },
      ],
      "7th Level": [
        {
          name: "Portentia Spiculum",
          class: null,
          level: "7th Level",
          castingTime: "Action",
          range: "1 mile",
          duration: "Instantaneous",
          year: null,
          restricted: true,
          description:
            "You forge a dart of crystallized fate and hurl it across vast distances, carrying with it the weight of prophecy and doom. Choose a target you are aware of within range (you do not need to see them). Make a ranged spell attack with advantage - this attack cannot miss unless the target is on another plane of existence or protected by divine intervention. On a hit, the target takes 8d8 force damage and is marked by fate. For the next 24 hours, you have a mystical connection to the target and always know their general direction and distance from you. Additionally, the target becomes the subject of an omen or prophecy - once within the next seven days, you can declare that a d20 roll made by or against the target is replaced with a result of your choice (1-20). The ancient magic of this spell ensures that fate itself conspires to make your prophecy come true. Using this spell attracts the attention of cosmic forces and may have far-reaching consequences beyond the immediate effect.",
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
          name: "Ignis Lunalis",
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Instantaneous",
          year: 3,
          restricted: true,
          description:
            "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.",
          higherLevels:
            "The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
        },
        {
          name: "Lux",
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "Touch",
          duration: "Concentration, up to 1 minute",
          year: null,
          restricted: true,
          description:
            "You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.",
        },
      ],
      "1st Level": [
        {
          name: "Lux Maxima",
          class: null,
          level: "1st Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "1 Round",
          year: 3,
          restricted: true,
          description:
            "A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 2d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.",
        },
      ],
      "2nd Level": [
        {
          name: "Trabem",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 1 minute",
          year: 4,
          restricted: true,
          description:
            "A silvery beam of pale light shines down in a 5-foot radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in radiant light that causes searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one. On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.",
        },
      ],
      "3rd Level": [
        {
          name: "Stellaro",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "Self (15 Foot Radius)",
          duration: "Concentration, up to 10 minutes",
          year: 5,
          restricted: true,
          description:
            "You call forth Constellations to protect you. Tiny Stars flit around you to a distance of 15 feet for the duration. When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.",
        },
      ],
      "5th Level": [
        {
          name: "Lunativia",
          class: null,
          level: "5th Level",
          castingTime: "Action",
          range: "Self (60-foot line)",
          duration: "Concentration and Dedication, up to 1 minute",
          year: 6,
          restricted: true,
          description:
            "A beam of brilliant light flashes out from your hand in a 60-foot-line. Each creature in the line must make a Constitution saving throw. On a failed save, a creature takes 6d8 radiant damage and is blinded until your next turn. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw. You can create a new line of radiance when you maintain dedication on subsequent turns until the spell ends. For the duration, a mote of brilliant radiance shines in your hand. It sheds bright light in a 30-foot radius and dim light for an additional 30 feet. The light is moonlight.",
        },
      ],
      "8th Level": [
        {
          name: "Solativia",
          class: null,
          level: "8th Level",
          castingTime: "Action",
          range: "150 Feet",
          duration: "Instantaneous",
          year: 7,
          restricted: true,
          description:
            "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw. On a failed save, a creature takes 20d6 radiant damage and is blinded for 1 minute. On a successful save, it takes half as much damage and isn't blinded by this spell. Undead and oozes have disadvantage on this saving throw. A creature blinded by this spell makes another Constitution saving throw at the end of each of its turns. On a successful save, it is no longer blinded. This spell dispels any magical darkness in its area.",
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
          class: null,
          level: "1st Level (ritual)",
          castingTime: "Action",
          range: "30 Feet",
          duration: "Instantaneous",
          year: 2,
          restricted: true,
          tags: ["R"],
          description:
            "An advanced professional version of the cutting charm taught for precision work in magical careers. An object is precisely torn or cut, as if a magical blade extended from the tip of your wand. This professional technique allows for surgical precision and can be used on both objects and creatures safely. Choose a target you can see within range that fits within a 5-foot cube. If the target is a creature, it must make a Dexterity saving throw. It takes 4d4 slashing damage on a failed save or half as much damage on a successful one. Professional applications include: precise potion ingredient preparation, magical surgery assistance, crafting fine magical instruments, and emergency rescue operations. This version can also sever magical bonds and cut through enchanted materials with proper training.",
          higherLevels:
            "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature or the cube's size increases by 5 feet for each slot level above 1st. Additionally, the precision increases, allowing you to make cuts with millimeter accuracy.",
        },
      ],
      "2nd Level": [
        {
          name: "Immobulus",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "Self (15 Feet Cube)",
          duration: "1 Round",
          year: 2,
          restricted: true,
          description:
            "A professional-grade freezing charm used in law enforcement, emergency response, and magical research. You send a pulse through the area in front of you, freezing everything in space and time. Roll 7d10; the total is how many hit points of creatures this spell can affect. All creatures and objects in a 15-foot cube originating from you are affected in the order of nearest to farthest. Each creature affected by this spell is paralyzed until the spell ends. While paralyzed, the creature is fixed in the space they occupied when the spell was cast, which may leave it suspended in air. Professional applications include: crime scene preservation, dangerous magical creature containment, emergency medical stabilization, and precision magical research. Unlike the standard version, this professional technique can selectively exclude allies and maintain fine motor control in designated subjects.",
          higherLevels:
            "When you cast this spell using a spell slot of 3rd level or higher, roll an additional 2d10 for each slot level above 2nd. When you cast this spell using a spell slot of 4th level or higher, the duration increases by 1 round for each two slot levels above 2nd. At 5th level and above, you can choose to affect only specific types of creatures or objects.",
        },
      ],
      "3rd Level": [
        {
          name: "Deprimo",
          class: null,
          level: "3rd Level (ritual)",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Instantaneous",
          year: 5,
          restricted: true,
          tags: ["R"],
          description:
            "A professional-grade pressure charm used in construction, demolition, and geological survey work. You place immense downward pressure on a target you can see within range. If the target is a creature, it must make a Strength saving throw. On a failed save, a creature takes 5d8 bludgeoning damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone. If the target is a flat surface, this will either create a crater or collapse the surface with precise control. Professional applications include: controlled demolition, mining operations, foundation preparation, geological surveying, and emergency excavation. This advanced version allows for graduated pressure application and can create precise architectural features like foundations, channels, or defensive earthworks.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the damage is increased by 1d8 for each slot level above 3rd. Additionally, you gain finer control over the pressure distribution, allowing you to create complex shapes and graduated depth effects.",
        },
      ],
      "4th Level": [
        {
          name: "Confundo",
          class: null,
          level: "4th Level (ritual)",
          castingTime: "1 action",
          range: "90 feet",
          duration: "Concentration, up to 1 minute",
          year: 6,
          restricted: true,
          tags: ["R"],
          description:
            "The professional-grade Confundus Charm used by trained interrogators, therapists, and magical law enforcement. This advanced version leaves targets confused, forgetful, and impressionable while maintaining ethical safeguards against abuse. If the target is an object you can see within range that operates or functions on its own, it will operate erratically, malfunction, or completely shut down with precision control. If the target is a creature you can see within range, it must succeed on a Wisdom saving throw when you cast this spell or be affected by it. Professional applications include: therapeutic memory work, criminal investigation, magical object diagnosis, emergency crowd control, and psychiatric treatment. This version includes built-in ethical constraints that prevent permanent harm or coercion for illegal purposes. Trained professionals can use this charm to help patients recover suppressed memories or guide them through therapeutic processes.",
          higherLevels:
            "When you cast this spell using a spell slot of 5th level or higher, you can target one additional target for each slot level above 4th. At higher levels, you can also implant simple, beneficial suggestions or help organize confused thoughts rather than just causing confusion.",
        },
      ],
      "5th Level": [
        {
          name: "Obliviate",
          class: null,
          level: "5th Level",
          castingTime: "1 action",
          range: "30 feet",
          duration: "Concentration, up to 1 minute",
          year: 5,
          restricted: true,
          description:
            "The professional-grade memory charm used by trained Obliviators and licensed magical therapists. This advanced version allows for precise, ethical memory modification with built-in safeguards and recovery protocols. You attempt to reshape another being's memories with surgical precision. One being you can see within range must make a Wisdom saving throw. If you are fighting the creature, it has advantage on the saving throw. On a failed save, the target becomes charmed by you for the duration. Professional applications include: trauma therapy, witness protection, accidental magic exposure cleanup, and voluntary memory modification for PTSD treatment. Unlike amateur versions, this professional technique includes: detailed documentation requirements, ethical review protocols, memory backup creation, and gradual adjustment processes. The modified memories are marked with magical signatures for accountability and can be restored by qualified professionals.",
          higherLevels:
            "If you cast this spell using a spell slot of 6th level or higher, you can eliminate the target's memories of an event that took place up to 7 days ago (6th level), 30 days ago (7th level), 1 year ago (8th level), or any time in the creature's past (9th level). At higher levels, you can also implant replacement memories that are internally consistent and helpful for the subject's wellbeing.",
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
          class: null,
          level: "Cantrip",
          castingTime: "Action",
          range: "30 feet",
          duration: "1 Minute",
          year: 1,
          description:
            "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it. The hand can't attack, activate magical items, or carry more than 10 pounds. This foundational trickery spell allows for subtle misdirection, sleight of hand at a distance, and the creation of seemingly impossible effects for entertainment or practical application.",
        },
      ],
      "1st Level": [],
      "2nd Level": [
        {
          name: "Tranquillitatem",
          class: null,
          level: "2nd Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 3,

          description:
            "You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects: You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime. Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise. This spell is essential for tricksters who need to defuse tense situations, calm angry crowds, or create opportunities for misdirection by manipulating emotional states.",
        },
      ],
      "3rd Level": [
        {
          name: "Fictus",
          class: null,
          level: "3rd Level",
          castingTime: "Action",
          range: "120 Feet",
          duration: "Concentration, up to 10 minutes",
          year: 4,
          description:
            "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 20-foot cube. The image appears at a spot that you can see within range and lasts for the duration. It seems completely real, including sounds, smells, and temperature appropriate to the thing depicted. You can't create sufficient heat or cold to cause damage, a sound loud enough to deal thunder damage or deafen a creature, or a smell that might sicken a creature. As long as you are within range of the illusion, you can use your action to cause the image to move to any other spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Similarly, you can cause the illusion to make different sounds at different times, even making it carry on a conversation, for example. Physical interaction with the image reveals it to be an illusion, because things can pass through it. A creature that uses its action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image, and its other sensory qualities become faint to the creature.",
          higherLevels:
            "When you cast this spell using a spell slot of 6th level or higher, the spell lasts until dispelled, without requiring your concentration. In this form it is sometimes considered a different spell, known as Permanent Image.",
        },
        {
          name: "Roboratum",
          class: null,
          level: "3rd Level",
          castingTime: "1 Minute",
          range: "60 Feet",
          duration: "1 Hour",
          year: 5,
          description:
            "Choose up to five creatures within range that can hear you. For the duration, each affected creature gains 5 temporary hit points and has advantage on Wisdom saving throws. If an affected creature is hit by an attack, it has advantage on the next attack roll it makes. Once an affected creature loses the temporary hit points granted by this spell, the spell ends for that creature. Skilled tricksters use this spell to bolster their allies before attempting elaborate schemes, providing both physical protection and mental fortitude to resist detection or maintain concentration during complex illusions.",
          higherLevels:
            "When you cast this spell using a spell slot of 4th level or higher, the temporary hit points increase by 5 for each slot level above 3rd.",
        },
      ],
      "4th Level": [],
      "5th Level": [],
      "6th Level": [
        {
          name: "Incarcerebra",
          class: null,
          level: "6th Level",
          castingTime: "Action",
          range: "60 Feet",
          duration: "Concentration, up to 1 minute",
          year: 7,
          description:
            "You attempt to bind a creature within an illusory cell that only it perceives. One creature you can see within range must make an Intelligence saving throw. The target succeeds automatically if it is immune to being charmed. On a successful save, the target takes 5d10 psychic damage, and the spell ends. On a failed save, the target takes 5d10 psychic damage, and you make the area immediately around the target's space appear dangerous to it in some way. You might cause the target to perceive itself as being surrounded by fire, floating razors, or hideous maws filled with dripping teeth. Whatever form the illusion takes, the target can't see or hear anything beyond it and is restrained for the spell's duration. If the target is moved out of the illusion, makes a melee attack through it, or reaches any part of its body through it, the target takes 10d10 psychic damage, and the spell ends. This represents the pinnacle of trickery magic - creating a prison that exists only in the target's mind but is completely real to them.",
        },
      ],
      "7th Level": [],
      "8th Level": [
        {
          name: "Dubium/Fiducium",
          class: null,
          level: "8th Level",
          castingTime: "1 Hour",
          range: "60 Feet",
          duration: "10 days",
          year: 7,
          description:
            "This spell attracts or repels creatures of your choice. You target something within range, either a Huge or smaller object or creature or an area that is no larger than a 200-foot cube. Then specify an intelligent creature. You invest the target with an aura that either attracts or repels the specified intelligent creatures for the duration. Choose antipathy or sympathy as the aura's effect. Dubium: The enchantment causes creatures of the kind you designated to feel an intense urge to leave the area and avoid the target. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or become frightened. The creature remains frightened while it can see the target or is within 60 feet of it. While frightened by the target, the creature must use its movement to move to the nearest safe spot from which it can't see the target. If the creature moves more than 60 feet from the target and can't see it, the creature is no longer frightened, but the creature becomes frightened again if it regains sight of the target or moves within 60 feet of it. Fiducium: The enchantment causes the specified creatures to feel an intense urge to approach the target while within 60 feet of it or able to see it. When such a creature can see the target or comes within 60 feet of it, the creature must succeed on a Wisdom saving throw or use its movement on each of its turns to enter the area or move within reach of the target. This ultimate trickery spell allows master illusionists to manipulate behavior on a massive scale, creating long-term deceptions and controlling access to areas or objects.",
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

  "Umbrus Notatem": SUBJECT_TO_MODIFIER_MAP.jhc,
  "Ictus Vitalus": SUBJECT_TO_MODIFIER_MAP.healing,
  Destruunt: SUBJECT_TO_MODIFIER_MAP.healing,
  "Quo Flora": SUBJECT_TO_MODIFIER_MAP.healing,
  "Mortus Oratio": SUBJECT_TO_MODIFIER_MAP.charms,
  Morbus: SUBJECT_TO_MODIFIER_MAP.healing,
  Pati: SUBJECT_TO_MODIFIER_MAP.healing,
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
