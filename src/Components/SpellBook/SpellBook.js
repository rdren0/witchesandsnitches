import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { SubjectCard } from "./SubjectCard";
import { useTheme } from "../../contexts/ThemeContext";
import { createThemedSpellBookStyles } from "../../styles/masterStyles";
import { hasSubclassFeature } from "./utils";

import { spellsData } from "./spells";
import { useCallback } from "react";
import CastingTiles from "../CharacterSheet/CastingTiles";

const SpellBook = ({ supabase, user, selectedCharacter, characters }) => {
  const { theme } = useTheme();
  const styles = createThemedSpellBookStyles(theme);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [error, setError] = useState(null);
  const [criticalSuccesses, setCriticalSuccesses] = useState({});
  const [spellAttempts, setSpellAttempts] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [researchedSpells, setResearchedSpells] = useState({});
  const [arithmancticTags, setArithmancticTags] = useState({});
  const [runicTags, setRunicTags] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    setSpellAttempts({});
    setCriticalSuccesses({});
    setFailedAttempts({});
    setResearchedSpells({});
    setArithmancticTags({});
    setRunicTags({});
  }, [selectedCharacter?.id]);

  const getAvailableSpellsData = useCallback(() => {
    let availableSpells = { ...spellsData };

    if (hasSubclassFeature(selectedCharacter, "Researcher")) {
      const jhcLevels = { ...availableSpells["Jinxes, Hexes & Curses"].levels };
      const cantrips = [...jhcLevels.Cantrips];

      const devictoIndex = cantrips.findIndex(
        (spell) => spell.name === "Devicto"
      );
      const enhancedDevicto = {
        name: "Devicto",
        level: "Cantrip",
        castingTime: "Action",
        range: "60 Feet",
        duration: "Instantaneous",
        year: 4,
        tags: ["Arithmantic", "Runic"],
        description:
          "An advanced hex that overwhelms the target with magical interference. The spell disrupts the target's concentration and magical abilities through a combination of mathematical precision and runic power. When enhanced through extensive study, this spell demonstrates the perfect fusion of analytical and symbolic magical theory.",
        higherLevels:
          "When you cast this spell using a spell slot of 1st level or higher, you can target one additional creature for each slot level above 0.",
        restriction: false,
        researcherEnhanced: true,
      };

      if (devictoIndex >= 0) {
        cantrips[devictoIndex] = enhancedDevicto;
      } else {
        cantrips.push(enhancedDevicto);
      }

      jhcLevels.Cantrips = cantrips;
      availableSpells["Jinxes, Hexes & Curses"] = {
        ...availableSpells["Jinxes, Hexes & Curses"],
        levels: jhcLevels,
      };
    }

    return availableSpells;
  }, [selectedCharacter]);

  const getFilteredSpellsData = useCallback(() => {
    const availableSpells = getAvailableSpellsData();

    if (!searchTerm.trim()) {
      return availableSpells;
    }

    const filteredData = {};
    const lowerSearchTerm = searchTerm.toLowerCase();

    Object.entries(availableSpells).forEach(([subjectName, subjectData]) => {
      const filteredLevels = {};
      let hasMatchingSpells = false;

      Object.entries(subjectData.levels).forEach(([level, spells]) => {
        const filteredSpells = spells.filter((spell) => {
          // Check inherent tags
          const hasInherentTag = spell.tags?.some((tag) =>
            tag.toLowerCase().includes(lowerSearchTerm)
          );

          // Check manually assigned tags
          const hasManualArithmancticTag =
            arithmancticTags[spell.name] &&
            "arithmantic".includes(lowerSearchTerm);
          const hasManualRunicTag =
            runicTags[spell.name] && "runic".includes(lowerSearchTerm);

          // Check if it's a researched spell with Researcher bonus (auto-tags)
          const isResearchedWithResearcher =
            researchedSpells[spell.name] &&
            hasSubclassFeature(selectedCharacter, "Researcher");
          const hasResearcherArithmancticTag =
            isResearchedWithResearcher &&
            "arithmantic".includes(lowerSearchTerm);
          const hasResearcherRunicTag =
            isResearchedWithResearcher && "runic".includes(lowerSearchTerm);

          return (
            spell.name.toLowerCase().includes(lowerSearchTerm) ||
            spell.description?.toLowerCase().includes(lowerSearchTerm) ||
            spell.level?.toLowerCase().includes(lowerSearchTerm) ||
            level.toLowerCase().includes(lowerSearchTerm) ||
            subjectName.toLowerCase().includes(lowerSearchTerm) ||
            spell.castingTime?.toLowerCase().includes(lowerSearchTerm) ||
            spell.range?.toLowerCase().includes(lowerSearchTerm) ||
            spell.duration?.toLowerCase().includes(lowerSearchTerm) ||
            hasInherentTag ||
            hasManualArithmancticTag ||
            hasManualRunicTag ||
            hasResearcherArithmancticTag ||
            hasResearcherRunicTag
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
  }, [
    searchTerm,
    getAvailableSpellsData,
    arithmancticTags,
    runicTags,
    researchedSpells,
    selectedCharacter,
  ]);

  const getTotalSpells = (dataSource = null) => {
    const sourceData = dataSource || getAvailableSpellsData();
    return Object.values(sourceData).reduce((total, subject) => {
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

  const getTotalResearched = () => {
    return Object.keys(researchedSpells).filter(
      (spellName) => researchedSpells[spellName]
    ).length;
  };

  const getTotalFailed = () => {
    return Object.keys(failedAttempts).filter(
      (spellName) => failedAttempts[spellName]
    ).length;
  };

  const getTotalEnhanced = () => {
    if (!hasSubclassFeature(selectedCharacter, "Researcher")) return 0;

    let enhancedCount = getTotalResearched();

    const availableSpells = getAvailableSpellsData();
    Object.values(availableSpells).forEach((subject) => {
      Object.values(subject.levels).forEach((spells) => {
        spells.forEach((spell) => {
          if (
            (spell.tags?.includes("Arithmantic") &&
              spell.tags?.includes("Runic")) ||
            (arithmancticTags[spell.name] && runicTags[spell.name])
          ) {
            if (!researchedSpells[spell.name]) {
              enhancedCount++;
            }
          }
        });
      });
    });

    return enhancedCount;
  };

  const filteredSpellsData = getFilteredSpellsData();
  const totalSpells = getTotalSpells();
  const totalFilteredSpells = getTotalSpells(filteredSpellsData);
  const totalMastered = getTotalMastered();
  const totalResearched = getTotalResearched();
  const totalFailed = getTotalFailed();
  const totalEnhanced = getTotalEnhanced();

  const clearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const currentFilteredData = getFilteredSpellsData();
      const newExpandedSubjects = {};
      Object.keys(currentFilteredData).forEach((subjectName) => {
        newExpandedSubjects[subjectName] = true;
      });
      setExpandedSubjects(newExpandedSubjects);
    }
  }, [searchTerm, getFilteredSpellsData]);

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
      <CastingTiles character={selectedCharacter} />

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

      {/* Show Researcher status banner */}
      {hasSubclassFeature(selectedCharacter, "Researcher") && (
        <div
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            color: "#8b5cf6",
            padding: "12px",
            borderRadius: "8px",
            margin: "16px 20px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📚 <strong>Researcher Active:</strong>
          <span style={{ fontWeight: "normal" }}>
            +
            {Math.floor(
              Math.floor((selectedCharacter.abilityScores.wisdom - 10) / 2) / 2
            )}{" "}
            to research checks, researched spells gain both Arithmantic and
            Runic tags, enhanced Devicto access
          </span>
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
          {totalResearched} Researched
        </span>
        <span style={styles.statItem}>
          <span
            style={{ ...styles.statDot, backgroundColor: "#ef4444" }}
          ></span>
          {totalFailed} Failed
        </span>
        {hasSubclassFeature(selectedCharacter, "Researcher") &&
          totalEnhanced > 0 && (
            <span style={styles.statItem}>
              <span
                style={{ ...styles.statDot, backgroundColor: "#d946ef" }}
              ></span>
              {totalEnhanced} Enhanced
            </span>
          )}
        <span style={styles.statItem}>
          {hasSubclassFeature(selectedCharacter, "Researcher") && (
            <span
              style={{
                marginLeft: "4px",
                fontSize: "12px",
                color: "#8b5cf6",
                fontWeight: "600",
              }}
            >
              📚
            </span>
          )}
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
            {hasSubclassFeature(selectedCharacter, "Researcher") && (
              <li>Tags (e.g., "Arithmantic", "Runic")</li>
            )}
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
              failedAttempts={failedAttempts}
              setFailedAttempts={setFailedAttempts}
              researchedSpells={researchedSpells}
              setResearchedSpells={setResearchedSpells}
              arithmancticTags={arithmancticTags}
              setArithmancticTags={setArithmancticTags}
              runicTags={runicTags}
              setRunicTags={setRunicTags}
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
