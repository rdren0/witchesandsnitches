import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { standardFeats as fallbackFeats } from "../SharedData/deprecated/standardFeatData";

const CACHE_KEY = "feats_cache";
const CACHE_TTL = 60 * 60 * 1000;

const FeatsContext = createContext(null);

function transformFeat(feat) {
  let description = [];
  if (feat.description) {
    if (typeof feat.description === "string") {
      description = JSON.parse(feat.description);
    } else if (Array.isArray(feat.description)) {
      description = feat.description.map((item) => {
        if (typeof item === "string") return item;
        return item.text || item;
      });
    } else {
      description = [feat.description];
    }
  }

  let benefits = {};
  if (feat.benefits) {
    if (typeof feat.benefits === "string") {
      benefits = JSON.parse(feat.benefits);
    } else {
      benefits = feat.benefits;
    }
  }

  const transformedBenefits = {
    skillProficiencies: benefits.skills || [],
    expertise: benefits.expertise || [],
    savingThrowProficiencies: benefits.saves || [],
    toolProficiencies: benefits.tools || [],
    resistances: benefits.resistances || [],
    immunities: benefits.immunities || [],
    speeds: benefits.speeds || {},
    combatBonuses: benefits.combat || {},
    spellcasting: benefits.spellcasting || {},
    specialAbilities: benefits.special || [],
  };

  if (benefits.asi) {
    transformedBenefits.abilityScoreIncrease = {
      type: benefits.asi.type || "specific",
      ability:
        benefits.asi.type === "spellcasting"
          ? "spellcasting_ability"
          : benefits.asi.abilities?.[0] || "choice",
      abilities: benefits.asi.abilities || [],
      amount: benefits.asi.amount || 1,
    };
  }

  return {
    name: feat.name,
    preview: feat.preview,
    description,
    benefits: transformedBenefits,
    prerequisites: feat.prerequisites
      ? typeof feat.prerequisites === "string"
        ? JSON.parse(feat.prerequisites)
        : feat.prerequisites
      : undefined,
    repeatable: feat.repeatable || false,
    repeatableKey: feat.repeatable_key || undefined,
  };
}

function getCachedFeats() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { feats, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_TTL;

    if (isExpired) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    return feats;
  } catch (e) {
    console.warn("Error reading feats cache:", e);
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedFeats(feats) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        feats,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn("Error saving feats cache:", e);
  }
}

export function clearFeatsCache() {
  sessionStorage.removeItem(CACHE_KEY);
}

export function FeatsProvider({ children }) {
  const [feats, setFeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchFeats = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedFeats = getCachedFeats();
      if (cachedFeats && cachedFeats.length > 0) {
        setFeats(cachedFeats);
        setLoading(false);
        setInitialized(true);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("feats")
        .select("*")
        .order("name");

      if (fetchError) throw fetchError;

      const transformedFeats = (data || []).map(transformFeat);

      setFeats(transformedFeats);
      setCachedFeats(transformedFeats);
    } catch (err) {
      console.error("Error fetching feats:", err);
      setError(err.message);

      const staleCache = sessionStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { feats: staleFeats } = JSON.parse(staleCache);
          if (staleFeats && staleFeats.length > 0) {
            setFeats(staleFeats);
            return;
          }
        } catch (e) {
          console.warn("Error reading stale cache:", e);
        }
      }

      console.warn("Using fallback local feat data");
      setFeats(fallbackFeats);
      setCachedFeats(fallbackFeats);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchFeats();
  }, []);

  const getFeatByName = (name) => {
    return feats.find((feat) => feat.name === name);
  };

  const searchFeats = (searchTerm) => {
    if (!searchTerm) return feats;
    const term = searchTerm.toLowerCase();
    return feats.filter(
      (feat) =>
        feat.name?.toLowerCase().includes(term) ||
        feat.preview?.toLowerCase().includes(term) ||
        feat.description?.some((desc) => desc.toLowerCase().includes(term))
    );
  };

  const getFeatsWithPrerequisites = () => {
    return feats.filter((feat) => feat.prerequisites);
  };

  const getRepeatableFeats = () => {
    return feats.filter((feat) => feat.repeatable);
  };

  const value = {
    feats,
    loading,
    error,
    initialized,
    refetch: () => fetchFeats(true),
    getFeatByName,
    searchFeats,
    getFeatsWithPrerequisites,
    getRepeatableFeats,
  };

  return (
    <FeatsContext.Provider value={value}>{children}</FeatsContext.Provider>
  );
}

export function useFeatsContext() {
  const context = useContext(FeatsContext);
  if (!context) {
    throw new Error("useFeatsContext must be used within a FeatsProvider");
  }
  return context;
}

export function useFeats() {
  const context = useContext(FeatsContext);

  if (!context) {
    throw new Error(
      "useFeats must be used within a FeatsProvider. " +
        "Make sure the app is wrapped with <FeatsProvider>."
    );
  }

  return context;
}

export function getFeatsSync() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return [];

    const { feats } = JSON.parse(cached);
    return feats || [];
  } catch (e) {
    console.warn("Error reading feats cache synchronously:", e);
    return [];
  }
}

export function getFeatByNameSync(name) {
  const feats = getFeatsSync();
  return feats.find((feat) => feat.name === name);
}

export default FeatsContext;
