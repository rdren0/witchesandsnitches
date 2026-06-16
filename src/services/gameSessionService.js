import { supabase } from "../lib/supabase";

export const GAME_SESSION_CATEGORIES = [
  "haunting",
  "knights",
  "other",
  "development",
];

const getGameSessions = async ({ includeArchived = false } = {}) => {
  let query = supabase
    .from("game_sessions")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (!includeArchived) {
    query = query.eq("archived", false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch game sessions: ${error.message}`);
  }

  return data || [];
};

const createGameSession = async ({
  name,
  category = "other",
  discordWebhookUrl = null,
  sortOrder = 0,
}) => {
  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      name: name.trim(),
      category,
      discord_webhook_url: discordWebhookUrl?.trim() || null,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create game session: ${error.message}`);
  }

  return data;
};

const updateGameSession = async (id, fields) => {
  const payload = { updated_at: new Date().toISOString() };

  if (fields.name !== undefined) payload.name = fields.name.trim();
  if (fields.category !== undefined) payload.category = fields.category;
  if (fields.discordWebhookUrl !== undefined) {
    payload.discord_webhook_url = fields.discordWebhookUrl?.trim() || null;
  }
  if (fields.sortOrder !== undefined) payload.sort_order = fields.sortOrder;
  if (fields.webhookVerified !== undefined) {
    payload.webhook_verified = fields.webhookVerified;
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update game session: ${error.message}`);
  }

  return data;
};

/**
 * Renames a session and cascades the new name onto every character that stores
 * the session as a string. Returns the count of characters that were moved so
 * the UI can confirm the impact. (Downtime sheets derive their session from the
 * joined character row, so no separate cascade is needed there.)
 */
const renameGameSession = async (id, oldName, fields) => {
  const newName = fields.name.trim();
  const session = await updateGameSession(id, fields);

  if (newName !== oldName) {
    const { data: movedCharacters, error: charError } = await supabase
      .from("characters")
      .update({ game_session: newName })
      .eq("game_session", oldName)
      .select("id");

    if (charError) {
      throw new Error(
        `Session renamed, but updating characters failed: ${charError.message}`
      );
    }

    return { session, charactersUpdated: movedCharacters?.length || 0 };
  }

  return { session, charactersUpdated: 0 };
};

const archiveGameSession = async (id) => {
  const { data, error } = await supabase
    .from("game_sessions")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to archive game session: ${error.message}`);
  }

  return data;
};

/** Marks a session's webhook as verified (or not) after a successful test. */
const setGameSessionVerified = async (id, verified = true) => {
  const { data, error } = await supabase
    .from("game_sessions")
    .update({ webhook_verified: verified, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update verification status: ${error.message}`);
  }

  return data;
};

/**
 * Posts a test message to a session's Discord webhook. Returns true on success.
 * Throws with a friendly message if the webhook is missing or rejected.
 */
const sendTestMessage = async (session) => {
  const url = session?.discord_webhook_url;
  if (!url) {
    throw new Error("This session has no Discord webhook URL set yet.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "🎲 Game Session created",
          description: `This channel is now ready for **${session.name}**!`,
          color: 0x7c3aed,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Discord rejected the test message. Double-check the webhook URL."
    );
  }

  return true;
};

/** Counts characters currently assigned to a session name (for confirm dialogs). */
const countCharactersInSession = async (sessionName) => {
  const { count, error } = await supabase
    .from("characters")
    .select("id", { count: "exact", head: true })
    .eq("game_session", sessionName)
    .eq("active", true);

  if (error) {
    console.warn("Failed to count characters in session:", error);
    return 0;
  }

  return count || 0;
};

export const gameSessionService = {
  getGameSessions,
  createGameSession,
  updateGameSession,
  renameGameSession,
  archiveGameSession,
  setGameSessionVerified,
  sendTestMessage,
  countCharactersInSession,
};
