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
  Dna,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

import { houseFeatures } from "../../SharedData/houseData";
import { subclassesData } from "../../SharedData/subclassesData";
import { backgroundsData } from "../../SharedData/backgroundsData";
import { heritageDescriptions } from "../../SharedData/heritageData";
import { standardFeats } from "../../SharedData/standardFeatData";

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
      innateHeritage: {
        title: "Innate Heritage Features",
        icon: Dna,
        color: "#935b35ff",
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

    if (character.house && houseFeatures?.[character.house]) {
      const houseData = houseFeatures[character.house];
      const houseName = character.house;

      sections.house.features.push({
        name: `${houseName} Heritage`,
        type: "House Membership",
        source: houseName,
        level: null,
        description: `Member of ${houseName} house. Each house provides unique magical traits, ability score bonuses, and special abilities that reflect the house's values and traditions.`,
        details: [
          `House: ${houseName}`,
          `Fixed Ability Bonuses: ${
            houseData.fixed
              ?.map(
                (ability) =>
                  `+1 ${ability.charAt(0).toUpperCase() + ability.slice(1)}`
              )
              .join(", ") || "None"
          }`,
          "Grants house-specific features and abilities",
          "Access to house common room and resources",
          houseData.feat ? "Provides a free feat" : "",
        ].filter(Boolean),
      });

      if (houseData.features) {
        houseData.features.forEach((feature) => {
          sections.house.features.push({
            name: feature.name,
            type: feature.isChoice ? "House Choice" : "House Feature",
            source: houseName,
            level: null,
            description: feature.description,
            details:
              feature.isChoice && feature.options
                ? feature.options.map(
                    (opt) => `${opt.name}: ${opt.description}`
                  )
                : [feature.description],
          });
        });
      }

      if (character.houseChoices && character.houseChoices[character.house]) {
        const choices = character.houseChoices[character.house];
        Object.entries(choices).forEach(([choiceType, choiceValue]) => {
          const parentFeature = houseData.features?.find(
            (f) =>
              f.isChoice && f.options?.some((opt) => opt.name === choiceValue)
          );

          const selectedOption = parentFeature?.options?.find(
            (opt) => opt.name === choiceValue
          );

          sections.house.features.push({
            name: choiceValue,
            type: "Selected House Choice",
            source: houseName,
            level: null,
            description:
              selectedOption?.description ||
              `Selected ${choiceType}: ${choiceValue}`,
            details: [
              "Chosen during character creation",
              "Represents personal specialization within house training",
            ],
          });
        });
      }
    }

    if (character.subclass) {
      const subclassData = subclassesData?.[character.subclass];

      sections.subclass.features.push({
        name: character.subclass,
        type: "Specialization",
        source: "Class Training",
        level: character.subclassLevel || 1,
        description:
          subclassData?.description ||
          `Your specialized focus in ${character.subclass}. This represents advanced study and mastery in a particular school of magic or approach to spellcasting.`,
        details: [
          `Subclass Level: ${character.subclassLevel || 1}`,
          "Provides specialized abilities and bonuses",
          "Unlocks unique spellcasting techniques",
          "Reflects advanced magical education",
        ],
      });

      if (subclassData?.higherLevelFeatures) {
        const currentLevel = character.subclassLevel || 1;
        subclassData.higherLevelFeatures.forEach((levelFeature) => {
          if (levelFeature.level <= currentLevel) {
            sections.subclass.features.push({
              name: levelFeature.name,
              type: "Subclass Ability",
              source: character.subclass,
              level: levelFeature.level,
              description: levelFeature.description,
              details: levelFeature.choices
                ? levelFeature.choices.map(
                    (choice) => `${choice.name}: ${choice.description}`
                  )
                : [levelFeature.description],
            });
          }
        });
      }

      if (character.subclassChoices) {
        Object.entries(character.subclassChoices).forEach(([level, choice]) => {
          const choiceName =
            typeof choice === "string"
              ? choice
              : choice?.mainChoice ||
                choice?.selectedChoice ||
                choice?.name ||
                String(choice);

          sections.subclass.features.push({
            name: choiceName,
            type: "Subclass Choice",
            source: character.subclass,
            level: parseInt(level) || null,
            description: `A specialized technique or focus you've chosen as part of your ${character.subclass} training.`,
            details: [
              `Chosen at level ${level}`,
              "Represents personal specialization",
              "Enhances core subclass abilities",
            ],
          });
        });
      }
    }

    if (character.background && backgroundsData?.[character.background]) {
      const backgroundData = backgroundsData[character.background];

      sections.background.features.push({
        name: character.background,
        type: "Life Experience",
        source: "Personal History",
        level: null,
        description: backgroundData.description,
        details: [
          backgroundData.backgroundBonus ||
            "Provides specialized background training",
          "Influences roleplay and character motivations",
          "Reflects pre-adventure life experiences",
          ...(backgroundData.typicalEquipment
            ? [`Equipment: ${backgroundData.typicalEquipment}`]
            : []),
        ].filter(Boolean),
      });

      if (
        backgroundData.skillProficiencies &&
        backgroundData.skillProficiencies.length > 0
      ) {
        sections.background.features.push({
          name: "Background Skill Training",
          type: "Skill Proficiency",
          source: character.background,
          level: null,
          description: `Your ${character.background.toLowerCase()} background has given you training in specific skills that reflect your life experiences.`,
          details: backgroundData.skillProficiencies.map(
            (skill) => `Proficient in ${skill}`
          ),
        });
      }

      if (backgroundData.features) {
        backgroundData.features.forEach((feature) => {
          sections.background.features.push({
            name: feature.name,
            type: "Background Feature",
            source: character.background,
            level: null,
            description: feature.description,
            details: [feature.description],
          });
        });
      }
    }

    if (
      character.innateHeritage &&
      heritageDescriptions?.[character.innateHeritage]
    ) {
      const heritageData = heritageDescriptions[character.innateHeritage];

      sections.innateHeritage.features.push({
        name: `${character.innateHeritage} Heritage`,
        type: "Magical Heritage",
        source: "Innate Heritage",
        level: null,
        description: heritageData.description,
        details: heritageData.benefits || [
          "Innate magical characteristics",
          "Heritage-specific abilities",
          "Influences magical potential",
        ],
      });

      if (
        character.innateHeritageSkills &&
        character.innateHeritageSkills.length > 0
      ) {
        sections.innateHeritage.features.push({
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

      if (
        character.heritageChoices &&
        character.heritageChoices[character.innateHeritage]
      ) {
        const choices = character.heritageChoices[character.innateHeritage];
        Object.entries(choices).forEach(([featureName, choiceName]) => {
          const feature = heritageData.features?.find(
            (f) => f.name === featureName
          );
          const choiceDetails = feature?.options?.find(
            (opt) => opt.name === choiceName
          );

          sections.innateHeritage.features.push({
            name: choiceName,
            type: "Heritage Choice",
            source: character.innateHeritage,
            level: null,
            description:
              choiceDetails?.description ||
              `A specialized heritage trait you've developed or chosen to emphasize.`,
            details: [
              "Heritage-specific ability",
              "Chosen during character creation",
              "Reflects heritage specialization",
              ...(choiceDetails?.skillProficiencies
                ? choiceDetails.skillProficiencies.map(
                    (skill) => `Grants proficiency in ${skill}`
                  )
                : []),
            ].filter(Boolean),
          });
        });
      }

      if (heritageData.modifiers?.abilityIncreases?.length > 0) {
        const abilityIncreases = heritageData.modifiers.abilityIncreases
          .filter((inc) => inc.type === "fixed")
          .map(
            (inc) =>
              `+${inc.amount} ${
                inc.ability.charAt(0).toUpperCase() + inc.ability.slice(1)
              }`
          )
          .join(", ");

        if (abilityIncreases) {
          sections.innateHeritage.features.push({
            name: "Heritage Ability Enhancement",
            type: "Ability Bonus",
            source: character.innateHeritage,
            level: null,
            description: `Your heritage naturally enhances certain abilities.`,
            details: [`Ability Score Increases: ${abilityIncreases}`],
          });
        }
      }
    }

    const processedFeats = new Set();

    if (character.asiChoices) {
      Object.entries(character.asiChoices).forEach(([level, choice]) => {
        if (choice.type === "feat" && choice.selectedFeat) {
          const featKey = `${choice.selectedFeat}-${level}`;
          if (!processedFeats.has(featKey)) {
            processedFeats.add(featKey);

            const featData = standardFeats.find(
              (f) => f.name === choice.selectedFeat
            );

            sections.feats.features.push({
              name: choice.selectedFeat,
              type: "ASI Choice Feat",
              source: `Level ${level}`,
              level: parseInt(level),
              description:
                featData?.preview ||
                featData?.description?.[0] ||
                `A feat chosen instead of ability score improvement at level ${level}, representing specialized training or development.`,
              details: Array.isArray(featData?.description)
                ? featData.description
                : featData?.description
                ? [featData.description]
                : [
                    `Chosen at Level ${level}`,
                    "Selected instead of ability score increase",
                    "Provides specialized capabilities",
                    "Represents character development focus",
                  ],
            });
          }
        }
      });
    }

    if (character.standardFeats && character.standardFeats.length > 0) {
      character.standardFeats.forEach((featName) => {
        if (!processedFeats.has(featName)) {
          processedFeats.add(featName);

          const featData = standardFeats.find((f) => f.name === featName);

          sections.feats.features.push({
            name: featName,
            type: "Standard Feat",
            source: "Character Level",
            level: null,
            description:
              featData?.preview ||
              featData?.description?.[0] ||
              `A feat representing specialized training or natural talent that enhances your character's capabilities.`,
            details: Array.isArray(featData?.description)
              ? featData.description
              : featData?.description
              ? [featData.description]
              : [
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

            const featData = standardFeats.find((f) => f.name === featName);

            sections.feats.features.push({
              name: featName,
              type: "Level Feat",
              source: `Level ${level}`,
              level: parseInt(level),
              description:
                featData?.preview ||
                featData?.description?.[0] ||
                `A feat acquired at level ${level} through character advancement and training.`,
              details: Array.isArray(featData?.description)
                ? featData.description
                : featData?.description
                ? [featData.description]
                : [
                    `Acquired at Level ${level}`,
                    "Gained through character progression",
                    "Enhances character abilities",
                  ],
            });
          }
        } else {
          if (!processedFeats.has(featString)) {
            processedFeats.add(featString);

            const featData = standardFeats.find((f) => f.name === featString);

            sections.feats.features.push({
              name: featString,
              type: "Character Feat",
              source: "Character Creation",
              level: null,
              description:
                featData?.preview ||
                featData?.description?.[0] ||
                `A feat representing your character's background training or natural abilities.`,
              details: Array.isArray(featData?.description)
                ? featData.description
                : featData?.description
                ? [featData.description]
                : [
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
          (Array.isArray(feature.details)
            ? feature.details.some((detail) =>
                detail.toLowerCase().includes(searchTerm)
              )
            : false)
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

                      {feature.details && (
                        <div style={styles.featureDetails}>
                          {Array.isArray(feature.details) ? (
                            <ul style={styles.detailsList}>
                              {feature.details.map((detail, detailIndex) => (
                                <li key={detailIndex} style={styles.detailItem}>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div style={styles.detailItem}>
                              {feature.details}
                            </div>
                          )}
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
