import React, { useState, useMemo } from "react";
import {
  Award,
  Search,
  X,
  Home,
  Scroll,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const CharacterFeatsDisplay = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  adminMode,
  isUserAdmin,
}) => {
  const { theme } = useTheme();
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedSections, setExpandedSections] = useState(new Set([]));

  const organizedFeatures = useMemo(() => {
    const sections = {
      house: {
        title: "House Features",
        icon: Home,
        color: "#DC2626",
        features: [],
      },
      subclass: {
        title: "Subclass Features",
        icon: Scroll,
        color: "#7C3AED",
        features: [],
      },
      background: {
        title: "Background Features",
        icon: BookOpen,
        color: "#059669",
        features: [],
      },
      feats: {
        title: "Feats",
        icon: Award,
        color: "#3B82F6",
        features: [],
      },
    };

    if (!character) return sections;

    if (character.house) {
      const houseName = character.house;

      sections.house.features.push({
        name: `${houseName} Heritage`,
        type: "House Membership",
        source: houseName,
        level: null,
        description: `Member of ${houseName} house. Each house provides unique magical traits, ability score bonuses, and special abilities that reflect the house's values and traditions.`,
        details: [
          `House: ${houseName}`,
          "Provides fixed ability score bonuses",
          "Grants house-specific features and abilities",
          "Access to house common room and resources",
        ],
      });

      sections.house.features.push({
        name: `${houseName} Ability Training`,
        type: "Ability Enhancement",
        source: houseName,
        level: null,
        description: `Your house training has enhanced your natural abilities. ${houseName} focuses on developing specific magical and physical capabilities.`,
        details: [
          "Fixed ability score bonuses from house training",
          "Reflects house values and specializations",
          "Permanent character enhancement",
        ],
      });

      if (character.houseChoices && character.houseChoices[character.house]) {
        const choices = character.houseChoices[character.house];

        if (choices.abilityChoice) {
          sections.house.features.push({
            name: `${houseName} Specialization`,
            type: "Chosen Enhancement",
            source: houseName,
            level: null,
            description: `You've specialized in ${choices.abilityChoice}, gaining additional training and enhancement in this area through focused house study.`,
            details: [
              `+1 bonus to ${choices.abilityChoice}`,
              "Chosen during character creation",
              "Represents personal focus within house training",
            ],
          });
        }

        if (choices.featureChoice) {
          sections.house.features.push({
            name: choices.featureChoice,
            type: "House Feature Choice",
            source: houseName,
            level: null,
            description: `A specialized house ability you've developed through your time and training in ${houseName}.`,
            details: [
              "Unique house-specific ability",
              "Chosen during character creation",
              "Reflects house values and traditions",
            ],
          });
        }
      }
    }

    if (character.subclass) {
      sections.subclass.features.push({
        name: character.subclass,
        type: "Specialization",
        source: "Class Training",
        level: character.subclassLevel || 1,
        description: `Your specialized focus in ${character.subclass}. This represents advanced study and mastery in a particular school of magic or approach to spellcasting.`,
        details: [
          `Subclass Level: ${character.subclassLevel || 1}`,
          "Provides specialized abilities and bonuses",
          "Unlocks unique spellcasting techniques",
          "Reflects advanced magical education",
        ],
      });

      if (character.subclassFeatures && character.subclassFeatures.length > 0) {
        character.subclassFeatures.forEach((feature) => {
          sections.subclass.features.push({
            name: feature,
            type: "Subclass Ability",
            source: character.subclass,
            level: character.subclassLevel || null,
            description: getSubclassFeatureDescription(feature),
            details: getSubclassFeatureDetails(feature),
          });
        });
      }

      if (character.subclassChoices) {
        Object.entries(character.subclassChoices).forEach(([key, choice]) => {
          if (choice && typeof choice === "string") {
            sections.subclass.features.push({
              name: choice,
              type: "Subclass Choice",
              source: character.subclass,
              level: null,
              description: `A specialized technique or focus you've chosen as part of your ${character.subclass} training.`,
              details: [
                "Chosen during subclass progression",
                "Represents personal specialization",
                "Enhances core subclass abilities",
              ],
            });
          }
        });
      }
    }

    if (character.background) {
      sections.background.features.push({
        name: character.background,
        type: "Life Experience",
        source: "Personal History",
        level: null,
        description: `Your background as a ${character.background.toLowerCase()} has shaped your skills, knowledge, and approach to magic. This represents your life experiences before your current adventures.`,
        details: [
          "Provides skill proficiencies",
          "Grants background-specific features",
          "Reflects pre-adventure life",
          "Influences roleplay and character motivations",
        ],
      });

      if (character.backgroundSkills && character.backgroundSkills.length > 0) {
        sections.background.features.push({
          name: "Background Skill Training",
          type: "Skill Proficiency",
          source: character.background,
          level: null,
          description: `Your ${character.background.toLowerCase()} background has given you training in specific skills that reflect your life experiences.`,
          details: character.backgroundSkills.map(
            (skill) => `Proficient in ${skill}`
          ),
        });
      }
    }

    if (character.innateHeritage) {
      sections.background.features.push({
        name: `${character.innateHeritage} Heritage`,
        type: "Magical Heritage",
        source: "Innate Heritage",
        level: null,
        description: `Your ${character.innateHeritage} heritage grants you inherent magical traits and abilities that are part of your very being.`,
        details: [
          "Innate magical characteristics",
          "Heritage-specific abilities",
          "Influences magical potential",
        ],
      });

      if (
        character.innateHeritageSkills &&
        character.innateHeritageSkills.length > 0
      ) {
        sections.background.features.push({
          name: "Heritage Skill Aptitude",
          type: "Heritage Proficiency",
          source: character.innateHeritage,
          level: null,
          description: `Your magical heritage has given you natural aptitude in certain skills.`,
          details: character.innateHeritageSkills.map(
            (skill) => `Heritage proficiency: ${skill}`
          ),
        });
      }

      if (character.heritageChoices) {
        Object.entries(character.heritageChoices).forEach(([key, choice]) => {
          if (choice && typeof choice === "string") {
            sections.background.features.push({
              name: choice,
              type: "Heritage Choice",
              source: character.innateHeritage,
              level: null,
              description: `A specialized heritage trait you've developed or chosen to emphasize.`,
              details: [
                "Heritage-specific ability",
                "Chosen during character creation",
                "Reflects heritage specialization",
              ],
            });
          }
        });
      }
    }

    const processedFeats = new Set();

    if (character.asiChoices) {
      Object.entries(character.asiChoices).forEach(([level, choice]) => {
        if (choice.type === "feat" && choice.selectedFeat) {
          const featKey = `${choice.selectedFeat}-${level}`;
          processedFeats.add(choice.selectedFeat);
          processedFeats.add(featKey);

          sections.feats.features.push({
            name: choice.selectedFeat,
            type: "ASI Choice Feat",
            source: `Level ${level}`,
            level: parseInt(level),
            description: `A feat chosen instead of ability score improvement at level ${level}, representing specialized training or development.`,
            details: [
              `Chosen at Level ${level}`,
              "Selected instead of ability score increase",
              "Provides specialized capabilities",
              "Represents character development focus",
            ],
          });
        }
      });
    }

    if (character.standardFeats && character.standardFeats.length > 0) {
      character.standardFeats.forEach((featName) => {
        if (!processedFeats.has(featName)) {
          processedFeats.add(featName);

          sections.feats.features.push({
            name: featName,
            type: "Standard Feat",
            source: "Character Level",
            level: null,
            description: `A feat representing specialized training or natural talent that enhances your character's capabilities.`,
            details: [
              "Gained through character progression",
              "Provides specific mechanical benefits",
              "Represents focused training or talent",
            ],
          });
        }
      });
    }

    if (character.allFeats && character.allFeats.length > 0) {
      character.allFeats.forEach((featString) => {
        const levelMatch = featString.match(/^(.+?)\s*\(Level\s+(\d+)\)$/);

        if (levelMatch) {
          const [, featName, level] = levelMatch;
          const featKey = `${featName}-${level}`;

          if (!processedFeats.has(featKey)) {
            processedFeats.add(featKey);

            sections.feats.features.push({
              name: featName,
              type: "Level Feat",
              source: `Level ${level}`,
              level: parseInt(level),
              description: `A feat acquired at level ${level} through character advancement and training.`,
              details: [
                `Acquired at Level ${level}`,
                "Gained through character progression",
                "Enhances character abilities",
              ],
            });
          }
        } else {
          if (!processedFeats.has(featString)) {
            processedFeats.add(featString);

            sections.feats.features.push({
              name: featString,
              type: "Character Feat",
              source: "Character Creation",
              level: null,
              description: `A feat representing your character's background training or natural abilities.`,
              details: [
                "Gained during character creation",
                "Reflects character background",
                "Provides specialized capabilities",
              ],
            });
          }
        }
      });
    }

    Object.keys(sections).forEach((sectionKey) => {
      sections[sectionKey].features.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

    return sections;
  }, [character]);

  const getSubclassFeatureDescription = (featureName) => {
    const descriptions = {
      Researcher:
        "You've mastered the art of magical research, allowing you to enhance your spellcasting through academic study. You add half your Wisdom modifier to research checks and all researched spells gain both Arithmantic and Runic tags, making them more versatile and powerful.",
      "Enhanced Spellwork":
        "Your understanding of Runic and Arithmantic magic allows you to enhance spells in unique ways. Runic spells gain +1 minute duration and deal 1d6 psychic damage per round. Arithmantic spells gain +10 feet range and can convert Dedication to Concentration.",
      "Nimble Fingers":
        "Your dexterity with magical implements grants you Sleight of Hand expertise. When casting spells with both Runic and Arithmantic tags, you add half your Dexterity modifier to spell attack rolls and save DCs.",
      Spellmaker:
        "Your mastery of dual-tagged magic is so complete that spells with both Arithmantic and Runic tags can be cast using a spell slot one level lower than normal (minimum 1st level).",
      "Private Lessons":
        "You've received additional instruction that grants you extra spell attempts in classes, reduces spell learning DCs by 2, and ensures all your spells automatically gain both Arithmantic and Runic tags.",
      "Perfected Spellwork":
        "Once per round, instead of rolling dice for enhanced spell effects, you can choose to use the maximum possible result, representing your perfect mastery of magical theory.",
      "Auror Training":
        "Specialized combat training focused on fighting dark wizards and dangerous magical creatures. You gain enhanced abilities when dealing with cursed objects and dark magic.",
      "Curse-Breaking":
        "Expert knowledge in identifying, analyzing, and safely dismantling magical curses, hexes, and other harmful enchantments.",
      "Study Buddy":
        "Your collaborative approach to learning enhances both your own studies and those of your allies through shared magical research and practice.",
      "Quick Skim":
        "You can rapidly absorb and understand complex magical texts, allowing you to quickly grasp new concepts and magical theories.",
      "Practice Makes Perfect":
        "Your dedication to repeated practice yields exceptional results, with each repetition improving your magical technique.",
      "Master of None":
        "Your broad approach to magical education gives you knowledge across multiple disciplines rather than deep specialization in one area.",
      Imbuement:
        "The ability to infuse mundane objects with lasting magical properties, creating enchanted items.",
      Harmonancy:
        "A deep understanding of magical harmony and resonance, allowing you to work in tune with mystical forces.",
    };
    return (
      descriptions[featureName] ||
      `${featureName} - A specialized ability gained through your subclass training, providing unique magical techniques and enhanced capabilities.`
    );
  };

  const getSubclassFeatureDetails = (featureName) => {
    const details = {
      Researcher: [
        "Add ½ Wisdom modifier to research checks",
        "All researched spells gain Arithmantic and Runic tags",
        "Enhanced access to Devicto with both tags",
        "Improved magical theory understanding",
      ],
      "Enhanced Spellwork": [
        "Runic spells: +1 minute duration",
        "Runic spells: 1d6 psychic damage per round",
        "Arithmantic spells: +10 feet range",
        "Arithmantic spells: Dedication becomes Concentration",
      ],
      "Nimble Fingers": [
        "Gain Sleight of Hand expertise",
        "Spells with both tags: +½ Dex to attack rolls",
        "Spells with both tags: +½ Dex to save DC",
        "Enhanced manual dexterity with magic",
      ],
      Spellmaker: [
        "Dual-tagged spells cost 1 lower spell slot",
        "Minimum spell slot level: 1st",
        "Represents mastery of magical efficiency",
        "Significant resource conservation",
      ],
      "Private Lessons": [
        "Extra spell attempts in classes",
        "Spell learning DC reduced by 2",
        "All spells automatically gain both tags",
        "Enhanced magical education",
      ],
      "Perfected Spellwork": [
        "Once per round: use maximum dice result",
        "Applies to enhanced spell effects",
        "Represents perfect magical control",
        "Ultimate expression of magical mastery",
      ],
    };
    return (
      details[featureName] || [
        "Specialized subclass ability",
        "Enhances magical capabilities",
        "Reflects advanced training",
      ]
    );
  };

  const filteredSections = useMemo(() => {
    if (!searchFilter.trim()) return organizedFeatures;

    const searchTerm = searchFilter.toLowerCase();
    const filtered = {};

    Object.keys(organizedFeatures).forEach((sectionKey) => {
      const section = organizedFeatures[sectionKey];
      const filteredFeatures = section.features.filter(
        (feature) =>
          feature.name.toLowerCase().includes(searchTerm) ||
          feature.type.toLowerCase().includes(searchTerm) ||
          feature.source.toLowerCase().includes(searchTerm) ||
          feature.description.toLowerCase().includes(searchTerm) ||
          feature.details.some((detail) =>
            detail.toLowerCase().includes(searchTerm)
          )
      );

      if (filteredFeatures.length > 0) {
        filtered[sectionKey] = {
          ...section,
          features: filteredFeatures,
        };
      }
    });

    return filtered;
  }, [organizedFeatures, searchFilter]);

  const toggleSection = (sectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const getTotalFeatures = () => {
    return Object.values(organizedFeatures).reduce(
      (total, section) => total + section.features.length,
      0
    );
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: theme.background,
      minHeight: "100%",
    },
    header: {
      marginBottom: "20px",
      padding: "16px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "24px",
      fontWeight: "700",
      color: theme.text,
      margin: 0,
    },
    subtitle: {
      fontSize: "14px",
      color: theme.textSecondary,
      marginTop: "4px",
    },
    searchContainer: {
      position: "relative",
      marginBottom: "20px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 40px 12px 16px",
      borderRadius: "8px",
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s ease",
    },
    searchIcon: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: theme.textSecondary,
    },
    clearButton: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: theme.textSecondary,
      cursor: "pointer",
      padding: "4px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      marginBottom: "24px",
      backgroundColor: theme.surface,
      borderRadius: "12px",
      border: `2px solid ${theme.border}`,
      overflow: "hidden",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      cursor: "pointer",
      backgroundColor: theme.background,
      borderBottom: `1px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
    },
    sectionCount: {
      backgroundColor: theme.primary,
      color: "white",
      borderRadius: "12px",
      padding: "4px 8px",
      fontSize: "12px",
      fontWeight: "600",
      minWidth: "20px",
      textAlign: "center",
    },
    featuresContainer: {
      padding: "0",
    },
    featureCard: {
      padding: "16px",
      borderBottom: `1px solid ${theme.border}`,
      transition: "all 0.2s ease",
    },
    featureHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    featureName: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      margin: 0,
      flex: 1,
      marginRight: "12px",
    },
    featureType: {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "500",
      color: "white",
      textAlign: "center",
      whiteSpace: "nowrap",
    },
    featureSource: {
      fontSize: "12px",
      color: theme.textSecondary,
      marginBottom: "8px",
      fontStyle: "italic",
    },
    featureDescription: {
      fontSize: "13px",
      color: theme.text,
      lineHeight: "1.5",
      marginBottom: "12px",
    },
    featureDetails: {
      backgroundColor: theme.background,
      borderRadius: "6px",
      padding: "12px",
      border: `1px solid ${theme.border}`,
    },
    detailsList: {
      margin: 0,
      paddingLeft: "20px",
      color: theme.textSecondary,
    },
    detailItem: {
      fontSize: "12px",
      lineHeight: "1.4",
      marginBottom: "4px",
    },
    levelBadge: {
      backgroundColor: theme.primary,
      color: "white",
      borderRadius: "12px",
      padding: "2px 6px",
      fontSize: "10px",
      fontWeight: "600",
      marginLeft: "8px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: theme.textSecondary,
    },
    emptyIcon: {
      marginBottom: "16px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "14px",
      lineHeight: "1.5",
    },
  };

  if (!character) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <Award size={48} style={styles.emptyIcon} />
          <div style={styles.emptyTitle}>No Character Selected</div>
          <div style={styles.emptyText}>
            Select a character to view their features and abilities.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Award size={28} />
          Character Features & Abilities
        </h2>
        <div style={styles.subtitle}>
          {character.name} • Level {character.level} {character.castingStyle}
          {getTotalFeatures() > 0 && ` • ${getTotalFeatures()} total features`}
        </div>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search all features, abilities, and feats..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={styles.searchInput}
        />
        {searchFilter ? (
          <button
            onClick={() => setSearchFilter("")}
            style={styles.clearButton}
            title="Clear search"
          >
            <X size={16} />
          </button>
        ) : (
          <Search size={16} style={styles.searchIcon} />
        )}
      </div>

      {Object.keys(filteredSections).length > 0 ? (
        Object.entries(filteredSections).map(([sectionKey, section]) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(sectionKey);

          return (
            <div key={sectionKey} style={styles.section}>
              <div
                style={styles.sectionHeader}
                onClick={() => toggleSection(sectionKey)}
              >
                <div style={styles.sectionTitle}>
                  <Icon size={20} style={{ color: section.color }} />
                  {section.title}
                  <div
                    style={{
                      ...styles.sectionCount,
                      backgroundColor: section.color,
                    }}
                  >
                    {section.features.length}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>

              {isExpanded && (
                <div style={styles.featuresContainer}>
                  {section.features.map((feature, index) => (
                    <div key={index} style={styles.featureCard}>
                      <div style={styles.featureHeader}>
                        <h3 style={styles.featureName}>
                          {feature.name}
                          {feature.level && (
                            <span style={styles.levelBadge}>
                              Level {feature.level}
                            </span>
                          )}
                        </h3>
                        <div
                          style={{
                            ...styles.featureType,
                            backgroundColor: section.color,
                          }}
                        >
                          {feature.type}
                        </div>
                      </div>
                      <div style={styles.featureDescription}>
                        {feature.description}
                      </div>

                      {feature.details && feature.details.length > 0 && (
                        <div style={styles.featureDetails}>
                          <ul style={styles.detailsList}>
                            {feature.details.map((detail, detailIndex) => (
                              <li key={detailIndex} style={styles.detailItem}>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div style={styles.emptyState}>
          <Search size={48} style={styles.emptyIcon} />
          <div style={styles.emptyTitle}>
            {searchFilter
              ? "No Matching Features Found"
              : "No Features Available"}
          </div>
          <div style={styles.emptyText}>
            {searchFilter
              ? "Try adjusting your search terms to find relevant features."
              : "This character hasn't acquired any features yet."}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterFeatsDisplay;
