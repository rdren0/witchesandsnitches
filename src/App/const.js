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

// --- Export-only lockdown mode -------------------------------------------
// When active, the site is locked to the data-export page only: players can
// sign in with Discord to download a backup of their characters, but every
// other feature/route is disabled.
//
// Defaults by environment so production stays locked while local dev keeps the
// full app:
//   • deployed site   -> export-only ON
//   • localhost dev   -> export-only OFF (full standard app)
// On localhost you can flip it at runtime with the toggle in the header (it
// stores an override in localStorage), or set ?export=1 / ?export=0 in the URL.
const isLocalhost =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

const EXPORT_OVERRIDE_KEY = "wsExportOnlyOverride";
const DEFAULT_EXPORT_ONLY = !isLocalhost;

// Allow ?export=1 / ?export=0 to set the override (handy for quick previews).
if (typeof window !== "undefined") {
  const param = new URLSearchParams(window.location.search).get("export");
  if (param === "1") window.localStorage.setItem(EXPORT_OVERRIDE_KEY, "true");
  else if (param === "0")
    window.localStorage.setItem(EXPORT_OVERRIDE_KEY, "false");
}

// Only allow manual toggling during local development.
export const canToggleExportMode = isLocalhost;

export const isExportOnlyMode = () => {
  if (typeof window === "undefined") return DEFAULT_EXPORT_ONLY;
  const override = window.localStorage.getItem(EXPORT_OVERRIDE_KEY);
  if (override === "true") return true;
  if (override === "false") return false;
  return DEFAULT_EXPORT_ONLY;
};

export const setExportOnlyMode = (value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPORT_OVERRIDE_KEY, value ? "true" : "false");
};

export const LOCAL_HOST = "http://localhost:3000";
export const WEBSITE = "https://witchesandsnitches.com";

export const RULE_BOOK_URL =
  "https://docs.google.com/document/d/1BY7U9mYLQD_p9O9e42AYLHG2Xr6ZCsR8Ye07MaGXfVw/edit?tab=t.0#heading=h.frfwms2htyde";
