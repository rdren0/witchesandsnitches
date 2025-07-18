import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
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
  const [attemptFilter, setAttemptFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const discordUserId = user?.user_metadata?.provider_id;

  const attemptFilterOptions = [
    { value: "all", label: "All Spells" },
    { value: "unattempted", label: "Unattempted" },
    { value: "attempted", label: "Attempted" },
    { value: "mastered", label: "Mastered (2+ successes)" },
    { value: "failed", label: "Failed" },
    { value: "researched", label: "Researched" },
  ];

  const getAvailableSpellsData = useCallback(() => ({ ...spellsData }), []);

  const getAvailableYears = useCallback(() => {
    const availableSpells = getAvailableSpellsData();
    const years = new Set();

    Object.entries(availableSpells).forEach(([, subject]) => {
      Object.entries(subject.levels).forEach(([, spells]) => {
        spells.forEach((spell) => {
          if (spell.year !== null && spell.year !== undefined) {
            years.add(spell.year);
          }
        });
      });
    });

    const yearArray = Array.from(years).sort((a, b) => a - b);
    return yearArray;
  }, [getAvailableSpellsData]);

  const yearFilterOptions = [
    { value: "all", label: "All Years" },
    ...getAvailableYears().map((year) => ({
      value: year.toString(),
      label: `${year}${
        year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"
      } Year`,
    })),
  ];

  useEffect(() => {
    setSpellAttempts({});
    setCriticalSuccesses({});
    setFailedAttempts({});
    setResearchedSpells({});
    setArithmancticTags({});
    setRunicTags({});
    setYearFilter("all");
  }, [selectedCharacter?.id]);

  const getSpellAttemptStatus = useCallback(
    (spellName) => {
      const attempts = spellAttempts[spellName] || {};
      const successfulAttempts = Object.values(attempts).filter(Boolean).length;
      const hasFailed = failedAttempts[spellName];
      const isResearched = researchedSpells[spellName];
      const hasAnyAttempt = successfulAttempts > 0 || hasFailed;

      return {
        isUnattempted: !hasAnyAttempt && !isResearched,
        isAttempted: hasAnyAttempt,
        isMastered: successfulAttempts >= 2,
        hasFailed: hasFailed,
        isResearched: isResearched,
        successfulAttempts,
      };
    },
    [spellAttempts, failedAttempts, researchedSpells]
  );

  const getFilteredSpellsData = useCallback(() => {
    const availableSpells = getAvailableSpellsData();
    let filteredData = {};

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();

      Object.entries(availableSpells).forEach(([subjectName, subjectData]) => {
        const filteredLevels = {};
        let hasMatchingSpells = false;

        Object.entries(subjectData.levels).forEach(([level, spells]) => {
          const filteredSpells = spells.filter((spell) => {
            const hasInherentTag = spell.tags?.some((tag) =>
              tag.toLowerCase().includes(lowerSearchTerm)
            );

            const hasManualArithmancticTag =
              arithmancticTags[spell.name] &&
              "arithmantic".includes(lowerSearchTerm);
            const hasManualRunicTag =
              runicTags[spell.name] && "runic".includes(lowerSearchTerm);

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
    } else {
      filteredData = { ...availableSpells };
    }

    if (yearFilter !== "all") {
      const yearFilteredData = {};
      const targetYear = parseInt(yearFilter);

      Object.entries(filteredData).forEach(([subjectName, subjectData]) => {
        const filteredLevels = {};
        let hasMatchingSpells = false;

        Object.entries(subjectData.levels).forEach(([level, spells]) => {
          const filteredSpells = spells.filter((spell) => {
            const spellYear = spell.year;
            if (spellYear === null || spellYear === undefined) return false;

            const normalizedSpellYear =
              typeof spellYear === "string" ? parseInt(spellYear) : spellYear;
            const matches = normalizedSpellYear === targetYear;

            return matches;
          });

          if (filteredSpells.length > 0) {
            filteredLevels[level] = filteredSpells;
            hasMatchingSpells = true;
          }
        });

        if (hasMatchingSpells) {
          yearFilteredData[subjectName] = {
            ...subjectData,
            levels: filteredLevels,
          };
        }
      });

      filteredData = yearFilteredData;
    }

    if (attemptFilter !== "all") {
      const finalFilteredData = {};

      Object.entries(filteredData).forEach(([subjectName, subjectData]) => {
        const filteredLevels = {};
        let hasMatchingSpells = false;

        Object.entries(subjectData.levels).forEach(([level, spells]) => {
          const filteredSpells = spells.filter((spell) => {
            const status = getSpellAttemptStatus(spell.name);

            switch (attemptFilter) {
              case "unattempted":
                return status.isUnattempted;
              case "attempted":
                return status.isAttempted;
              case "mastered":
                return status.isMastered;
              case "failed":
                return status.hasFailed;
              case "researched":
                return status.isResearched;
              default:
                return true;
            }
          });

          if (filteredSpells.length > 0) {
            filteredLevels[level] = filteredSpells;
            hasMatchingSpells = true;
          }
        });

        if (hasMatchingSpells) {
          finalFilteredData[subjectName] = {
            ...subjectData,
            levels: filteredLevels,
          };
        }
      });

      return finalFilteredData;
    }

    return filteredData;
  }, [
    searchTerm,
    attemptFilter,
    yearFilter,
    getAvailableSpellsData,
    arithmancticTags,
    runicTags,
    researchedSpells,
    selectedCharacter,
    getSpellAttemptStatus,
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

  const clearFilters = () => {
    setSearchTerm("");
    setAttemptFilter("all");
    setYearFilter("all");
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

        {/* Filter Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Filter size={16} color={theme.textSecondary} />
            <select
              value={attemptFilter}
              onChange={(e) => setAttemptFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: "14px",
                minWidth: "150px",
              }}
            >
              {attemptFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: theme.textSecondary,
                fontWeight: "500",
              }}
            >
              Year:
            </span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.background,
                color: theme.text,
                fontSize: "14px",
                minWidth: "120px",
              }}
            >
              {yearFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || attemptFilter !== "all" || yearFilter !== "all") && (
            <button
              onClick={clearFilters}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.background,
                color: theme.textSecondary,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              title="Clear all filters"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {(searchTerm || attemptFilter !== "all" || yearFilter !== "all") && (
          <div style={styles.searchResults}>
            Showing {totalFilteredSpells} of {totalSpells} spells
            {searchTerm && <span> • Search: "{searchTerm}"</span>}
            {attemptFilter !== "all" && (
              <span>
                {" "}
                • Filter:{" "}
                {
                  attemptFilterOptions.find(
                    (opt) => opt.value === attemptFilter
                  )?.label
                }
              </span>
            )}
            {yearFilter !== "all" && (
              <span>
                {" "}
                • Year:{" "}
                {
                  yearFilterOptions.find((opt) => opt.value === yearFilter)
                    ?.label
                }
              </span>
            )}
            {totalFilteredSpells < totalSpells && (
              <span style={styles.searchResultsHint}>
                {" "}
                • Try different keywords or filters to find more spells
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
          {searchTerm || attemptFilter !== "all" || yearFilter !== "all"
            ? totalFilteredSpells
            : totalSpells}{" "}
          {searchTerm || attemptFilter !== "all" || yearFilter !== "all"
            ? "Found"
            : "Total"}{" "}
          Spells
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

      {(searchTerm || attemptFilter !== "all" || yearFilter !== "all") &&
        Object.keys(filteredSpellsData).length === 0 && (
          <div style={styles.noResultsContainer}>
            <div style={styles.noResultsIcon}>🔍</div>
            <h3 style={styles.noResultsTitle}>No spells found</h3>
            <p style={styles.noResultsMessage}>
              No spells match your current filters.
              {searchTerm && (
                <>
                  <br />
                  Search term: "<strong>{searchTerm}</strong>"
                </>
              )}
              {attemptFilter !== "all" && (
                <>
                  <br />
                  Attempt filter:{" "}
                  <strong>
                    {
                      attemptFilterOptions.find(
                        (opt) => opt.value === attemptFilter
                      )?.label
                    }
                  </strong>
                </>
              )}
              {yearFilter !== "all" && (
                <>
                  <br />
                  Year filter:{" "}
                  <strong>
                    {
                      yearFilterOptions.find((opt) => opt.value === yearFilter)
                        ?.label
                    }
                  </strong>
                </>
              )}
              <br />
              Try:
            </p>
            <ul style={styles.searchSuggestions}>
              <li>Different search keywords</li>
              <li>Different attempt status filters</li>
              <li>Different year filters</li>
              <li>Clearing filters to see all spells</li>
            </ul>
            <button onClick={clearFilters} style={styles.clearSearchButton}>
              Clear All Filters
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
