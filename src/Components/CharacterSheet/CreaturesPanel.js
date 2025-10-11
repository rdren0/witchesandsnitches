import React from "react";
import Creatures from "../Creatures/Creatures";

const CreaturesPanel = ({ supabase, user, selectedCharacter }) => {
  return (
    <Creatures
      supabase={supabase}
      user={user}
      characters={selectedCharacter ? [selectedCharacter] : []}
      selectedCharacter={selectedCharacter}
    />
  );
};

export default CreaturesPanel;
