import React, { useState } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  MapPin,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { createCharacterGalleryStyles } from "./styles";

// Sample character data - replace with your actual character data
const SAMPLE_CHARACTERS = [
  {
    id: 1,
    name: "Hermione Granger",
    year: 1,
    house: "Gryffindor",
    description:
      "Brilliant witch known for her intelligence, quick thinking, and extensive knowledge of magic.",
    imagePath: "/src/Images/hermione.jpg", // Update with actual image paths
    specialties: ["Transfiguration", "Charms", "Ancient Runes"],
    status: "Active",
  },
  {
    id: 2,
    name: "Draco Malfoy",
    year: 1,
    house: "Slytherin",
    description:
      "Ambitious student from a pure-blood family with a talent for potions and dark arts.",
    imagePath: "/src/Images/draco.jpg",
    specialties: ["Potions", "Dark Arts", "Quidditch"],
    status: "Active",
  },
  {
    id: 3,
    name: "Luna Lovegood",
    year: 2,
    house: "Ravenclaw",
    description:
      "Dreamy and eccentric student with a unique perspective on magical creatures.",
    imagePath: "/src/Images/luna.jpg",
    specialties: ["Magical Creatures", "Divination", "Herbology"],
    status: "Active",
  },
  {
    id: 4,
    name: "Cedric Diggory",
    year: 3,
    house: "Hufflepuff",
    description:
      "Popular and talented student known for his fairness and athletic ability.",
    imagePath: "/src/Images/cedric.jpg",
    specialties: ["Quidditch", "Defense Against Dark Arts", "Charms"],
    status: "Graduate",
  },
  {
    id: 5,
    name: "Newt Scamander",
    year: 4,
    house: "Hufflepuff",
    description:
      "Magizoologist with an extraordinary gift for understanding magical creatures.",
    imagePath: "/src/Images/newt.jpg",
    specialties: ["Magical Creatures", "Herbology", "Potions"],
    status: "Alumni",
  },
];

const CharacterCard = ({ character, theme, styles }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return theme.success;
      case "Graduate":
        return theme.primary;
      case "Alumni":
        return theme.accent;
      default:
        return theme.textSecondary;
    }
  };

  const getHouseColor = (house) => {
    const houseColors = {
      Gryffindor: "#740001",
      Slytherin: "#1a472a",
      Ravenclaw: "#0e1a40",
      Hufflepuff: "#ecb939",
    };
    return houseColors[house] || theme.primary;
  };

  return (
    <div
      style={{
        ...styles.characterCard,
        ...(isHovered ? styles.characterCardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Character Image */}
      <div style={styles.imageContainer}>
        {!imageError ? (
          <img
            src={character.imagePath}
            alt={character.name}
            style={styles.characterImage}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            <Users size={48} color={theme.textSecondary} />
            <span style={styles.placeholderText}>No Image</span>
          </div>
        )}

        {/* Status Badge */}
        <div
          style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(character.status) + "20",
            borderColor: getStatusColor(character.status),
            color: getStatusColor(character.status),
          }}
        >
          {character.status}
        </div>

        {/* House Badge */}
        <div
          style={{
            ...styles.houseBadge,
            backgroundColor: getHouseColor(character.house) + "20",
            borderColor: getHouseColor(character.house),
            color: getHouseColor(character.house),
          }}
        >
          {character.house}
        </div>
      </div>

      {/* Character Info */}
      <div style={styles.characterInfo}>
        <h3 style={styles.characterName}>{character.name}</h3>
        <p style={styles.characterDescription}>{character.description}</p>

        {/* Specialties */}
        {character.specialties && character.specialties.length > 0 && (
          <div style={styles.specialtiesContainer}>
            <div style={styles.specialtiesHeader}>
              <Star size={14} color={theme.accent} />
              <span style={styles.specialtiesLabel}>Specialties:</span>
            </div>
            <div style={styles.specialtiesList}>
              {character.specialties.map((specialty, index) => (
                <span
                  key={index}
                  style={{
                    ...styles.specialtyTag,
                    backgroundColor: theme.primary + "15",
                    color: theme.primary,
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const YearSection = ({
  year,
  characters,
  theme,
  styles,
  isExpanded,
  onToggle,
}) => {
  const yearLabels = {
    1: "First Year",
    2: "Second Year",
    3: "Third Year",
    4: "Fourth Year",
    5: "Fifth Year",
    6: "Sixth Year",
    7: "Seventh Year",
  };

  return (
    <div style={styles.yearSection}>
      <button
        style={{
          ...styles.yearHeader,
          backgroundColor: isExpanded ? theme.primary + "10" : theme.surface,
          borderColor: isExpanded ? theme.primary : theme.border,
        }}
        onClick={onToggle}
      >
        <div style={styles.yearHeaderLeft}>
          <Calendar size={20} color={theme.primary} />
          <h2 style={styles.yearTitle}>{yearLabels[year] || `Year ${year}`}</h2>
          <span style={styles.characterCount}>
            ({characters.length} students)
          </span>
        </div>
        <div style={styles.yearHeaderRight}>
          {isExpanded ? (
            <ChevronUp size={20} color={theme.primary} />
          ) : (
            <ChevronDown size={20} color={theme.primary} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div style={styles.charactersGrid}>
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

export const CharacterGallery = ({ characters = SAMPLE_CHARACTERS }) => {
  const { theme } = useTheme();
  const [expandedYears, setExpandedYears] = useState(new Set([1])); // First year expanded by default

  // Group characters by year
  const charactersByYear = characters.reduce((acc, character) => {
    const year = character.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(character);
    return acc;
  }, {});

  // Sort years
  const sortedYears = Object.keys(charactersByYear)
    .map(Number)
    .sort((a, b) => a - b);

  const toggleYear = (year) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const toggleAllYears = () => {
    if (expandedYears.size === sortedYears.length) {
      setExpandedYears(new Set());
    } else {
      setExpandedYears(new Set(sortedYears));
    }
  };

  const styles = createCharacterGalleryStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Users size={32} color={theme.primary} />
          <div>
            <h1 style={styles.title}>Character Gallery</h1>
            <p style={styles.subtitle}>
              Explore students from different school years and their magical
              specialties
            </p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.toggleAllButton} onClick={toggleAllYears}>
            {expandedYears.size === sortedYears.length
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <MapPin size={16} color={theme.accent} />
          <span>Total Students: {characters.length}</span>
        </div>
        <div style={styles.statItem}>
          <Calendar size={16} color={theme.accent} />
          <span>School Years: {sortedYears.length}</span>
        </div>
      </div>

      <div style={styles.yearContainer}>
        {sortedYears.map((year) => (
          <YearSection
            key={year}
            year={year}
            characters={charactersByYear[year]}
            theme={theme}
            styles={styles}
            isExpanded={expandedYears.has(year)}
            onToggle={() => toggleYear(year)}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterGallery;
