import { BookIcon, UserIcon, TrashIcon, StarIcon } from "../../icons";

import { getStyles } from "./styles";
import { useTheme } from "../../contexts/ThemeContext";
export const SavedCharacters = ({
  isLoading,
  savedCharacters,
  deleteCharacter,
  editCharacter,
  maxCharacters,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <>
      <h2 style={styles.sectionHeader}>
        <BookIcon />
        Saved Characters ({savedCharacters.length}/{maxCharacters})
        {isLoading && (
          <span style={{ fontSize: "14px", color: "#6B7280" }}>
            {" "}
            (Loading...)
          </span>
        )}
      </h2>
      {savedCharacters.length === 0 && !isLoading ? (
        <div style={styles.emptyCharacters}>
          No characters created yet. Create your first character!
        </div>
      ) : (
        <div style={styles.charactersContainer}>
          {savedCharacters.map((char) => (
            <div key={char.id} style={styles.characterCard}>
              <div style={styles.characterHeader}>
                <div>
                  <h3 style={styles.characterName}>{char.name}</h3>
                  <div style={styles.characterDetails}>
                    {char.gameSession && (
                      <div
                        style={{
                          ...styles.heritage,
                          color: "#8B5CF6",
                          fontWeight: "bold",
                        }}
                      >
                        📅 {char.gameSession}
                      </div>
                    )}
                    {char.innateHeritage && (
                      <div style={styles.heritage}>
                        <StarIcon
                          style={{ display: "inline", marginRight: "4px" }}
                        />{" "}
                        {char.innateHeritage}
                      </div>
                    )}
                    <div>
                      <strong>Level:</strong> {char.level} |{" "}
                      <strong>HP:</strong> {char.hitPoints}
                    </div>
                    <div>
                      <strong>House:</strong> {char.house}
                    </div>
                    <div>
                      <strong>Class:</strong> {char.castingStyle}
                    </div>
                    <div>
                      <strong>Subclass:</strong> {char.subclass}
                    </div>
                  </div>
                </div>
                <div style={styles.characterActions}>
                  <button
                    onClick={() => editCharacter(char)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#3B82F6",
                    }}
                  >
                    <UserIcon />
                  </button>
                  <button
                    onClick={() => deleteCharacter(char.id)}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: "#EF4444",
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
              {char.standardFeats.length > 0 && (
                <div style={styles.feats}>
                  <strong>Feats:</strong>{" "}
                  {char.standardFeats.slice(0, 3).join(", ")}
                  {char.standardFeats.length > 3 &&
                    ` +${char.standardFeats.length - 3} more`}
                </div>
              )}

              {char.skillProficiencies &&
                char.skillProficiencies.length > 0 && (
                  <div style={styles.skills}>
                    <strong>
                      Skill Proficiencies ({char.skillProficiencies.length}
                      ):
                    </strong>{" "}
                    {char.skillProficiencies.slice(0, 4).join(", ")}
                    {char.skillProficiencies.length > 4 &&
                      ` +${char.skillProficiencies.length - 4} more`}
                  </div>
                )}
              {char.magicModifiers &&
                Object.values(char.magicModifiers).some((mod) => mod !== 0) && (
                  <div style={styles.skills}>
                    <strong>Magic Modifiers:</strong>{" "}
                    {Object.entries(char.magicModifiers)
                      .filter(([_, value]) => value !== 0)
                      .map(([key, value], index, array) => (
                        <>
                          <br />
                          <span key={key}>
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                            : {value > 0 ? "+" : ""}
                            {value}
                            {index < array.length - 1 ? ", " : ""}
                          </span>
                        </>
                      ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
