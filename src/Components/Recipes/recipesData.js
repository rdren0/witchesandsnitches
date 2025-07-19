export const recipes = {
  "Blazing Braised Fire-Breathing Chicken": {
    id: 1,
    name: "Blazing Braised Fire-Breathing Chicken",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "This tender poultry is braised in stock, oyster sauce and a few pinches of chili powder. Once consumed, you perspire at a rapid rate for the duration.",
    qualities: {
      flawed:
        "Whenever you move, the space you previously occupied is covered in a pool of sweat. The pool has the same size as you, and persists for the duration of the recipe. Any creature that enters a pool of sweat must make a dexterity saving throw. On a failed save, the creature falls prone. On a success, they can freely move through any of your sweat pools until the start of their next turn. The recipe ends early if you drink at least 1 pint of water or milk. If the recipe persists for its full duration, you gain one level of exhaustion as a result of dehydration.",
      regular:
        "Pools of sweat created by this recipe count as difficult terrain.",
      exceptional:
        "You no longer become exhausted as a result of the recipe lasting its full duration.",
      superior:
        "For the duration, you cannot be grappled or restrained by non-magical means, and your movement is unaffected by difficult terrain.",
    },
  },
  "Bull's Eye Soup": {
    id: 2,
    name: "Bull's Eye Soup",
    eatingTime: "1 bonus action",
    duration: "1 round",
    description:
      "This savory bowl includes a bull's eye ball chopped, battered and placed in a salty broth.",
    qualities: {
      flawed:
        "Once consumed, you can add the chef's spellcasting ability modifier to the next attack roll you make before the end of your next turn.",
      regular:
        "The attack bonus increases to 1 + the chef's spellcasting ability modifier.",
      exceptional:
        "The attack bonus increases to 2 + the chef's spellcasting ability modifier.",
      superior:
        "The attack bonus increases to 3 + the chef's spellcasting ability modifier.",
    },
  },
  "Broiled Scorpion-on-a-Stick": {
    id: 3,
    name: "Broiled Scorpion-on-a-Stick",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This crusty arachnid is skewered and sprinkled with sweet and nutty flavours to intensify the bug's fatty inside.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all dexterity checks you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "You add the chef's spellcasting ability modifier to any dexterity saving throws you make for the duration.",
      exceptional:
        "You gain a climb speed equal to your walking speed for the duration.",
      superior:
        "Until the recipe ends, you do not take damage from falling unless you fall further than 10 x the chef's spellcasting ability modifier in feet.",
    },
  },
  "Chocolate Frog": {
    id: 4,
    name: "Chocolate Frog",
    eatingTime: "1 bonus action",
    duration: "Instantaneous",
    description:
      "This sweet and sticky treat is made with copious amounts of sugar and natural cocoa. It jumps, too! Chocolate is a notoriously effective defense against dementors.",
    qualities: {
      flawed:
        "Once consumed, you may immediately re-roll the saving throw against one effect that is causing you to be charmed or frightened, adding the chef's spellcasting ability modifier to the total.",
      regular:
        "The range of conditions this recipe can counteract now includes poisoned.",
      exceptional:
        "The range of conditions this recipe can counteract now includes stunned.",
      superior:
        "The range of conditions this recipe can counteract now includes blinded and deafened.",
    },
  },
  "Creamy Milk Risotto": {
    id: 5,
    name: "Creamy Milk Risotto",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "This deliciously smooth recipe is full of fresh herbs and served in a leaf of lettuce.",
    qualities: {
      flawed:
        "Once consumed, for the duration, you gain a bonus to all constitution saving throws. The bonus equals the chef's spellcasting ability modifier.",
      regular: "The duration of the recipe increases to 10 minutes.",
      exceptional: "The duration of the recipe increases to 1 hour.",
      superior: "The duration of the recipe increases to 8 hours.",
    },
  },
  "Croque Madame": {
    id: 6,
    name: "Croque Madame",
    eatingTime: "1 bonus action",
    duration: "8 hours",
    description:
      "This sandwich is the perfect breakfast treat, combining several morning flavors in one dish.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to AC equal to the chef's spellcasting ability modifier for the duration. This bonus cannot increase your AC above 16.",
      regular: "The maximum AC obtainable from the bonus increases to 17.",
      exceptional: "The maximum AC obtainable from the bonus increases to 18.",
      superior: "The maximum AC obtainable from the bonus increases to 19.",
    },
  },
  "Devilled Sausage": {
    id: 7,
    name: "Devilled Sausage",
    eatingTime: "1 bonus action",
    duration: "Instantaneous",
    description:
      "This recipe consists of a delicately fried sausage chopped up and drizzled in garlic, onion and sliced apple.",
    qualities: {
      flawed:
        "Upon consuming this recipe, you can immediately attempt to absorb its magic and regain an expended spell slot. To do so, you must succeed on Constitution Check (DC = 10 + the level of the spell slot). The spell slot you wish to regain can be no higher than first level, unless it is a spell slot gained through the Pact Magic Feature.",
      regular:
        "The spell slot you attempt to regain can be up to second level.",
      exceptional:
        "The spell slot you attempt to regain can be up to third level.",
      superior:
        "The spell slot you attempt to regain can be up to fourth level.",
    },
  },
  "Deluxe Pepper Imp": {
    id: 8,
    name: "Deluxe Pepper Imp",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "This spicy ball of chocolate contains cayenne pepper and a sprinkle of popping candy.",
    qualities: {
      flawed:
        "Once consumed, your body begins to radiate intense heat in a 5-foot radius around you. For the duration, any creature that ends its turn within the area must make a constitution saving throw, taking 1d4 + the chef's spellcasting ability modifier fire damage on a failed save, or half as much on a successful one.",
      regular:
        "The damage increases to 2d4 + the chef's spellcasting ability modifier.",
      exceptional:
        "The damage increases to 3d4 + the chef's spellcasting ability modifier.",
      superior:
        "The damage increases to 4d4 + the chef's spellcasting ability modifier.",
    },
  },
  "Diricawl Jerky": {
    id: 9,
    name: "Diricawl Jerky",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This lean, dry strip of meat is roasted and smoked, preserving the natural ability of the Diricawl to apparate.",
    qualities: {
      flawed:
        "Once consumed, you gain the ability to transpose for the duration. As an action, you choose a creature within 15 feet and transpose with them. If the creature is willing, you both teleport, swapping places. The creature you choose must be the chef or another creature under the effects of a Diricawl Jerky recipe created by the chef.",
      regular: "The range you can transpose increases to 30 feet.",
      exceptional: "The range you can transpose increases to 45 feet.",
      superior: "The range you can transpose increases to 60 feet.",
    },
  },
  "Edible Dark Marks": {
    id: 10,
    name: "Edible Dark Marks",
    eatingTime: "1 bonus action",
    duration: "1 round",
    description: "As foul a sweet as their namesakes.",
    qualities: {
      flawed:
        "Once consumed, your stomach begins to fill with gas. Until the end of your next turn, you can use your action to propel a violent belch in a 15-foot cone originating from you and end the recipe. Each creature inside the cone must succeed on a constitution saving throw or take 1d8 + the chef's spellcasting ability modifier poison damage. If you fail to perform this action before the duration of the recipe ends, you must take this action on your next turn, expelling the belch in a random direction determined by the DM.",
      regular:
        "The poison damage increases to 2d8 + the chef's spellcasting ability modifier.",
      exceptional:
        "The poison damage increases to 3d8 + the chef's spellcasting ability modifier.",
      superior:
        "The poison damage increases to 4d8 + the chef's spellcasting ability modifier.",
    },
  },
  "Greenhouse Slider": {
    id: 11,
    name: "Greenhouse Slider",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This snack-sized burger is filled with vegetable protein, parsley, sage, rosemary and thyme.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all constitution checks you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "You add the chef's spellcasting ability modifier to any constitution saving throws you make for the duration.",
      exceptional:
        "Your hit point maximum cannot be reduced for the duration. Any pre-existing reduction is suppressed until the recipe ends.",
      superior:
        "You are immune to exhaustion for the duration. If your exhaustion level is greater than 0 when you consume this recipe, it is reduced to 0 until the recipe ends.",
    },
  },
  "King Sized Acid Pop": {
    id: 12,
    name: "King Sized Acid Pop",
    eatingTime: "1 bonus action",
    duration: "1 round",
    description: "This recipe appears as a regular hard candy.",
    qualities: {
      flawed:
        "Once consumed, the contents of your stomach begin to boil and rise. Until the end of your next turn, you can use your action to launch projectile vomit towards a creature within 30 feet of you and end the recipe. Make a ranged recipe attack against the target. On a hit, the target takes 1d6 bludgeoning damage. Hit or miss, the vomit then splatters in a 5-foot radius around the target. The target and each creature within this radius must succeed on a Dexterity saving throw or take 1d6 + the chef's spellcasting ability modifier acid damage. If you fail to perform this action before the duration of the recipe ends, you must take this action on your next turn, targeting yourself. If this occurs, you automatically hit with the attack roll and automatically fail the saving throw.",
      regular:
        "The acid damage increases to 2d6 + the chef's spellcasting ability modifier.",
      exceptional:
        "The acid damage increases to 3d6 + the chef's spellcasting ability modifier.",
      superior:
        "The acid damage increases to 4d6 + the chef's spellcasting ability modifier.",
    },
  },
  "Lasagne to Induce Euphoria": {
    id: 13,
    name: "Lasagne to Induce Euphoria",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This small slice of lasagne is filled with ricotta, chopped onion and ground beef.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all charisma checks you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "You add the chef's spellcasting ability modifier to any charisma saving throws you make for the duration.",
      exceptional:
        "You come under the effects of a disguise self spell for the duration.",
      superior:
        "You come under the effects of a tongues spell for the duration.",
    },
  },
  "Longbottom Stew": {
    id: 14,
    name: "Longbottom Stew",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "This savory stew was created in Hogsmeade as a tribute to a heroic herbalist who stood up against the forces of evil. It is presented as a striking rainbow of assorted vegetables in a stew.",
    qualities: {
      flawed:
        "Once consumed, you gain resistance to one damage type of your choice for the duration.",
      regular:
        "You gain resistance to two damage types of your choice for the duration.",
      exceptional:
        "You gain resistance to three damage types of your choice for the duration.",
      superior:
        "You can choose to gain immunity to one damage type, instead of gaining any resistances.",
    },
  },
  "Pensieve Pastry": {
    id: 15,
    name: "Pensieve Pastry",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This pastry is made with lemon pie crust, whipped cream and forest berries, arranged to look like a pensieve basin.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all intelligence checks you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "You add the chef's spellcasting ability modifier to any intelligence saving throws you make for the duration.",
      exceptional:
        "For the duration, you can use your action to discern the weakness of a creature you can see. Choose one condition or damage type. If the target has resistance, immunity or vulnerability to the chosen condition or damage type, the DM shares this information with you.",
      superior:
        "You gain proficiency in one skill or tool of your choice for the duration. Alternatively, you can learn to speak, read and write one language of your choice until the recipe ends.",
    },
  },
  "Salazar Slytherfin": {
    id: 16,
    name: "Salazar Slytherfin",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "Freshwater eel, deboned and marinated in a sauce made from garlic, ginger, and vinegar.",
    qualities: {
      flawed:
        "Once consumed, your speed increases by 10 feet for the duration.",
      regular: "Your speed increases by an additional 5 feet (15 total).",
      exceptional: "Your speed increases by an additional 5 feet (20 total).",
      superior: "Your speed increases by an additional 5 feet (25 total).",
    },
  },
  "Seasoned Sea Crab": {
    id: 17,
    name: "Seasoned Sea Crab",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This crunchy crustacean is seasoned with ginger, coriander and crushed garlic.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all wisdom checks you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "You add the chef's spellcasting ability modifier to any wisdom saving throws you make for the duration. If the chef's spellcasting ability modifier already applies to the saving throw, double it instead.",
      exceptional:
        "You gain darkvision out to a range of 60 feet for the duration.",
      superior:
        "Until the recipe ends, you can take the search action as a bonus action on each of your turns.",
    },
  },
  "Skewered Flobberworm": {
    id: 18,
    name: "Skewered Flobberworm",
    eatingTime: "1 bonus action",
    duration: "1 minute",
    description:
      "This skewer is layered with a variety of flobberworm meats and vegetables, all fried until soft and crunchy.",
    qualities: {
      flawed:
        "Once consumed, you become invigorated by a momentary boost of power. Whenever you make a damage roll during the recipe's duration, you can choose to deal bonus damage equal to the chef's spellcasting ability modifier and end the recipe. The bonus damage is the same type as the damage roll.",
      regular:
        "The bonus damage increases to 1d4 + the chef's spellcasting ability modifier.",
      exceptional:
        "The bonus damage increases to 2d4 + the chef's spellcasting ability modifier.",
      superior:
        "The bonus damage increases to 3d4 + the chef's spellcasting ability modifier.",
    },
  },
  Snapeschnitzel: {
    id: 19,
    name: "Snapeschnitzel",
    eatingTime: "1 bonus action",
    duration: "Instantaneous",
    description:
      "This delicate cut of veal is crumbed and smoked inside an oaken log, blackened and burnt looking on the outside, but considerably different within. Many people still debate to this day whether or not this is a good recipe.",
    qualities: {
      flawed:
        "Once consumed, you can immediately expend hit dice to regain hit points, as if you had just finished a short rest.",
      regular:
        "You can add the chef's spellcasting ability modifier to the total amount of hit points regained using this recipe.",
      exceptional:
        "If the chef is willing, you can use their hit dice to regain hit points as well as your own.",
      superior:
        "Instead of adding it to the total, you can substitute the chef's spellcasting ability modifier in place of your constitution modifier when expending hit dice with this recipe.",
    },
  },
  "Thick 'n' Juicy Steak": {
    id: 20,
    name: "Thick 'n' Juicy Steak",
    eatingTime: "1 bonus action",
    duration: "1 hour",
    description:
      "This small slice of steak is grilled in rosemary and red peppercorn.",
    qualities: {
      flawed:
        "Once consumed, you gain a bonus to all strength checks and strength saving throws you make for the duration. The bonus is equal to the chef's spellcasting ability modifier.",
      regular:
        "Until the recipe ends, you count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.",
      exceptional:
        "Your jump distance is doubled for the duration. In addition, every 2 feet you jump only costs you 1 foot of movement.",
      superior:
        "You treat any roll on strength based ability checks and saving throws less than a 10 as a 10.",
    },
  },
  "Twinkie?": {
    id: 21,
    name: "Twinkie?",
    eatingTime: "1 bonus action",
    duration: "Instantaneous",
    description:
      "This cake is a muggle classic, reinvented by a house elf who was told what it tastes like and what's inside of it, but had to guess what it was shaped like. Thus, it tastes like the best twinkie ever made, but looks like a cone with frosting inside.",
    qualities: {
      flawed:
        "Once consumed, you regain a number of hit points equal to 1d6 + the chef's spellcasting ability modifier.",
      regular:
        "The healing increases to 2d6 + the chef's spellcasting ability modifier.",
      exceptional:
        "The healing increases to 3d6 + the chef's spellcasting ability modifier.",
      superior:
        "The healing increases to 4d6 + the chef's spellcasting ability modifier.",
    },
  },
  "Unspeakable Curry": {
    id: 22,
    name: "Unspeakable Curry",
    eatingTime: "1 bonus action",
    duration: "8 hours",
    description:
      "This fresh and mild curry contains a variety of healthy fruits and vegetables.",
    qualities: {
      flawed:
        "Once consumed, you gain a telepathic link with the chef and any other creature under the effects of a garden curry recipe created by the chef. For the duration, you can communicate telepathically with any of these creatures, provided they are within 30 feet of you.",
      regular: "The link's range extends to 60 feet.",
      exceptional: "The link's range extends to 90 feet.",
      superior: "The link's range extends to 120 feet.",
    },
  },
};

