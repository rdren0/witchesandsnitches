import { getDiscordWebhook } from "../../App/const";

export const sendDiscordRollWebhook = async ({
  character,
  rollType,
  title,
  description = "",
  embedColor,
  fields = [],
  rollResult = null,
  useCharacterAvatar = false,
  additionalData = {},
}) => {
  try {
    const discordWebhookUrl = getDiscordWebhook(character?.gameSession);

    if (!discordWebhookUrl) {
      console.error("Discord webhook URL not configured");
      return false;
    }

    const characterName = character?.name || "Unknown Character";
    const enhancedTitle = `${characterName}: ${title}`;

    const embed = {
      title: enhancedTitle,
      description: description || "",
      color: embedColor,
      fields: [...fields],
      footer: {
        text: `${character.name} - Witches and Snitches`,
      },
      timestamp: new Date().toISOString(),
    };

    if (character?.imageUrl) {
      embed.thumbnail = {
        url: character.imageUrl,
      };
    } else if (character?.image_url) {
      embed.thumbnail = {
        url: character.image_url,
      };
    }

    if (rollResult) {
      const {
        d20Roll,
        modifier,
        total,
        isCriticalSuccess,
        isCriticalFailure,
        customRoll,
        rollDetailsDisplay,
      } = rollResult;

      let rollDescription;
      if (rollDetailsDisplay) {
        rollDescription = `\`${rollDetailsDisplay}\``;
      } else {
        const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        rollDescription = `\`${d20Roll}${modifierText}=${total}\``;
      }

      if (isCriticalSuccess) {
        embed.description += "\n\n✨ **Critical Success!**";
      } else if (isCriticalFailure) {
        embed.description += "\n\n💀 **Critical Failure!**";
      }

      embed.fields.unshift({
        name: "Roll Details",
        value: rollDescription,
        inline: false,
      });

      embed.fields.unshift({
        name: "",
        value: `**${total}**`,
        inline: false,
      });
    }

    const message = {
      embeds: [embed],
    };

    Object.assign(message, additionalData);

    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending Discord webhook:", error);
    return false;
  }
};

export const getRollResultColor = (result, defaultColor = 0x6b7280) => {
  const { isCriticalSuccess, isCriticalFailure, isSuccess } = result;

  if (isCriticalSuccess) return 0xffd700;
  if (isCriticalFailure) return 0xff0000;
  if (isSuccess !== undefined) {
    return isSuccess ? 0x00ff00 : 0xff0000;
  }

  return defaultColor;
};

export const getRollResultText = (result) => {
  const { isCriticalSuccess, isCriticalFailure, isSuccess, d20Roll } = result;

  if (isCriticalSuccess) {
    return `**${d20Roll}** - ⭐ CRITICAL SUCCESS!`;
  }
  if (isCriticalFailure) {
    return `**${d20Roll}** - 💥 CRITICAL FAILURE!`;
  }
  if (isSuccess !== undefined) {
    return isSuccess ? "✅ SUCCESS" : "❌ FAILED";
  }

  return "";
};

export const buildModifierBreakdownField = (modifierInfo) => {
  const {
    abilityName,
    abilityModifier,
    wandType,
    wandModifier,
    additionalModifiers = [],
  } = modifierInfo;

  let breakdown = `${abilityName}: ${
    abilityModifier >= 0 ? "+" : ""
  }${abilityModifier}`;

  if (wandModifier !== 0) {
    breakdown += `\nWand (${wandType}): ${
      wandModifier >= 0 ? "+" : ""
    }${wandModifier}`;
  }

  additionalModifiers.forEach(({ name, value, description }) => {
    breakdown += `\n${name}: ${value >= 0 ? "+" : ""}${value}`;
    if (description) breakdown += ` (${description})`;
  });

  return {
    name: "Modifier Breakdown",
    value: breakdown,
    inline: false,
  };
};

export const ROLL_COLORS = {
  ability: 0x20b7b0,
  initiative: 0x107319,
  skill: 0x6600cc,
  spell: 0x3b82f6,
  hitdice: 0x9d4edd,
  damage: 0xef4444,
  heal: 0x10b981,
  saving_throw: 0x8b5cf6,
  research: 0x10b981,
  flexible: 0xf59e0b,
  potion: 0x6b46c1,
  recipe: 0x8b5cf6,
  generic: 0xff9e3d,
  magic_casting: 0x9d4edd,
  corruption: 0x1f2937,
};
