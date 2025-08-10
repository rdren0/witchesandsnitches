import { useNavigate } from "react-router-dom";
import CharacterSheet from "./CharacterSheet";

export const CharacterSheetWrapper = ({
  user,
  customUsername,
  supabase,
  selectedCharacter,
  characters,
  adminMode,
  isUserAdmin,
  characterSelector,
}) => {
  const navigate = useNavigate();

  const handleNavigateToCharacterManagement = (characterId, section) => {
    const sectionParam = section ? `?section=${section}` : "";
    navigate(`/character-management/edit/${characterId}${sectionParam}`);
  };

  return (
    <>
      {characterSelector}
      <CharacterSheet
        user={user}
        customUsername={customUsername}
        supabase={supabase}
        selectedCharacter={selectedCharacter}
        characters={characters}
        adminMode={adminMode}
        isUserAdmin={isUserAdmin}
        onNavigateToCharacterManagement={handleNavigateToCharacterManagement}
      />
    </>
  );
};

export default CharacterSheetWrapper;
