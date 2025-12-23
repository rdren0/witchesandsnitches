import { getFeatsSync } from "../../../hooks/useFeats";
import { getAllSelectedFeats } from "./characterUtils";

export const calculateFeatBenefits = (character, featChoices = {}) => {
  if (!character) {
    return {
      combatBonuses: {
        initiativeBonus: 0,
        spellAttackBonus: 0,
        criticalRange: 20,
        concentrationAdvantage: false,
        deathSaveAdvantage: false,
        passivePerceptionBonus: 0,
        passiveInvestigationBonus: 0,
        darkvision: 0,
        hitPointsPerLevel: 0,
        enhancedUnarmedStrike: false,
        unseeingAdvantageImmunity: false,
        flyingAttackAdvantage: false,
        poisonSaveAdvantage: false,
      },
      speeds: {
        walkingBonus: 0,
        climb: null,
        flying: null,
      },
      resistances: [],
      immunities: [],
      spellcasting: {
        bonusActionCantrip: null,
        wandlessCantrips: false,
        wandlessSpells: [],
        superiorWandlessCasting: false,
        spellOpportunityAttacks: false,
        spellRangeDouble: false,
        ignoreHalfCover: false,
        ignoreAllCover: false,
        enhancedHealing: null,
        elementalMastery: [],
        metamagicOptions: [],
        sorceryPoints: 0,
        cantripsLearned: 0,
        spellsKnown: {},
        extraSpellSlots: {},
      },
      specialAbilities: [],
      resources: {
        luckPoints: 0,
      },
    };
  }

  const allSelectedFeats = getAllSelectedFeats(character);

  const combinedFeatChoices = {
    ...character.featChoices,
    ...featChoices,
  };

  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice) => {
      if (choice.type === "feat" && choice.featChoices) {
        Object.assign(combinedFeatChoices, choice.featChoices);
      }
    });
  }

  const benefits = {
    combatBonuses: {
      initiativeBonus: 0,
      spellAttackBonus: 0,
      criticalRange: 20,
      concentrationAdvantage: false,
      deathSaveAdvantage: false,
      passivePerceptionBonus: 0,
      passiveInvestigationBonus: 0,
      darkvision: 0,
      hitPointsPerLevel: 0,
      enhancedUnarmedStrike: false,
      unseeingAdvantageImmunity: false,
      flyingAttackAdvantage: false,
      poisonSaveAdvantage: false,
    },
    speeds: {
      walkingBonus: 0,
      climb: null,
      flying: null,
    },
    resistances: [],
    immunities: [],
    spellcasting: {
      bonusActionCantrip: null,
      wandlessCantrips: false,
      wandlessSpells: [],
      superiorWandlessCasting: false,
      spellOpportunityAttacks: false,
      spellRangeDouble: false,
      ignoreHalfCover: false,
      ignoreAllCover: false,
      enhancedHealing: null,
      elementalMastery: [],
      metamagicOptions: [],
      sorceryPoints: 0,
      cantripsLearned: 0,
      spellsKnown: {},
      extraSpellSlots: {},
    },
    specialAbilities: [],
    resources: {
      luckPoints: 0,
    },
  };

  const standardFeats = getFeatsSync();
  allSelectedFeats.forEach((featName) => {
    const feat = standardFeats.find((f) => f.name === featName);
    if (!feat?.benefits) return;

    if (feat.benefits.combatBonuses) {
      const cb = feat.benefits.combatBonuses;

      if (cb.initiativeBonus) {
        benefits.combatBonuses.initiativeBonus += cb.initiativeBonus;
      }

      if (cb.spellAttackBonus) {
        benefits.combatBonuses.spellAttackBonus += cb.spellAttackBonus;
      }

      if (
        cb.criticalRange &&
        cb.criticalRange < benefits.combatBonuses.criticalRange
      ) {
        benefits.combatBonuses.criticalRange = cb.criticalRange;
      }

      if (cb.concentrationAdvantage) {
        benefits.combatBonuses.concentrationAdvantage = true;
      }

      if (cb.deathSaveAdvantage) {
        benefits.combatBonuses.deathSaveAdvantage = true;
      }

      if (cb.passivePerceptionBonus) {
        benefits.combatBonuses.passivePerceptionBonus +=
          cb.passivePerceptionBonus;
      }

      if (cb.passiveInvestigationBonus) {
        benefits.combatBonuses.passiveInvestigationBonus +=
          cb.passiveInvestigationBonus;
      }

      if (cb.darkvision) {
        benefits.combatBonuses.darkvision = Math.max(
          benefits.combatBonuses.darkvision,
          cb.darkvision
        );
      }

      if (cb.hitPointsPerLevel) {
        benefits.combatBonuses.hitPointsPerLevel += cb.hitPointsPerLevel;
      }

      if (cb.enhancedUnarmedStrike) {
        benefits.combatBonuses.enhancedUnarmedStrike = true;
      }

      if (cb.unseeingAdvantageImmunity) {
        benefits.combatBonuses.unseeingAdvantageImmunity = true;
      }

      if (cb.flyingAttackAdvantage) {
        benefits.combatBonuses.flyingAttackAdvantage = true;
      }

      if (cb.poisonSaveAdvantage) {
        benefits.combatBonuses.poisonSaveAdvantage = true;
      }
    }

    if (feat.benefits.speeds) {
      const speeds = feat.benefits.speeds;

      if (speeds.walking?.bonus) {
        benefits.speeds.walkingBonus += speeds.walking.bonus;
      }

      if (speeds.climb) {
        if (speeds.climb === "equal_to_walking") {
          benefits.speeds.climb = "equal_to_walking";
        } else if (typeof speeds.climb === "number") {
          benefits.speeds.climb = Math.max(
            benefits.speeds.climb || 0,
            speeds.climb
          );
        }
      }

      if (speeds.flying) {
        benefits.speeds.flying = Math.max(
          benefits.speeds.flying || 0,
          speeds.flying
        );
      }
    }

    if (feat.benefits.resistances) {
      feat.benefits.resistances.forEach((resistance) => {
        if (!benefits.resistances.includes(resistance)) {
          benefits.resistances.push(resistance);
        }
      });
    }

    if (feat.benefits.immunities) {
      feat.benefits.immunities.forEach((immunity) => {
        if (!benefits.immunities.includes(immunity)) {
          benefits.immunities.push(immunity);
        }
      });
    }

    if (feat.benefits.spellcasting) {
      const sc = feat.benefits.spellcasting;

      if (sc.bonusActionCantrip) {
        benefits.spellcasting.bonusActionCantrip = sc.bonusActionCantrip;
      }

      if (sc.wandlessCantrips) {
        benefits.spellcasting.wandlessCantrips = true;
      }

      if (sc.wandlessSpells) {
        benefits.spellcasting.wandlessSpells.push(...sc.wandlessSpells);
      }

      if (sc.superiorWandlessCasting) {
        benefits.spellcasting.superiorWandlessCasting = true;
      }

      if (sc.spellOpportunityAttacks) {
        benefits.spellcasting.spellOpportunityAttacks = true;
      }

      if (sc.spellRangeDouble) {
        benefits.spellcasting.spellRangeDouble = true;
      }

      if (sc.ignoreHalfCover) {
        benefits.spellcasting.ignoreHalfCover = true;
      }

      if (sc.ignoreAllCover) {
        benefits.spellcasting.ignoreAllCover = true;
      }

      if (sc.enhancedHealing) {
        benefits.spellcasting.enhancedHealing = sc.enhancedHealing;
      }

      if (sc.elementalMastery) {
        if (
          !benefits.spellcasting.elementalMastery.some(
            (em) => em.type === sc.elementalMastery.type
          )
        ) {
          benefits.spellcasting.elementalMastery.push(sc.elementalMastery);
        }
      }

      if (sc.metamagicOptions) {
        if (Array.isArray(sc.metamagicOptions)) {
          benefits.spellcasting.metamagicOptions.push(...sc.metamagicOptions);
        } else if (sc.metamagicOptions.count) {
          benefits.spellcasting.metamagicOptions.push(sc.metamagicOptions);
        }
      }

      if (sc.sorceryPoints) {
        benefits.spellcasting.sorceryPoints += sc.sorceryPoints;
      }

      if (sc.cantripsLearned) {
        benefits.spellcasting.cantripsLearned += sc.cantripsLearned;
      }

      if (sc.spellsKnown) {
        Object.keys(sc.spellsKnown).forEach((level) => {
          benefits.spellcasting.spellsKnown[level] =
            (benefits.spellcasting.spellsKnown[level] || 0) +
            sc.spellsKnown[level];
        });
      }

      if (sc.extraSpellSlots) {
        Object.keys(sc.extraSpellSlots).forEach((level) => {
          if (!benefits.spellcasting.extraSpellSlots[level]) {
            benefits.spellcasting.extraSpellSlots[level] =
              sc.extraSpellSlots[level];
          }
        });
      }
    }

    if (feat.benefits.specialAbilities) {
      feat.benefits.specialAbilities.forEach((ability) => {
        if (
          ability.name === "Luck Points" &&
          ability.amount === "proficiency_bonus"
        ) {
          const level = character.level || 1;
          const proficiencyBonus =
            character.proficiencyBonus || Math.ceil(level / 4) + 1;
          benefits.resources.luckPoints = proficiencyBonus;
        } else {
          benefits.specialAbilities.push({
            ...ability,
            source: featName,
          });
        }
      });
    }
  });

  return benefits;
};

