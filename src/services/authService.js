import { supabase } from "../lib/supabase";

export const authService = {
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },

  async signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async fetchUsername(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("discord_user_id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data?.username ?? null;
  },

  async upsertUsername(user, newUsername) {
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("discord_user_id", user.id)
      .maybeSingle();

    if (existingProfile) {
      const { error } = await supabase
        .from("user_profiles")
        .update({ username: newUsername, updated_at: new Date().toISOString() })
        .eq("discord_user_id", user.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("user_profiles").insert([
        {
          discord_user_id: user.id,
          username: newUsername,
          discord_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
        },
      ]);
      if (error) throw error;
    }

    const providerDiscordId = user.user_metadata?.provider_id;
    if (providerDiscordId) {
      await supabase
        .from("discord_users")
        .update({ display_name: newUsername })
        .eq("discord_user_id", providerDiscordId);
    }
  },
};
