import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { slugifyName } from "../utils/helpers";

export function useSyncCharacterToUrl({
  selectedCharacter,
  isInitializing,
  characters,
  charactersLoading,
  loading,
  user,
  hasAttemptedLoad,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect bare /character to /character/sheet
  useEffect(() => {
    if (location.pathname === "/character") {
      navigate("/character/sheet", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Sync selected character id/name into the URL
  useEffect(() => {
    if (isInitializing || !selectedCharacter?.id || !selectedCharacter?.name)
      return;
    if (!location.pathname.startsWith("/character/")) return;

    const sectionMatch = location.pathname.match(/^\/character\/([^/]+)/);
    if (!sectionMatch) return;
    const section = sectionMatch[1];

    const targetPath = `/character/${section}/${selectedCharacter.id}/${slugifyName(selectedCharacter.name)}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [
    selectedCharacter?.id,
    selectedCharacter?.name,
    location.pathname,
    isInitializing,
    navigate,
  ]);

  // Redirect to home if on a character route but no characters exist
  useEffect(() => {
    if (
      location.pathname.startsWith("/character/") &&
      characters.length === 0 &&
      !charactersLoading &&
      !loading &&
      user &&
      hasAttemptedLoad
    ) {
      navigate("/", { replace: true });
    }
  }, [
    location.pathname,
    characters.length,
    charactersLoading,
    loading,
    navigate,
    user,
    hasAttemptedLoad,
  ]);
}