export const calculateInitiativeWithFeats = (
  character,
  baseInitiativeModifier,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  return baseInitiativeModifier + featBenefits.combatBonuses.initiativeBonus;
};

export const calculateWalkingSpeedWithFeats = (
  character,
  baseSpeed = 30,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  return baseSpeed + featBenefits.speeds.walkingBonus;
};

export const calculateSpeedsWithFeats = (
  character,
  baseSpeed = 30,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  const walkingSpeed = baseSpeed + featBenefits.speeds.walkingBonus;

  return {
    walking: walkingSpeed,
    climb:
      featBenefits.speeds.climb === "equal_to_walking"
        ? walkingSpeed
        : featBenefits.speeds.climb,
    flying: featBenefits.speeds.flying,
  };
};

export const getPassiveSkillFeatBonus = (
  character,
  skillName,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);

  switch (skillName.toLowerCase()) {
    case "perception":
      return featBenefits.combatBonuses.passivePerceptionBonus;
    case "investigation":
      return featBenefits.combatBonuses.passiveInvestigationBonus;
    default:
      return 0;
  }
};

export const hasImmunityFromFeats = (
  character,
  immunityType,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  return featBenefits.immunities.includes(immunityType);
};

export const hasResistanceFromFeats = (
  character,
  resistanceType,
  featChoices = {}
) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  return featBenefits.resistances.includes(resistanceType);
};

export const getHitPointsBonusFromFeats = (character, featChoices = {}) => {
  const featBenefits = calculateFeatBenefits(character, featChoices);
  const level = character.level || 1;
  return featBenefits.combatBonuses.hitPointsPerLevel * level;
};

const featBenefitsCalculator = {
  calculateFeatBenefits,
  calculateInitiativeWithFeats,
  calculateWalkingSpeedWithFeats,
  calculateSpeedsWithFeats,
  getPassiveSkillFeatBonus,
  hasImmunityFromFeats,
  hasResistanceFromFeats,
  getHitPointsBonusFromFeats,
};

export default featBenefitsCalculator;
