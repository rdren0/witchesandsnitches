import { useState, useEffect } from "react";

import { User } from "lucide-react";
import { styles } from "./styles";
import { characterService } from "../../services/characterService";
import { SubjectCard } from "./SubjectCard";

import { spellsData } from "./spells";

const SpellBook = ({ supabase, user, customUsername }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [spellAttempts, setSpellAttempts] = useState({});

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (discordUserId) {
      loadCharacters();
    }
    // eslint-disable-next-line
  }, [discordUserId]);

  const loadCharacters = async () => {
    if (!discordUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const charactersData = await characterService.getCharacters(
        discordUserId
      );

      const transformedCharacters = charactersData.map((char) => ({
        id: char.id,
        name: char.name,
        house: char.house,
        castingStyle: char.casting_style,
        subclass: char.subclass,
        innateHeritage: char.innate_heritage,
        background: char.background,
        level: char.level,
        hitPoints: char.hit_points,
        abilityScores: char.ability_scores,
        magicModifiers: char.magic_modifiers || {
          divinations: 0,
          charms: 0,
          transfiguration: 0,
          healing: 0,
          jinxesHexesCurses: 0,
        },
      }));

      setCharacters(transformedCharacters);

      if (!selectedCharacter && transformedCharacters.length > 0) {
        setSelectedCharacter(transformedCharacters[0]);
      }
    } catch (err) {
      setError("Failed to load characters: " + err.message);
      console.error("Error loading characters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalSpells = () => {
    return Object.values(spellsData).reduce((total, subject) => {
      return (
        total +
        Object.values(subject.levels).reduce(
          (levelTotal, spells) => levelTotal + spells.length,
          0
        )
      );
    }, 0);
  };

  const getTotalMastered = () => {
    return Object.keys(spellAttempts).filter((spell) => {
      const attempts = spellAttempts[spell] || {};
      return Object.values(attempts).filter(Boolean).length >= 2;
    }).length;
  };

  const totalSpells = getTotalSpells();
  const totalMastered = getTotalMastered();

  if (!user || !discordUserId) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#6B7280", marginBottom: "16px" }}>
          Authentication Required
        </h2>
        <p style={{ color: "#6B7280" }}>
          Please log in with Discord to access the spellbook.
        </p>
      </div>
    );
  }

  return (
    <div className="SpellBook">
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            flexWrap: "wrap",
          }}
        >
          <User size={24} color="#64748b" />
          <label
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Character:
          </label>
          <select
            value={selectedCharacter?.id || ""}
            onChange={(e) => {
              const char = characters.find(
                (c) => c.id === parseInt(e.target.value)
              );
              setSelectedCharacter(char);

              setSpellAttempts({});
              setCriticalSuccesses({});
            }}
            style={{
              padding: "8px 12px",
              fontSize: "16px",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              minWidth: "200px",
            }}
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? "Loading characters..." : "Select a character..."}
            </option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.castingStyle || "Unknown Class"}) - Level{" "}
                {char.level || "?"}
              </option>
            ))}
          </select>

          {selectedCharacter && (
            <div
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <span>✓ {selectedCharacter.name}</span>
              <span style={{ fontSize: "12px", opacity: 0.9 }}>
                {selectedCharacter.castingStyle} • Level{" "}
                {selectedCharacter.level} • {selectedCharacter.house}
              </span>
            </div>
          )}

          {characters.length === 0 && !isLoading && (
            <div
              style={{
                backgroundColor: "#fbbf24",
                color: "#92400e",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              No characters found. Create a character in the Character Creation
              tab first.
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "12px",
              borderRadius: "8px",
              margin: "16px 0",
              fontSize: "14px",
              maxWidth: "1200px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div style={styles.statsContainer}>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#60a5fa" }}
          ></span>
          {totalSpells} Total Spells
        </span>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#34d399" }}
          ></span>
          {totalMastered} Mastered
        </span>
        {selectedCharacter && (
          <span style={styles.statItem}>
            <span
              style={{ ...styles.statDot, backgroundColor: "#8b5cf6" }}
            ></span>
            Playing as {selectedCharacter.name}
          </span>
        )}
      </div>
      <div style={styles.subjectsGrid}>
        {Object.entries(spellsData).map(
          ([subjectName, subjectData]) => (
            <SubjectCard
              criticalSuccesses={criticalSuccesses}
              customUsername={customUsername}
              discordUserId={discordUserId}
              expandedSections={expandedSections}
              expandedSubjects={expandedSubjects}
              selectedCharacter={selectedCharacter}
              setCriticalSuccesses={setCriticalSuccesses}
              setError={setError}
              setExpandedSections={setExpandedSections}
              setExpandedSubjects={setExpandedSubjects}
              setSpellAttempts={setSpellAttempts}
              spellAttempts={spellAttempts}
              subjectData={subjectData}
              subjectName={subjectName}
              supabase={supabase}
              user={user}
            />
          )
          // renderSubjectCard(subjectName, subjectData)
        )}
      </div>
    </div>
  );
};

export default SpellBook;
