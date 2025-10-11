import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  sendDiscordRollWebhook,
  getRollResultColor,
  ROLL_COLORS,
} from "../utils/discordWebhook";

export const rollCreatureInitiative = async ({
  creature,
  initiativeModifier,
  showRollResult,
  ownerCharacter,
}) => {
  try {
    const roller = new DiceRoller();
    const roll = roller.roll("1d20");
    const d20Value = roll.total;
    const total = d20Value + initiativeModifier;

    const isCriticalSuccess = d20Value === 20;
    const isCriticalFailure = d20Value === 1;

    if (showRollResult) {
      showRollResult({
        title: "Initiative",
        rollValue: d20Value,
        modifier: initiativeModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "initiative",
        description: `Rolling initiative for ${creature.name}`,
      });
    }

    const rollResult = {
      d20Roll: d20Value,
      modifier: initiativeModifier,
      total: total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const fields = [];
    if (ownerCharacter) {
      fields.push({
        name: "Belongs to",
        value: ownerCharacter.name,
        inline: true,
      });
    }

    await sendDiscordRollWebhook({
      character: {
        name: creature.name,
        gameSession: creature.gameSession || "default",
        image_url: creature.image_url,
      },
      rollType: "Initiative",
      title: "Initiative",
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.initiative),
      rollResult,
      fields,
      useCharacterAvatar: true,
    });

    return total;
  } catch (error) {
    console.error("Error rolling creature initiative:", error);
    return null;
  }
};

export const rollCreatureSavingThrow = async ({
  creature,
  abilityName,
  abilityKey,
  savingThrowModifier,
  showRollResult,
  ownerCharacter,
}) => {
  try {
    const roller = new DiceRoller();
    const roll = roller.roll("1d20");
    const d20Value = roll.total;
    const total = d20Value + savingThrowModifier;

    const isCriticalSuccess = d20Value === 20;
    const isCriticalFailure = d20Value === 1;

    if (showRollResult) {
      showRollResult({
        title: `${abilityName} Save`,
        rollValue: d20Value,
        modifier: savingThrowModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "save",
        description: `Rolling ${abilityName} saving throw for ${creature.name}`,
      });
    }

    const rollResult = {
      d20Roll: d20Value,
      modifier: savingThrowModifier,
      total: total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const fields = [];
    if (ownerCharacter) {
      fields.push({
        name: "Belongs to",
        value: ownerCharacter.name,
        inline: true,
      });
    }

    await sendDiscordRollWebhook({
      character: {
        name: creature.name,
        gameSession: creature.gameSession || "default",
        image_url: creature.image_url,
      },
      rollType: "Saving Throw",
      title: `${abilityName} Save`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.SAVE),
      rollResult,
      fields,
      useCharacterAvatar: true,
    });

    return total;
  } catch (error) {
    console.error("Error rolling creature saving throw:", error);
    return null;
  }
};

export const rollCreatureAbility = async ({
  creature,
  abilityName,
  abilityKey,
  abilityModifier,
  showRollResult,
  ownerCharacter,
}) => {
  try {
    const roller = new DiceRoller();
    const roll = roller.roll("1d20");
    const d20Value = roll.total;
    const total = d20Value + abilityModifier;

    const isCriticalSuccess = d20Value === 20;
    const isCriticalFailure = d20Value === 1;

    if (showRollResult) {
      showRollResult({
        title: `${abilityName} Check`,
        rollValue: d20Value,
        modifier: abilityModifier,
        total: total,
        isCriticalSuccess,
        isCriticalFailure,
        type: "ability",
        description: `Rolling ${abilityName} check for ${creature.name}`,
      });
    }

    const rollResult = {
      d20Roll: d20Value,
      modifier: abilityModifier,
      total: total,
      isCriticalSuccess,
      isCriticalFailure,
    };

    const fields = [];
    if (ownerCharacter) {
      fields.push({
        name: "Belongs to",
        value: ownerCharacter.name,
        inline: true,
      });
    }

    await sendDiscordRollWebhook({
      character: {
        name: creature.name,
        gameSession: creature.gameSession || "default",
        image_url: creature.image_url,
      },
      rollType: "Ability Check",
      title: `${abilityName} Check`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(rollResult, ROLL_COLORS.ABILITY),
      rollResult,
      fields,
      useCharacterAvatar: true,
    });

    return total;
  } catch (error) {
    console.error("Error rolling creature ability:", error);
    return null;
  }
};

