import { useState, useEffect } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  GraduationCap,
  Search,
  X,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterGalleryStyles } from ".././../styles/masterStyles";
import { ALL_CHARACTERS } from "./characters";

const CharacterCard = ({ character, theme, styles }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      style={{
        ...styles.characterCard,
      }}
    >
      <div style={styles.imageContainer}>
        {character.src && !imageError ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {!imageLoaded && (
              <div
                style={{
                  ...styles.imagePlaceholder,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  backgroundColor: theme.background,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: `3px solid ${theme.border}`,
                    borderTop: `3px solid ${theme.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span style={{ ...styles.placeholderText, marginTop: "8px" }}>
                  Loading...
                </span>
              </div>
            )}
            <img
              src={character.src}
              alt={character.name}
              style={{
                ...styles.characterImage,
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
              loading="lazy"
              onError={() => setImageError(true)}
              onLoad={() => {
                setImageError(false);
                setImageLoaded(true);
              }}
              decoding="async"
            />
          </div>
        ) : (
          <div style={styles.imagePlaceholder}>
            <Users size={48} color={theme.textSecondary} />
            <span style={styles.placeholderText}>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.characterInfo}>
        <h3 style={styles.characterName}>{character.name}</h3>
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            marginTop: "4px",
          }}
        >
          {character.school} • {character.type}
        </div>
      </div>
    </div>
  );
};

const TypeSection = ({
  type,
  characters,
  theme,
  styles,
  isExpanded,
  onToggle,
}) => {
  return (
    <div style={styles.typeSection}>
      <button
        style={{
          ...styles.typeHeader,
          backgroundColor: isExpanded ? theme.primary + "10" : theme.surface,
          borderColor: isExpanded ? theme.primary : theme.border,
          marginLeft: "20px",
        }}
        onClick={onToggle}
      >
        <div style={styles.typeHeaderLeft}>
          <Calendar size={18} color={theme.primary} />
          <h3 style={styles.typeTitle}>{type}</h3>
          <span style={styles.characterCount}>
            ({characters.length} {type.toLowerCase()})
          </span>
        </div>
        <div style={styles.typeHeaderRight}>
          {isExpanded ? (
            <ChevronUp size={18} color={theme.primary} />
          ) : (
            <ChevronDown size={18} color={theme.primary} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div style={{ ...styles.charactersGrid, marginLeft: "20px" }}>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              theme={theme}
              styles={styles}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SchoolSection = ({
  school,
  schoolData,
  theme,
  styles,
  isSchoolExpanded,
  onSchoolToggle,
  expandedTypes,
  onTypeToggle,
}) => {
  const totalCharacters = Object.values(schoolData).reduce(
    (sum, chars) => sum + chars.length,
    0
  );

  return (
    <div style={styles.schoolSection}>
      <button
        style={{
          ...styles.schoolHeader,
          backgroundColor: isSchoolExpanded
            ? theme.primary + "15"
            : theme.surface,
          borderColor: isSchoolExpanded ? theme.primary : theme.border,
        }}
        onClick={onSchoolToggle}
      >
        <div style={styles.schoolHeaderLeft}>
          <GraduationCap size={24} color={theme.primary} />
          <h2 style={styles.schoolTitle}>{school}</h2>
          <span style={styles.schoolCount}>
            ({totalCharacters} total characters)
          </span>
        </div>
        <div style={styles.schoolHeaderRight}>
          {isSchoolExpanded ? (
            <ChevronUp size={24} color={theme.primary} />
          ) : (
            <ChevronDown size={24} color={theme.primary} />
          )}
        </div>
      </button>

      {isSchoolExpanded && (
        <div style={styles.schoolContent}>
          {Object.entries(schoolData).map(([type, characters]) => (
            <TypeSection
              key={`${school}-${type}`}
              type={type}
              characters={characters}
              theme={theme}
              styles={styles}
              isExpanded={expandedTypes.has(`${school}-${type}`)}
              onToggle={() => onTypeToggle(`${school}-${type}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CharacterGallery = ({ characters = ALL_CHARACTERS }) => {
  const { theme } = useTheme();
  const [expandedSchools, setExpandedSchools] = useState(
    new Set(["Ilvermorny"])
  );
  const [expandedTypes, setExpandedTypes] = useState(
    new Set(["Ilvermorny-Classmate"])
  );
  const [searchTerm, setSearchTerm] = useState("");

  const charactersBySchool = characters.reduce((acc, character) => {
    const school = character.school;
    const type = character.type;

    if (!acc[school]) {
      acc[school] = {};
    }
    if (!acc[school][type]) {
      acc[school][type] = [];
    }
    acc[school][type].push(character);
    return acc;
  }, {});

  const searchResults = characters.filter((character) => {
    if (!searchTerm.trim()) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      character.name.toLowerCase().includes(searchLower) ||
      character.school.toLowerCase().includes(searchLower) ||
      character.type.toLowerCase().includes(searchLower)
    );
  });

  // Add spinning animation for loading states
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const schoolKeys = Object.keys(charactersBySchool);

  const toggleSchool = (school) => {
    const newExpanded = new Set(expandedSchools);
    if (newExpanded.has(school)) {
      newExpanded.delete(school);
    } else {
      newExpanded.add(school);
    }
    setExpandedSchools(newExpanded);
  };

  const toggleType = (typeId) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedTypes(newExpanded);
  };

  const toggleAllSchools = () => {
    if (expandedSchools.size === schoolKeys.length) {
      setExpandedSchools(new Set());
      setExpandedTypes(new Set());
    } else {
      setExpandedSchools(new Set(schoolKeys));

      const allTypeIds = [];
      Object.entries(charactersBySchool).forEach(([school, schoolData]) => {
        Object.keys(schoolData).forEach((type) => {
          allTypeIds.push(`${school}-${type}`);
        });
      });
      setExpandedTypes(new Set(allTypeIds));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const styles = getCharacterGalleryStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Users size={32} color={theme.primary} />
          <div>
            <h1 style={styles.title}>Character Gallery</h1>
            <p style={styles.subtitle}>
              Explore students, teachers, and other important individuals from
              magical schools around the world.
            </p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.toggleAllButton} onClick={toggleAllSchools}>
            {expandedSchools.size === schoolKeys.length &&
            expandedTypes.size > 0
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchInputContainer}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search characters by name, school, or type..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              ...styles.searchInput,
              borderColor: searchTerm ? theme.primary : theme.border,
            }}
          />
          {searchTerm && (
            <button onClick={clearSearch} style={styles.clearButton}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div style={styles.searchResults}>
          <div style={styles.searchResultsHeader}>
            <h2 style={styles.searchResultsTitle}>Search Results</h2>
            <p style={styles.searchResultsCount}>
              {searchResults.length} character
              {searchResults.length !== 1 ? "s" : ""} found for "{searchTerm}"
            </p>
          </div>
          <div style={styles.searchResultsContent}>
            {searchResults.length > 0 ? (
              <div style={styles.charactersGrid}>
                {searchResults.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    theme={theme}
                    styles={styles}
                  />
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                <Search size={48} color={theme.textSecondary} />
                <p>No characters found matching "{searchTerm}"</p>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                  Try searching by name, school, or character type.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.schoolContainer}>
        {schoolKeys.map((school) => (
          <SchoolSection
            key={school}
            school={school}
            schoolData={charactersBySchool[school]}
            theme={theme}
            styles={styles}
            isSchoolExpanded={expandedSchools.has(school)}
            onSchoolToggle={() => toggleSchool(school)}
            expandedTypes={expandedTypes}
            onTypeToggle={toggleType}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterGallery;
