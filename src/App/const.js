export const gameSessionOptions = [
  "One-Shot",
  "Monday - Haunting",
  "Tuesday - Haunting",
  "Thursday - Haunting",
  "Friday - Haunting",
  "Wednesday - Knights",
  "Friday - Knights",
  "Saturday - Haunting",
  "Saturday - Knights Morning",
  "Saturday - Knights Night",
  "DEVELOPMENT",
];

export const gameSessionGroups = {
  haunting: [
    "Monday - Haunting",
    "Tuesday - Haunting",
    "Thursday - Haunting",
    "Friday - Haunting",
    "Saturday - Haunting",
  ],
  knights: [
    "Wednesday - Knights",
    "Friday - Knights",
    "Saturday - Knights Morning",
    "Saturday - Knights Night",
  ],
  other: ["One-Shot"],
  development: ["DEVELOPMENT"],
};

export const DISCORD_WEBHOOKS = {
  "One-Shot": process.env.REACT_APP_DISCORD_WEBHOOK_ONE_SHOT,
  "Monday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_MONDAY_HAUNTING,
  "Tuesday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_TUESDAY_HAUNTING,
  "Thursday - Haunting":
    process.env.REACT_APP_DISCORD_WEBHOOK_WEDNESDAY_HAUNTING,
  "Friday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_FRIDAY_HAUNTING,
  "Saturday - Haunting":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_HAUNTING,
  "Wednesday - Knights":
    process.env.REACT_APP_DISCORD_WEBHOOK_WEDNESDAY_KNIGHTS,
  "Friday - Knights": process.env.REACT_APP_DISCORD_WEBHOOK_FRIDAY_KNIGHTS,
  "Saturday - Knights Morning":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_KNIGHTS_AM,
  "Saturday - Knights Night":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_KNIGHTS_PM,
  DEVELOPMENT: process.env.REACT_APP_DISCORD_WEBHOOK_DEVELOPMENT,
  FALLBACK: process.env.REACT_APP_DISCORD_WEBHOOK_FALLBACK,
};

export const getDiscordWebhook = (gameSession) =>
  gameSession
    ? (DISCORD_WEBHOOKS[gameSession] ?? DISCORD_WEBHOOKS.FALLBACK)
    : DISCORD_WEBHOOKS.FALLBACK;

export const LOCAL_HOST = "http://localhost:3000";
export const WEBSITE = "https://witchesandsnitches.com";

export const RULE_BOOK_URL =
  "https://docs.google.com/document/d/1BY7U9mYLQD_p9O9e42AYLHG2Xr6ZCsR8Ye07MaGXfVw/edit?tab=t.0#heading=h.frfwms2htyde";