export const rollCreatureAttackOnly = async ({
  creature,
  attack,
  showRollResult,
  ownerCharacter,
}) => {
  try {
    const roller = new DiceRoller();
    const attackRoll = roller.roll("1d20");
    const d20Value = attackRoll.total;
    const attackBonus = parseInt(attack.attack_bonus) || 0;
    const attackTotal = d20Value + attackBonus;

    const isCriticalSuccess = d20Value === 20;
    const isCriticalFailure = d20Value === 1;

    if (showRollResult) {
      showRollResult({
        title: `${attack.name} - Attack Roll`,
        rollValue: d20Value,
        modifier: attackBonus,
        total: attackTotal,
        isCriticalSuccess,
        isCriticalFailure,
        type: "damage",
        description: `${creature.name} attacks with ${attack.name}`,
      });
    }

    const fields = [];

    if (ownerCharacter) {
      fields.push({
        name: "Belongs to",
        value: ownerCharacter.name,
        inline: true,
      });
    }

    if (attack.reach) {
      fields.push({
        name: "Reach",
        value: `${attack.reach} ft.`,
        inline: true,
      });
    }

    if (attack.description) {
      fields.push({
        name: "Special",
        value: attack.description,
        inline: false,
      });
    }

    const attackRollResult = {
      d20Roll: d20Value,
      modifier: attackBonus,
      total: attackTotal,
      isCriticalSuccess,
      isCriticalFailure,
    };

    await sendDiscordRollWebhook({
      character: {
        name: creature.name,
        gameSession: creature.gameSession || "default",
        image_url: creature.image_url,
      },
      rollType: "Attack Roll",
      title: `${attack.name} - Attack Roll`,
      description: isCriticalSuccess
        ? "Natural 20!"
        : isCriticalFailure
        ? "Natural 1!"
        : "",
      embedColor: getRollResultColor(attackRollResult, ROLL_COLORS.DAMAGE),
      rollResult: attackRollResult,
      fields,
      useCharacterAvatar: true,
    });

    return attackTotal;
  } catch (error) {
    console.error("Error rolling creature attack:", error);
    return null;
  }
};

export const rollCreatureDamage = async ({
  creature,
  attack,
  isCritical = false,
  showRollResult,
  ownerCharacter,
}) => {
  try {
    const roller = new DiceRoller();

    let damageFormula = "";
    let damageTotal = 0;

    if (attack.damage_quantity && attack.damage_die) {
      const damageQuantity = parseInt(attack.damage_quantity) || 1;
      const damageDie = attack.damage_die;
      const damageModifier = parseInt(attack.damage_modifier) || 0;

      damageFormula = `${damageQuantity}${damageDie}`;
      if (damageModifier !== 0) {
        damageFormula +=
          damageModifier > 0
            ? ` + ${damageModifier}`
            : ` - ${Math.abs(damageModifier)}`;
      }

      const damageDiceCount = isCritical ? damageQuantity * 2 : damageQuantity;
      const damageRoll = roller.roll(`${damageDiceCount}${damageDie}`);
      damageTotal = damageRoll.total + damageModifier;
    } else if (attack.damage_dice) {
      damageFormula = attack.damage_dice;
      const damageRoll = roller.roll(damageFormula);
      damageTotal = damageRoll.total;
    }

    if (showRollResult) {
      showRollResult({
        title: `${attack.name} - Damage`,
        rollValue: damageTotal,
        modifier: 0,
        total: damageTotal,
        isCriticalSuccess: isCritical,
        isCriticalFailure: false,
        type: "damage",
        description: `${creature.name} ${attack.name} damage${
          isCritical ? " (CRITICAL)" : ""
        }`,
      });
    }

    const fields = [];

    if (ownerCharacter) {
      fields.push({
        name: "Belongs to",
        value: ownerCharacter.name,
        inline: true,
      });
    }

    let damageDescription = `${damageFormula}`;
    if (isCritical) {
      damageDescription += ` (Critical Hit - doubled dice!)`;
    }

    fields.push({
      name: "💥 Damage Roll",
      value: `**${damageTotal}** ${
        attack.damage_type || ""
      } damage\n_${damageDescription}_`,
      inline: false,
    });

    if (attack.description) {
      fields.push({
        name: "Special",
        value: attack.description,
        inline: false,
      });
    }

    await sendDiscordRollWebhook({
      character: {
        name: creature.name,
        gameSession: creature.gameSession || "default",
        image_url: creature.image_url,
      },
      rollType: "Damage Roll",
      title: `${attack.name} - Damage`,
      description: isCritical ? "Critical Hit - Damage Doubled!" : "",
      embedColor: ROLL_COLORS.DAMAGE,
      rollResult: null,
      fields,
      useCharacterAvatar: true,
    });

    return damageTotal;
  } catch (error) {
    console.error("Error rolling creature damage:", error);
    return null;
  }
};
