import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { SubjectCard } from "./SubjectCard";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedSpellBookStyles } from "../../styles/masterStyles";

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
  const [searchTerm, setSearchTerm] = useState("");

  const discordUserId = user?.user_metadata?.provider_id;

  // Reset spell attempts and critical successes when character changes
  useEffect(() => {
    setSpellAttempts({});
    setCriticalSuccesses({});
  }, [selectedCharacter?.id]);

  // Filter spells based on search term
  const getFilteredSpellsData = () => {
    if (!searchTerm.trim()) {
      return spellsData;
    }

    const filteredData = {};
    const lowerSearchTerm = searchTerm.toLowerCase();

    Object.entries(spellsData).forEach(([subjectName, subjectData]) => {
      const filteredLevels = {};
      let hasMatchingSpells = false;

      Object.entries(subjectData.levels).forEach(([level, spells]) => {
        const filteredSpells = spells.filter((spell) => {
          return (
            spell.name.toLowerCase().includes(lowerSearchTerm) ||
            spell.description?.toLowerCase().includes(lowerSearchTerm) ||
            spell.level?.toLowerCase().includes(lowerSearchTerm) ||
            level.toLowerCase().includes(lowerSearchTerm) ||
            subjectName.toLowerCase().includes(lowerSearchTerm) ||
            spell.castingTime?.toLowerCase().includes(lowerSearchTerm) ||
            spell.range?.toLowerCase().includes(lowerSearchTerm) ||
            spell.duration?.toLowerCase().includes(lowerSearchTerm) ||
            spell.tags?.some((tag) =>
              tag.toLowerCase().includes(lowerSearchTerm)
            )
          );
        });

        if (filteredSpells.length > 0) {
          filteredLevels[level] = filteredSpells;
          hasMatchingSpells = true;
        }
      });

      if (hasMatchingSpells) {
        filteredData[subjectName] = {
          ...subjectData,
          levels: filteredLevels,
        };
      }
    });

    return filteredData;
  };

  const getTotalSpells = (dataSource = spellsData) => {
    return Object.values(dataSource).reduce((total, subject) => {
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
    return Object.keys(spellAttempts).filter((spellName) => {
      const attempts = spellAttempts[spellName] || {};
      return Object.values(attempts).filter(Boolean).length >= 2;
    }).length;
  };

  const filteredSpellsData = getFilteredSpellsData();
  const totalSpells = getTotalSpells();
  const totalFilteredSpells = getTotalSpells(filteredSpellsData);
  const totalMastered = getTotalMastered();

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Auto-expand all subjects when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const currentFilteredData = getFilteredSpellsData();
      const newExpandedSubjects = {};
      Object.keys(currentFilteredData).forEach((subjectName) => {
        newExpandedSubjects[subjectName] = true;
      });
      setExpandedSubjects(newExpandedSubjects);
    }
    // eslint-disable-next-line
  }, [searchTerm]);

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

      <div style={styles.searchContainer}>
        <div style={styles.searchInputContainer}>
          <Search
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Search spells by name, description, level, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={styles.searchClearButton}
              title="Clear search"
            >
              <X size={16} color={theme.textSecondary} />
            </button>
          )}
        </div>
        {searchTerm && (
          <div style={styles.searchResults}>
            Showing {totalFilteredSpells} of {totalSpells} spells
            {totalFilteredSpells < totalSpells && (
              <span style={styles.searchResultsHint}>
                {" "}
                • Try different keywords to find more spells
              </span>
            )}
          </div>
        )}
      </div>

      <div style={styles.statsContainer}>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#60a5fa" }}
          ></span>
          {searchTerm ? totalFilteredSpells : totalSpells}{" "}
          {searchTerm ? "Found" : "Total"} Spells
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

      {searchTerm && Object.keys(filteredSpellsData).length === 0 && (
        <div style={styles.noResultsContainer}>
          <div style={styles.noResultsIcon}>🔍</div>
          <h3 style={styles.noResultsTitle}>No spells found</h3>
          <p style={styles.noResultsMessage}>
            No spells match your search for "<strong>{searchTerm}</strong>".
            <br />
            Try searching for:
          </p>
          <ul style={styles.searchSuggestions}>
            <li>Spell names (e.g., "Alohomora", "Expelliarmus")</li>
            <li>Spell descriptions or effects</li>
            <li>Subjects (e.g., "Charms", "Transfiguration")</li>
            <li>Spell levels (e.g., "Cantrip", "1st Level")</li>
            <li>Casting properties (e.g., "Touch", "Concentration")</li>
          </ul>
          <button onClick={clearSearch} style={styles.clearSearchButton}>
            Clear Search
          </button>
        </div>
      )}

      <div style={styles.subjectsGrid}>
        {Object.entries(filteredSpellsData).map(
          ([subjectName, subjectData]) => (
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
              searchTerm={searchTerm}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SpellBook;
