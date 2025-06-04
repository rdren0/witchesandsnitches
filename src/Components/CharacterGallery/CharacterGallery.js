import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getCharacterGalleryStyles } from "../../styles/masterStyles";
import * as images from "../../Images";

const ILVERMORNY_CHARACTERS = [
  {
    id: 1,
    name: "Ava Robinson",
    type: "Students",
    house: "?",
    src: images.Ava,
  },
  {
    id: 2,
    name: "Anuhea Kelii",
    type: "Students",
    house: "?",
    src: images.Anuhea,
  },
  {
    id: 3,
    name: "Azha Pavan",
    type: "Students",
    house: "?",
    src: images.Azha,
  },
  {
    id: 4,
    name: "Bailey-Anna Balders",
    type: "Students",
    house: "?",
    src: images.Bailey_Anna,
  },
  {
    id: 5,
    name: "Claire Takahashi",
    type: "Students",
    house: "?",
    src: images.Claire,
  },
  {
    id: 6,
    name: "Colby Engel",
    type: "Students",
    house: "?",
    src: images.Colby,
  },
  {
    id: 7,
    name: "Erika Baker",
    type: "Students",
    house: "?",
    src: images.Erika,
  },
  {
    id: 8,
    name: "Genesis Firth",
    type: "Students",
    house: "?",
    src: images.Genesis,
  },
  {
    id: 9,
    name: "Harmony",
    type: "Students",
    house: "?",
    src: images.Harmony,
  },
  {
    id: 10,
    name: "Jeremiah Collier",
    type: "Students",
    house: "?",
    src: images.Jeremiah,
  },
  {
    id: 11,
    name: "Maddie Gardner",
    type: "Students",
    house: "?",
    src: images.Maddie,
  },
  {
    id: 12,
    name: "Noah Robinson",
    type: "Students",
    house: "?",
    src: images.Noah,
  },
  {
    id: 13,
    name: "Olivia Law",
    type: "Students",
    house: "?",
    src: images.Olivia,
  },
  {
    id: 14,
    name: "Omari Curtis",
    type: "Students",
    house: "?",
    src: images.Omari,
  },
  {
    id: 15,
    name: "Rome Sanford",
    type: "Students",
    house: "?",
    src: images.Rome,
  },
  {
    id: 16,
    name: "Seth Claw",
    type: "Students",
    house: "?",
    src: images.Seth,
  },
  {
    id: 17,
    name: "Shelby MGH",
    type: "Students",
    house: "?",
    src: images.Shelby,
  },
  {
    id: 18,
    name: "Tony DeLuca",
    type: "Students",
    house: "?",
    src: images.Tony,
  },
  {
    id: 19,
    name: "Warren Ceredaryk",
    type: "Students",
    house: "?",
    src: images.Warren,
  },
];

const CharacterCard = ({ character, theme, styles }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getHouseColor = (house) => {
    const houseColors = {
      Gryffindor: "#740001",
      Slytherin: "#1a472a",
      Ravenclaw: "#0e1a40",
      Hufflepuff: "#ecb939",
      Thunderbird: "#8B5A2B",
      "Horned Serpent": "#1E3A8A",
      Pukwudgie: "#7C2D12",
      Wampus: "#6D28D9",
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
            src={character.src}
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

        {/* House Badge */}
        {character.house !== "?" && (
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
        )}
      </div>

      {/* Character Info */}
      <div style={styles.characterInfo}>
        <h3 style={styles.characterName}>{character.name}</h3>
      </div>
    </div>
  );
};

const Section = ({ type, characters, theme, styles, isExpanded, onToggle }) => {
  return (
    <div style={styles.typeSection}>
      <button
        style={{
          ...styles.typeHeader,
          backgroundColor: isExpanded ? theme.primary + "10" : theme.surface,
          borderColor: isExpanded ? theme.primary : theme.border,
        }}
        onClick={onToggle}
      >
        <div style={styles.typeHeaderLeft}>
          <Calendar size={20} color={theme.primary} />
          <h2 style={styles.typeTitle}>{type}</h2>
          <span style={styles.characterCount}>
            ({characters.length} {type.toLowerCase()})
          </span>
        </div>
        <div style={styles.typeHeaderRight}>
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

export const CharacterGallery = ({ characters = ILVERMORNY_CHARACTERS }) => {
  const { theme } = useTheme();
  const [expandedTypes, setExpandedTypes] = useState(new Set(["Students"]));

  // Group characters by type
  const charactersByType = characters.reduce((acc, character) => {
    const type = character.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(character);
    return acc;
  }, {});

  // Get the type keys for iteration
  const typeKeys = Object.keys(charactersByType);

  const toggleType = (type) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  const toggleAllTypes = () => {
    if (expandedTypes.size === typeKeys.length) {
      setExpandedTypes(new Set());
    } else {
      setExpandedTypes(new Set(typeKeys));
    }
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
              Ilvermorny.
            </p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.toggleAllButton} onClick={toggleAllTypes}>
            {expandedTypes.size === typeKeys.length
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>
      </div>

      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <MapPin size={16} color={theme.accent} />
          <span>Total Characters: {characters.length}</span>
        </div>
        <div style={styles.statItem}>
          <Calendar size={16} color={theme.accent} />
          <span>Categories: {typeKeys.length}</span>
        </div>
      </div>

      <div style={styles.typeContainer}>
        {typeKeys.map((type) => (
          <Section
            key={type}
            type={type}
            characters={charactersByType[type]}
            theme={theme}
            styles={styles}
            isExpanded={expandedTypes.has(type)}
            onToggle={() => toggleType(type)}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterGallery;