export const recipeQualityDCs = {
  flawed: 5,
  regular: 10,
  exceptional: 15,
  superior: 20,
};

export const recipeCategories = {
  combat: [
    "Blazing Braised Fire-Breathing Chicken",
    "Bull's Eye Soup",
    "Deluxe Pepper Imp",
    "Edible Dark Marks",
    "King Sized Acid Pop",
    "Skewered Flobberworm",
  ],
  utility: [
    "Broiled Scorpion-on-a-Stick",
    "Diricawl Jerky",
    "Salazar Slytherfin",
    "Seasoned Sea Crab",
    "Pensieve Pastry",
  ],
  support: [
    "Chocolate Frog",
    "Creamy Milk Risotto",
    "Croque Madame",
    "Greenhouse Slider",
    "Lasagne to Induce Euphoria",
    "Longbottom Stew",
    "Thick 'n' Juicy Steak",
    "Unspeakable Curry",
  ],
  healing: ["Snapeschnitzel", "Twinkie?"],
  spellcasting: ["Devilled Sausage"],
};

export const getRecipeById = (id) => {
  return Object.values(recipes).find((recipe) => recipe.id === id);
};

export const getRecipeIdByName = (name) => {
  return recipes[name]?.id;
};

export const getOfficialRecipeForDB = (recipeId) => {
  const recipe = getRecipeById(recipeId);
  if (!recipe) return null;

  return {
    official_recipe_id: recipe.id,
    custom_recipe_id: null,
  };
};

export const isValidOfficialRecipeId = (id) => {
  return id >= 1 && id <= 22 && getRecipeById(id) !== undefined;
};
