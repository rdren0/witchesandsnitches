import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [customUsername, setCustomUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const loadingUsernameRef = useRef(false);

  useEffect(() => {
    authService.getSession().then((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const subscription = authService.onAuthStateChange((_event, session) => {
      setUser((prev) => {
        const newUser = session?.user ?? null;
        if (prev?.id === newUser?.id) return prev;
        return newUser;
      });
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCustomUsername = useCallback(async () => {
    if (!user) return;
    if (loadingUsernameRef.current) return;

    loadingUsernameRef.current = true;

    try {
      const username = await authService.fetchUsername(user.id);
      if (username) {
        setCustomUsername(username);
      } else if (!sessionStorage.getItem("skipNamePrompt")) {
        setShowNamePrompt(true);
      }
    } catch (error) {
      console.error("Error loading custom username:", error);
    } finally {
      loadingUsernameRef.current = false;
    }
  }, [user]);

  const updateCustomUsername = async (newUsername) => {
    if (!user) return;
    try {
      await authService.upsertUsername(user, newUsername);
      setCustomUsername(newUsername);
    } catch (error) {
      console.error("Error updating custom username:", error);
      throw error;
    }
  };

  const signInWithDiscord = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithDiscord();
    } catch (err) {
      console.error("Error signing in:", err);
      setAuthError("Failed to sign in. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await authService.signOut();
      setCustomUsername("");
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
      setAuthError("Failed to sign out. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleNamePromptSubmit = async (name) => {
    setIsSubmittingName(true);
    try {
      await updateCustomUsername(name);
      setShowNamePrompt(false);
    } finally {
      setIsSubmittingName(false);
    }
  };

  const handleNamePromptSkip = () => {
    sessionStorage.setItem("skipNamePrompt", "true");
    setShowNamePrompt(false);
  };

  return {
    user,
    customUsername,
    loading,
    authLoading,
    authError,
    showNamePrompt,
    isSubmittingName,
    signInWithDiscord,
    signOut,
    updateCustomUsername,
    loadCustomUsername,
    handleNamePromptSubmit,
    handleNamePromptSkip,
  };
}
