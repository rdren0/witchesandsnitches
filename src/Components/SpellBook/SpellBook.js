import { useState, useEffect } from "react";
import { SubjectCard } from "./SubjectCard";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedSpellBookStyles } from "./styles";

import { spellsData } from "./spells";

const SpellBook = ({
  supabase,
  user,
  customUsername,
  selectedCharacter,
  characters,
}) => {
  const { theme } = useTheme();
  const styles = createThemedSpellBookStyles(theme);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [error, setError] = useState(null);
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [spellAttempts, setSpellAttempts] = useState({});

  const discordUserId = user?.user_metadata?.provider_id;

  // Reset spell attempts and critical successes when character changes
  useEffect(() => {
    setSpellAttempts({});
    setCriticalSuccesses({});
  }, [selectedCharacter?.id]);

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

  if (characters.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#6B7280", marginBottom: "16px" }}>
          No Characters Found
        </h2>
        <p style={{ color: "#6B7280" }}>
          You haven't created any characters yet. Create a character in the
          Character Creation tab first.
        </p>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#6B7280", marginBottom: "16px" }}>
          No Character Selected
        </h2>
        <p style={{ color: "#6B7280" }}>
          Please select a character from the dropdown above to access their
          spellbook.
        </p>
      </div>
    );
  }

  return (
    <div className="SpellBook">
      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "8px",
            margin: "16px 20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

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
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#8b5cf6" }}
          ></span>
          Playing as {selectedCharacter.name}
        </span>
      </div>

      <div style={styles.subjectsGrid}>
        {Object.entries(spellsData).map(([subjectName, subjectData]) => (
          <SubjectCard
            key={subjectName}
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
        ))}
      </div>
    </div>
  );
};

export default SpellBook;
