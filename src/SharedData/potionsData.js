export const potions = {
  1: [
    {
      name: "Blemish Blitzer",
      rarity: "common",
      description: "Removes acne and blemishes from face when applied",
      longDescription:
        "This specially formulated potion will magically remove any acne or blemishes from your face when applied.\n\nAntidote to: Fungiface Potion, furnunculus",
    },
    {
      name: "Liquid Darkness",
      rarity: "common",
      description: "Creates magical smoke for obscurement when drunk or thrown",
      longDescription:
        "When a being drinks this potion, magical smoke billows out from their pores. Creatures attempting to identify the drinker by visual or olfactory means have disadvantage on the check. This lasts for 1 minute.\n\nWhen thrown, this potion creates a thick cloud of magical smoke in a 10-foot cube. This lasts for 1 minute.\n\nMagical smoke works as the nebulus spell but isn't affected by reparifarge.",
      restricted: true,
      restrictedTo: "Dark Arts",
    },
    {
      name: "Babbling Beverage",
      rarity: "common",
      description: "Makes words come out as gibberish for 1 minute",
      longDescription:
        "When you drink this potion, every word you try to say comes out as gibberish or complete nonsense for the next 1 minute.",
    },
    {
      name: "Cupid Crystals",
      rarity: "common",
      description:
        "Love potion - target becomes infatuated with next being seen",
      longDescription:
        "When a being drinks this potion, they will become infatuated with the next being they see within 10 minutes. They become charmed by that being for 1 hour.",
    },
    {
      name: "Doxycide",
      rarity: "common",
      description: "Poison mist for dealing with pests",
      longDescription:
        "Delivered as a mist via a spray bottle, this mild poison is a household staple to deal with pests. A creature that inhales this poison must succeed on a DC 13 Constitution saving throw, taking 2 (1d4) poison damage on a failed save, or half as much damage on a successful one.\n\nIf the victim of this poison is a tiny Beast, it is paralyzed for 1 hour on a failed save.",
    },
    {
      name: "Dreamless Sleep Potion",
      rarity: "common",
      description: "Gain long rest benefits after 4 hours of deep sleep",
      longDescription:
        "When you drink this potion, you immediately fall asleep and gain the benefits of a long rest after 4 hours of uninterrupted sleep. However, your sleep is far deeper than usual, and someone using their action to shake you or taking damage is the only way for you to wake before 4 hours have passed.",
    },
    {
      name: "Elixir to Induce Euphoria",
      rarity: "common",
      description:
        "Causes happiness with side effects of singing and nose-tweaking",
      longDescription:
        "When you drink this potion, your emotions are overpowered by a sudden inexplicable happiness, with the side effects of spontaneous singing and nose-tweaking. You gain resistance to psychic damage for 1 hour. For the duration, you have disadvantage on Dexterity (Stealth), Charisma (Intimidation), and Charisma (Deception) checks.",
    },
    {
      name: "Heartbreak Teardrops",
      rarity: "common",
      description: "Love potion causing fear of rejection",
      longDescription:
        "When a being drinks this potion, they are overcome with the fear of being rejected by the object of their desire for 1 hour. If no relationship or attraction exists, a new one will be magically created. The being is susceptible to the next suggested course of action to try to avoid rejection. The suggestion does not need to logically prevent rejection, but it must be reasonable and not be obviously harmful. It pursues the course of action you described to the best of its ability, until the course of action is complete or until the potion's effect wears off.",
    },
    {
      name: "Hiccoughing Solution",
      rarity: "common",
      description: "Causes hiccups for 1 hour with casting disadvantage",
      longDescription:
        "When you drink this potion, you come down with a bad case of the hiccups for 1 hour. For the duration, you have disadvantage on Charisma checks. If you try to cast a spell verbally, roll a d10. On a 1, the casting fails and the spell is wasted.",
    },
  ],
  2: [
    {
      name: "Antidote of Common Poisons",
      rarity: "common",
      description: "Neutralizes simple poisons and provides advantage",
      longDescription:
        "When you drink this potion, simple poisons in your system are neutralized and you gain advantage on saving throws against poison for 1 hour. If you took poison damage in the previous minute, you regain half of your hit points lost to poison damage, up to a maximum of 15 hit points.\n\nAntidote to: Baneberry Poison, Doxycide, Garrotting Gas, Moonseed Poison",
    },
    {
      name: "Baneberry Poison",
      rarity: "common",
      description:
        "Causes a lingering poisoned condition unless resisted with a Constitution save",
      longDescription:
        "While this poison doesn't actually cause any harm in the body, its toxins interfere with blood clotting and produce an overall sickly feeling. A creature that ingests this poison must succeed on a DC 13 Constitution saving throw or become poisoned. The poisoned creature must repeat the saving throw every 24 hours.",
    },
    {
      name: "Beautification Potion",
      rarity: "uncommon",
      description: "Makes appearance more attractive for 10 minutes",
      longDescription:
        "When you drink this potion, your appearance is transformed to be more attractive for 10 minutes. For the duration, when you make a Charisma (Deception), Charisma (Performance) or Charisma (Persuasion) check, you roll a d4 and add the number rolled to the check.",
    },
    {
      name: "Dr. Ubbly's Oblivious Unction",
      rarity: "common",
      description: "Gives disadvantage on Wisdom checks for 1 hour",
      longDescription:
        "When you drink this potion, your brain's perception is softened for 1 hour to protect it from harmful thoughts. For the duration, you have disadvantage on Wisdom checks.",
    },
    {
      name: "Forgetfulness Potion",
      rarity: "common",
      description:
        "Erases the last minute of memory and blocks new memories for 10 minutes",
      longDescription:
        "When you drink this potion, you forget everything you perceived in the last minute and you won't be able to remember anything you perceive in the next 10 minutes.",
    },
    {
      name: "Fungiface Potion",
      rarity: "common",
      description:
        "Covers your face in itchy mushrooms for 1 hour (furnunculus spell effect)",
      longDescription:
        "When you drink this potion, you gain the effects of the furnunculus spell, sprouting dense and itchy mushrooms on your face instead of pimples. This effect lasts 1 hour.",
    },
    {
      name: "Garrotting Gas",
      rarity: "common",
      description:
        "Inhaled gas that can poison or knock out creatures; affects a 5-foot area when thrown",
      longDescription:
        "This gas produces a choking or suffocating sensation, which, given the fact it's colorless, can be quite dangerous. A creature that inhales this poison must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the creature is unconscious while poisoned in this way. The creature wakes up if it takes damage or a creature shakes it awake as an action.\n\nAs an action, you can throw a bottle of Garrotting Gas at a point up to 60 feet away, releasing the gas and exposing creatures within 5 feet of that point.",
    },
    {
      name: "Herbicide Potion",
      rarity: "common",
      description:
        "Kills magical plants within a 5-foot cube; partial effect on larger plants",
      longDescription:
        "When this poison is poured directly on a magical plant, the plant immediately withers and dies.  There is only enough poison to affect a plant that fits within a 5 foot cube. If the magical       plant is larger than a 5 foot cube, the affected area will wither, but the plant will not die until the entire plant is withered.",
    },
    {
      name: "Oculus Potion",
      rarity: "common",
      description: "Cures blindness and restores normal vision",
      longDescription:
        "Drinking this deep orange potion removes the blind condition, restoring your eyesight to its normal state.\n\nAntidote to: conjunctivia",
    },
    {
      name: "Shrinking Solution",
      rarity: "common",
      description: "Gain effects of diminuendo spell for 1d4 hours",
      longDescription:
        "When you drink this potion, you gain the effects of the diminuendo spell for 1d4 hours (no concentration required). This potion can also be poured over an object for the effects of reducio.\n\nAntidote to: engorgio, Swelling Solution",
    },
    {
      name: "Swelling Solution",
      rarity: "common",
      description: "Gain effects of engorgio spell for 1d4 hours",
      longDescription:
        "When you drink this potion, you gain the effects of the engorgio spell for 1d4 hours (no concentration required). This potion can also be poured over an object for a similar effect.\n\nAntidote to: diminuendo, reducio, Shrinking Solution",
    },
    {
      name: "Wound Cleaning Potion",
      rarity: "common",
      description: "Sterilizes wounds, stabilizes dying creatures",
      longDescription:
        "When you apply this potion to open wounds, it stings, smokes and perfectly sterilizes the area. A bottle contains ten doses, and one dose stabilizes a creature that has 0 Hit Points, without needing to make a Wisdom (Medicine) check.",
    },
  ],
  3: [
    {
      name: "Aging Potion",
      rarity: "uncommon",
      description: "Ages you by 4d10 years for 1 hour",
      longDescription:
        "When you drink this potion, your age is increased by 4d10 years for 1 hour. This effect authentically changes your age, but doesn't reduce your lifespan or introduce maladies due to aging. One quarter, one half, or three quarters of this potion may be drunk, modifying the effect to 1d10, 2d10, or 3d10.",
    },
    {
      name: "Baruffio's Brain Elixir",
      rarity: "uncommon",
      description: "Advantage on Intelligence checks for 1 hour",
      longDescription:
        "When you drink this potion, you have advantage on Intelligence checks for 1 hour. Your thoughts become louder and faster, making it easy to focus.\n\nAntidote to: Befuddlement Draught, confundo, Confusing Concoction, infirma cerebra",
    },
    {
      name: "Befuddlement Draught",
      rarity: "uncommon",
      description:
        "Disadvantage on Intelligence and Wisdom checks; advantage on saves vs. fear (except Dementors) for 1 hour",
      longDescription:
        "When you drink this potion, you become belligerent and reckless for 1 hour. For the duration, you have disadvantage on Intelligence checks and Wisdom checks, and you have advantage on saving throws against being frightened from any source other than a Dementor.",
    },
    {
      name: "Blood Replenishing Potion",
      rarity: "uncommon",
      description: "Doubles hit dice recovery or regains all spent hit dice",
      longDescription:
        "Typically administered in an emergency, this healing potion helps replenish blood lost from injuries. If the next rest you take is a short rest, the amount of hit points gained from rolling hit dice is doubled during that short rest. If the next rest you take is a long rest, you regain all spent hit dice.\n\nAntidote to: Baneberry Poison, Bloodroot Poison",
    },
    {
      name: "Bloodroot Poison",
      rarity: "uncommon",
      description:
        "Deals ongoing poison damage that can't be healed; ends after seven successful daily saves",
      longDescription:
        "The Bloodroot Poison gets into the bloodstream and causes a very gradual internal necrosis. A creature that ingests this poison must succeed on a DC 16 Constitution saving throw or take 7 (2d6) poison damage and become poisoned. The poisoned creature must repeat the saving throw every 24 hours, taking 7 (2d6) poison damage on a failed save.\n\nUntil this poison ends, the damage the poison deals can't be healed by any means. After seven successful saving throws, the effect ends and the creature can heal normally.",
    },
    {
      name: "Confusing Concoction",
      rarity: "common",
      description:
        "For 6 seconds, you can't act and may move in a random direction based on a d10 roll",
      longDescription:
        "When you drink this potion, you become utterly discombobulated for 6 seconds. You can't take actions or reactions and you roll a d10. If you roll 1-8, you must use all of your movement to move in a random direction. To determine the direction, assign a direction to each number 1-8. If you roll a 9-10, you don't move.",
    },
    {
      name: "Exstimulo Potion",
      rarity: "uncommon",
      description: "Next spell cast as if one level higher",
      longDescription:
        "When you drink this potion, the next spell you cast within the next 8 hours will be as if it were cast using a spell slot one level higher than its original level.",
    },
    {
      name: "Fire Protection Potion",
      rarity: "uncommon",
      description: "Resistance to fire damage for 1 hour",
      longDescription:
        "When you drink this potion, you gain resistance to fire damage for 1 hour.",
    },
    {
      name: "Girding Potion",
      rarity: "uncommon",
      description: "Grants 6d4 + 6 temporary hit points for 1 hour",
      longDescription:
        "When you drink this potion, you gain 6d4 + 6 temporary hit points for 1 hour. This feels like an abnormal amount of physical stamina and pain tolerance.",
    },
    {
      name: "Gregory's Unctuous Unction",
      rarity: "uncommon",
      description:
        "Charmed by the giver for 1 hour, treating them as your best friend",
      longDescription:
        "When you drink this potion, you are charmed by the giver of the potion for 1 hour. The charmed subject believes the giver is their very best friend.",
    },
    {
      name: "Moonseed Poison",
      rarity: "common",
      description:
        "Deals 6d6 poison damage (half on save, DC 11) when ingested",
      longDescription:
        "The moonseed vine, its leaves and its berries give their toxicity to this basic poison. A creature that ingests this poison must succeed on a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one.",
    },
    {
      name: "Pet Tonic",
      rarity: "common",
      description:
        "Fully heals a magical pet, cures conditions, and grants 1d4 temporary hit points for 1 hour",
      longDescription:
        "When this potion is given to a magical pet, all of its hit points are restored, any diseases and conditions are removed and it gains 1d4 temporary hit points for 1 hour.",
    },
    {
      name: "Regerminating Potion",
      rarity: "common",
      description: "Revives dying plants and accelerates seedling growth",
      longDescription:
        "When this potion is poured on the roots of a dying plant, it is revitalized. It also accelerates the growth of healthy seedlings.\n\nAntidote to: Herbicide Potion",
    },
    {
      name: "Star Grass Salve",
      rarity: "common",
      description: "Restores 2d4 + 2 hit points when applied",
      longDescription:
        "You regain 2d4 + 2 hit points when you apply this medicinal balm to your injuries.",
    },
    {
      name: "Sleeping Draught",
      rarity: "uncommon",
      description:
        "Puts you into a magical sleep for 1 hour; only an antidote can wake you early",
      longDescription:
        "When you drink this potion, you fall unconscious into a deep sleep. You can't be awoken by any means for 1 hour, aside from administering an antidote. After that, the sleep is natural, so you would sleep only as long as you normally would or until woken by taking damage or someone shaking or slapping you awake.",
    },
    {
      name: "Strengthening Solution",
      rarity: "uncommon",
      description: "Strength score raised to 21 for 1 hour",
      longDescription:
        "When you drink this potion, your Strength score is raised to 21 for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.",
    },
    {
      name: "Volubilis Potion",
      rarity: "uncommon",
      description:
        "For 10 minutes, alters your voice and grants advantage on Deception and Performance checks to impersonate someone",
      longDescription:
        "When you drink this potion, you have an advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person for 10 minutes. It magically alters your voice to sound like someone else's, or if your voice is lost, it will restore it.",
    },
    {
      name: "Wiggenweld Potion",
      rarity: "uncommon",
      description: "Cures magical sleep and awakens the target instantly",
      longDescription:
        "This healing potion is the antidote for magically induced sleep, immediately waking the victim.\n\nAntidote to: Draught of Living Death, Sleeping Draught, stupefy",
    },
  ],
  4: [
    {
      name: "Beguiling Bubbles",
      rarity: "uncommon",
      description: "Target charmed by chosen being for 1 hour",
      longDescription:
        "When a being drinks this potion, they become charmed by a chosen being for 1 hour. The chosen being is selected by the brewer speaking their name into the potion during brewing. If the chosen being is someone the charmed subject would normally be attracted to, they regard that being as their true love while they are charmed.",
    },
    {
      name: "Draught of Peace",
      rarity: "uncommon",
      description: "Suppresses strong emotions for 1 hour",
      longDescription:
        "When you drink this potion, all strong emotions are suppressed for 1 hour, putting you into a neutral and relaxed disposition. Any charmed or frightened condition is removed and you have advantage on saving throws against being charmed or frightened. Unfortunately, the feeling of this potion wearing off has been described as experiencing all of the suppressed emotions at once, and some suppressed conditions may resume.\n\nAdditionally, if you are hostile, you will become indifferent to the targets of your hostility. This indifference ends if you are attacked or harmed by a spell or if you witnesses any of your friends being harmed.\n\nAntidote to: Beguiling Bubbles, Cupid Crystals, Elixir to Induce Euphoria, exhilaro, Gregory's Unctuous Unction, Heartbreak Teardrops, Twilight Moonbeams",
    },
    {
      name: "Fatiguing Fusion",
      rarity: "uncommon",
      description:
        "On failed save (DC 13), causes 3 levels of exhaustion, up to a max of 5",
      longDescription:
        "A creature that ingests or inhales this tiresome poison must succeed on a DC 13 Constitution saving throw or gain 3 levels of exhaustion. This poison cannot cause you to reach more than 5 levels of exhaustion.",
    },
    {
      name: "Gillyweed",
      rarity: "uncommon",
      description: "Breathe underwater and swim for 1 hour",
      longDescription:
        "When you eat this plant, your body adapts to an aquatic environment, sprouting gills and growing webbing between your fingers for 1 hour. You can breathe underwater and gain a swimming speed equal to your walking speed. However, you lose the ability to breathe air, following the rules for suffocating if you emerge from water.",
    },
    {
      name: "Memory Potion",
      rarity: "uncommon",
      description: "Restores lost memories, advantage on knowledge checks",
      longDescription:
        "When you drink this potion, lost memories are restored to you and you're able to recall more details than usual. You have advantage on Intelligence (Herbology), Intelligence (Magical Theory) and Intelligence (Muggle Studies) checks for 10 minutes.\n\nAntidote to: Forgetfulness Potion, obliviate",
    },
    {
      name: "Murtlap Essence",
      rarity: "uncommon",
      description: "Restores 4d4 + 4 hit points when applied to wounds",
      longDescription:
        "This solution of strained and pickled tentacles of Murtlaps soothes painful cuts and abrasions, helping you regain 4d4 + 4 hit points when applied.",
    },
    {
      name: "Noxious Potion",
      rarity: "uncommon",
      description:
        "Inhaled or ingested poison dealing 6d6 damage and ongoing 2d6 until 3 saves (DC 13); can be thrown to affect a 5-foot area",
      longDescription:
        "The liquid and fumes of this potion are equally dangerous, allowing for creatively nefarious uses. A creature that ingests or inhales this poison must succeed on a DC 13 Constitution saving throw or take 21 (6d6) poison damage, and must repeat the saving throw at the start of each of its turns. On each successive failed save, the character takes 7 (2d6) poison damage. After three successful saves, the poison ends.\n\nAs an action, you can throw a bottle of Noxious Potion at a point up to 60 feet away, releasing the gas and exposing creatures within 5 feet of that point.",
    },
    {
      name: "Twilight Moonbeams",
      rarity: "uncommon",
      description:
        "Charmed by a chosen target for 1 hour; disadvantage on Perception checks not involving them",
      longDescription:
        "When a being drinks this potion, they become charmed by a chosen being for 1 hour. The chosen being is selected by the brewer speaking their name into the potion during brewing. The charmed subject's mind is clouded with daydreams and has disadvantage on Wisdom (Perception) checks to notice anything other than the chosen being.",
    },
    {
      name: "Vitamix Potion",
      rarity: "uncommon",
      description:
        "Grants advantage on Dexterity checks for 1 hour; feels like a burst of energy",
      longDescription:
        "When you drink this potion, you have advantage on Dexterity checks for 1 hour. Drinking it feels like 'a burst of energy', greatly sharpening one's reflexes.\n\nAntidote to: digitus wibbly, locomotor wibbly",
    },
    {
      name: "Wideye Potion",
      rarity: "uncommon",
      description: "Removes up to 2 levels of exhaustion",
      longDescription:
        "Also known as the Awakening Potion, drinking this potion removes up to two levels of exhaustion. Other uses are awakening someone from non-magical drugging or concussion, and side effects include restlessness and insomnia.",
    },
  ],
  5: [
    {
      name: "Invigoration Draught",
      rarity: "rare",
      description: "Heals 8d4+8 hit points",
      longDescription:
        "You regain 8d4 + 8 hit points when you drink this shimmering orange potion.",
    },
    {
      name: "Invisibility Potion",
      rarity: "rare",
      description: "Invisibility for 10 minutes (no concentration)",
      longDescription:
        "When you drink this silvery potion, you gain the effects of pellucidi pellis for 10 minutes (no concentration required). The potion's effect ends if you attack or cast a spell. This potion can also be poured over an object for a similar effect.",
    },
    {
      name: "Kissing Concoction",
      rarity: "rare",
      description:
        "Charmed for 1 hour; compelled to kiss a chosen target when seen or directed toward them",
      longDescription:
        "When a being drinks this potion, they become charmed by a chosen being and powerfully compelled to kiss them for 1 hour. The chosen being is selected by the brewer speaking their name into the potion during brewing. If the charmed subject sees the chosen being, they must use as much of their movement as possible to move to the chosen being and kiss them, ending the potion's effect.\n\nIf the brewer uses a bonus action to tell the charmed subject where the chosen being might be, the charmed subject must use as much of their movement as possible to move in that direction on their next turn. They can take their action before they move. They won't be compelled to move into an obviously deadly hazard, but they will provoke opportunity attacks.",
    },
    {
      name: "Mandrake Restorative Draught",
      rarity: "rare",
      description: "Ends charm, paralysis, petrification, or transfiguration",
      longDescription:
        "When this healing potion is administered, it ends one of the following effects on the target:\n* One effect that charmed, paralyzed or petrified the target.\n* One Transfiguration spell that's changed the target's form.",
    },
    {
      name: "Skele-Gro",
      rarity: "rare",
      description: "Rapidly regrows and repairs bones",
      longDescription:
        "Used to rapidly regrow and repair bones, this healing potion is a staple in a mediwizard's potion case. If the next rest you take is a short rest, you regain hit points equal to half your hit point maximum. If the next rest you take is a long rest, you regain all spent hit dice and gain temporary hit points equal to twice your caster level.",
    },
    {
      name: "Wit-Sharpening Potion",
      rarity: "rare",
      description: "Raises Intelligence and Wisdom to 20 for 1 hour",
      longDescription:
        "When you drink this potion, your brain's neurological functioning is maximized, raising your Intelligence and Wisdom scores to 20 for 1 hour. The potion has no effect if your ability scores are equal to or greater than that score.\n\nAntidote to: Befuddlement Draught, Common and Uncommon Love Potions, confundo, Confusing Concoction, infirma cerebra",
    },
    {
      name: "Weedosoros",
      rarity: "rare",
      description:
        "Deals 14d6 poison damage (DC 15); poisoned for 1 day on fail or 1 minute on success",
      longDescription:
        "Named after the mysterious magical plant, weed of sorrows, this poison is reputed to fill the victim with deep regret in their final moments. A creature that ingests this poison must make a DC 15 Constitution saving throw, taking 49 (14d6) poison damage and being poisoned for 1 day on a failed save, or half as much damage and poisoned for 1 minute on a successful one.",
    },
  ],
  6: [
    {
      name: "Amortentia",
      rarity: "very rare",
      description: "Overwhelmingly charmed by brewer for 1 week",
      longDescription:
        "When a being drinks this potion, they are overwhelmingly charmed by the brewer of this potion for 1 week. The charmed subject believes the brewer to be their one true love and will perform any request the brewer asks, to the best of their ability. All thoughts will be colored by a powerful obsession with the brewer, but their personality will otherwise be unchanged. This charmed effect can only be removed by an antidote to this potion.",
    },
    {
      name: "Draught of the Living Death",
      rarity: "very rare",
      description: "Falls into deep sleep; can only be awoken by antidote",
      longDescription:
        "The drinker of this infamous and challenging poison falls into a deep sleep and can't be awoken by any means, aside from administering an antidote. The creature will breathe normally, but cannot be suffocated in this state. It also doesn't need to eat or drink. The creature will age normally, and it can die of old age while under the effects of this poison.",
    },
    {
      name: "Erumpent Potion",
      rarity: "rare",
      description: "Throw for violent explosion; highly volatile",
      longDescription:
        "As an action, you can throw a bottle of Erumpent Potion at a point up to 60 feet away, releasing a violent explosion and shockwave. Each creature within 10 feet of that point must make a DC 14 Dexterity saving throw, taking 10d6 bludgeoning damage on a failed save, or half as much damage on a successful one. Each creature within 30 feet of that point takes 4d8 thunder damage. This potion is highly volatile and will explode if it is poured out of its container.",
    },
    {
      name: "Essence of Dittany",
      rarity: "very rare",
      description: "Regrows limbs and heals 10d4+20 HP",
      longDescription:
        "This highly concentrated liquid rapidly heals and regenerates open wounds, helping you regain 10d4 + 20 hit points when applied. If the target has lost body members (fingers, legs, and so on) and the severed part is held to its place, applying this potion causes the limb to heal back on immediately.",
    },
    {
      name: "Essence of Insanity",
      rarity: "rare",
      description: "Causes paranoia and fear for 1 hour",
      longDescription:
        "Instead of attacking the body, this oil attacks the mind. A creature that makes contact with this poison is overwhelmed with paranoia and becomes poisoned for 1 hour. It is frightened of the nearest creature for the duration. On its next turn, the victim must take the dash action and move away from that creature by the safest and shortest available route, unless there is nowhere to move.",
    },
    {
      name: "Hate Potion",
      rarity: "rare",
      description: "View chosen being as most hated enemy for 10 minutes",
      longDescription:
        "When a being drinks this potion, they view a chosen being as their most hated enemy for 10 minutes. If the brewer does not select a chosen being by speaking their name into the potion during brewing, the drinker will be hostile towards the next being they see within the potion's duration. If this potion is used as an antidote, it has no effect beyond acting as an antidote for the same duration.\n\nAntidote to: Amortentia, Beguiling Bubbles, Cupid Crystals, Gregory's Unctuous Unction, Heartbreak Teardrops, Kissing Concoction, Twilight Moonbeams",
    },
    {
      name: "Polyjuice Potion",
      rarity: "very rare",
      description: "Transform into another human for 1 hour",
      longDescription:
        "After adding the hair, nail clipping, or other part of a human, drinking this potion perfectly transforms you into that human for 1 hour, changing your height, weight, facial features, sound of your voice, hair length and coloration. None of your statistics change, but your size may change to match the targeted human.\n\nThe potion works for part-humans, but not half-humans. The consistency of the potion is always like a thick mud, but the color and flavor change based on the targeted human, typically tasting very unpleasant.",
    },
    {
      name: "Wolfsbane Potion",
      rarity: "very rare",
      description: "Lycanthrope retains control during transformation",
      longDescription:
        "When a lycanthrope drinks this potion once a day for the entire week before the full moon, their alignment does not change and they are not placed under HM control during their transformation. If the drinker misses a single dose in the preceding week, the potion has no effect.",
    },
  ],
  7: [
    {
      name: "Death-Cap Draught",
      rarity: "very rare",
      description: "One of the most deadly poisons; 24d6 damage",
      longDescription:
        "Death cap mushrooms are the key ingredient to one of the most deadly poisons. A creature that ingests this poison must make a DC 19 Constitution saving throw, taking 84 (24d6) poison damage and becoming poisoned for 1 day on a failed save, or half as much damage and poisoned for 1 minute on a successful one.",
    },
    {
      name: "Drink of Despair",
      rarity: "legendary",
      description:
        "Hallucinates worst fears; incapacitated and reduced to 1 HP",
      longDescription:
        "When a creature drinks this fabled poison, it hallucinates all of its worst fears and memories, vividly reexperiencing its deepest regrets and darkest traumas. It is incapacitated for 30 seconds, it is reduced to 1 hit point and its gains 4 levels of exhaustion.",
    },
    {
      name: "Felix Felicis",
      rarity: "legendary",
      description: "Liquid luck - exceptionally lucky for 1d4 hours",
      longDescription:
        'Also known as "liquid luck," this potion makes you exceptionally lucky for 1d4 hours, to the point of succeeding at everything you attempt. For the duration, your Charisma score is raised to 21, you can\'t be surprised and have advantage on attack rolls, ability checks, and saving throws. Additionally, other creatures have disadvantage on attack rolls against you for the duration.',
    },
    {
      name: "Veritaserum",
      rarity: "legendary",
      description: "Truth serum - compels truth for 10 minutes",
      longDescription:
        "A creature subjected to this potion must succeed on a DC 21 Charisma saving throw. On a failed save, the creature is compelled to tell the whole truth to any questions asked of it within the next 10 minutes. You know whether the creature succeeds or fails on its saving throw, based on the dull and dazed look in its eyes.\n\nOn a successful save, the creature is aware of the potion's effect for the next 10 minutes, and can avoid answering questions to which it would normally respond with a lie. Such creatures can be evasive in their answers as long as they remain within the boundaries of the truth.",
    },
  ],
};

export const qualityDCs = {
  common: { ruined: 0, flawed: 5, normal: 10, exceptional: 15, superior: 20 },
  uncommon: {
    ruined: 0,
    flawed: 8,
    normal: 12,
    exceptional: 18,
    superior: 22,
  },
  rare: { ruined: 0, flawed: 10, normal: 15, exceptional: 20, superior: 25 },
  "very rare": {
    ruined: 0,
    flawed: 15,
    normal: 20,
    exceptional: 25,
    superior: 30,
  },
  legendary: {
    ruined: 0,
    flawed: 20,
    normal: 25,
    exceptional: 30,
    superior: 35,
  },
};
