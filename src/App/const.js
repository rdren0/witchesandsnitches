export const gameSessionOptions = [
  "Sunday - Knights",
  "Sunday - Haunting",
  "Monday - Haunting",
  "Tuesday - Knights",
  "Tuesday - Haunting",
  "Wednesday - Haunting",
  "Thursday - Knights",
  "Friday - Knights",
  "Friday - Haunting",
  "Saturday - Haunting",
  "Saturday - Knights AM",
  "Saturday - Knights PM",
  "DEVELOPMENT",
  "Jaguaras",
];

export const DISCORD_WEBHOOKS = {
  "Sunday - Knights": process.env.REACT_APP_DISCORD_WEBHOOK_SUNDAY_KNIGHTS,
  "Sunday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_SUNDAY_HAUNTING,
  "Monday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_MONDAY_HAUNTING,
  "Tuesday - Knights": process.env.REACT_APP_DISCORD_WEBHOOK_TUESDAY_KNIGHTS,
  "Tuesday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_TUESDAY_HAUNTING,
  "Wednesday - Haunting":
    process.env.REACT_APP_DISCORD_WEBHOOK_WEDNESDAY_HAUNTING,
  "Thursday - Knights": process.env.REACT_APP_DISCORD_WEBHOOK_THURSDAY_KNIGHTS,
  "Friday - Knights": process.env.REACT_APP_DISCORD_WEBHOOK_FRIDAY_KNIGHTS,
  "Friday - Haunting": process.env.REACT_APP_DISCORD_WEBHOOK_FRIDAY_HAUNTING,
  "Saturday - Haunting":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_HAUNTING,
  "Saturday - Knights AM":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_KNIGHTS_AM,
  "Saturday - Knights PM":
    process.env.REACT_APP_DISCORD_WEBHOOK_SATURDAY_KNIGHTS_PM,
  DEVELOPMENT: process.env.REACT_APP_DISCORD_WEBHOOK_DEVELOPMENT,
  FALLBACK: process.env.REACT_APP_DISCORD_WEBHOOK_FALLBACK,
};

export const getDiscordWebhook = (gameSession) =>
  gameSession
    ? DISCORD_WEBHOOKS[gameSession] ?? DISCORD_WEBHOOKS.FALLBACK
    : DISCORD_WEBHOOKS.FALLBACK;

export const LOCAL_HOST = "http://localhost:3000";
export const WEBSITE = "https://witchesandsnitches.com";

export const RULE_BOOK_URL =
  "https://docs.google.com/document/d/1BY7U9mYLQD_p9O9e42AYLHG2Xr6ZCsR8Ye07MaGXfVw/edit?tab=t.0#heading=h.frfwms2htyde";
