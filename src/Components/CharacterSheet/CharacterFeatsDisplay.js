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

    const normalizeSubclassName = (name) => {
      if (!name) return name;

      return [
        name,
        name.replace(/ and /g, " & "),
        name.replace(/ & /g, " and "),
        name.replace(/&/g, " & "),
        name.replace(/ {2,}/g, " "),
      ];
    };

    const findSubclassData = (subclassName) => {
      if (!subclassName || !subclassesData) return null;

      const variations = normalizeSubclassName(subclassName);
      for (const variant of variations) {
        if (subclassesData[variant]) {
          return subclassesData[variant];
        }
      }
      return null;
    };

    const parseAllFeaturesByLevel = (subclassData) => {
      if (!subclassData) return {};

      const featuresByLevel = {};

      if (subclassData.level1Features) {
        featuresByLevel[1] = {
          features: subclassData.level1Features || [],
          choices: subclassData.level1Choices || [],
        };
      }

      if (subclassData.higherLevelFeatures) {
        subclassData.higherLevelFeatures.forEach((feature) => {
          const level = feature.level;

          if (!featuresByLevel[level]) {
            featuresByLevel[level] = {
              features: [],
              choices: [],
            };
          }

          if (feature.choices && Array.isArray(feature.choices)) {
            featuresByLevel[level].choices.push(...feature.choices);

            featuresByLevel[level].features.push({
              name: feature.name,
              description: feature.description,
            });
          } else {
            featuresByLevel[level].features.push(feature);
          }
        });
      }

      return featuresByLevel;
    };

    if (character.house && houseFeatures?.[character.house]) {
      const houseData = houseFeatures[character.house];
      const houseName = character.house;

      sections.house.features.push({
        name: `${houseName} House`,
        type: "House Membership",
        source: houseName,
        level: null,
        description: `Member of ${houseName} house. Your house shapes your magical education and provides specialized training.`,
        details: [
          `Fixed Ability Bonuses: ${
            houseData.fixed
              ?.map(
                (ability) =>
                  `+1 ${ability.charAt(0).toUpperCase() + ability.slice(1)}`
              )
              .join(", ") || "None"
          }`,
          ...(houseData.feat ? ["Grants a free feat"] : []),
        ].filter(Boolean),
      });

      if (houseData.features && houseData.features.length > 0) {
        houseData.features.forEach((feature) => {
          if (!feature.isChoice) {
            sections.house.features.push({
              name: feature.name,
              type: "House Feature",
              source: houseName,
              level: null,
              description: feature.description,
              details: [],
            });
          } else {
            const userChoice =
              character.houseChoices?.[houseName]?.[feature.name];

            if (userChoice) {
              const selectedOption = feature.options?.find(
                (opt) => opt.name === userChoice
              );

              sections.house.features.push({
                name: `${feature.name}: ${userChoice} (Selected)`,
                type: "House Choice Feature",
                source: houseName,
                level: null,
                description:
                  selectedOption?.description ||
                  `Selected ${userChoice} for ${feature.name}`,
                details: selectedOption ? [selectedOption.description] : [],
              });
            } else {
              sections.house.features.push({
                name: feature.name,
                type: "House Choice Feature",
                source: houseName,
                level: null,
                description:
                  feature.description || "Choose one of the following options:",
                details:
                  feature.options?.map(
                    (opt) => `${opt.name}: ${opt.description}`
                  ) || [],
              });
            }
          }
        });
      }

      if (character.houseChoices?.[houseName]?.abilityChoice) {
        const chosenAbility = character.houseChoices[houseName].abilityChoice;
        sections.house.features.push({
          name: "House Ability Choice",
          type: "Selected Bonus",
          source: houseName,
          level: null,
          description: `+1 ${
            chosenAbility.charAt(0).toUpperCase() + chosenAbility.slice(1)
          } (chosen house bonus)`,
          details: [],
        });
      }
    }

    if (character.subclass) {
      const subclassData = findSubclassData(character.subclass);

      sections.subclass.features.push({
        name: character.subclass,
        type: "Specialization",
        source: "Class Training",
        level: character.subclassLevel || 1,
        description:
          subclassData?.description ||
          `Your specialized focus in ${character.subclass}.`,
        details: [],
      });

      if (character.subclassChoices && subclassData) {
        const featuresByLevel = parseAllFeaturesByLevel(subclassData);

        Object.entries(character.subclassChoices).forEach(([level, choice]) => {
          let choiceName, subChoiceName;

          if (typeof choice === "string") {
            choiceName = choice;
          } else if (typeof choice === "object") {
            if (choice.mainChoice) {
              choiceName = choice.mainChoice;
              subChoiceName = choice.subChoice;
            } else {
              choiceName =
                choice.name ||
                choice.selectedChoice ||
                choice.choice ||
                String(choice);
            }
          }

          let selectedOption = null;
          let fullDescription = null;

          const levelData = featuresByLevel[level];
          if (levelData && levelData.choices) {
            selectedOption = levelData.choices.find(
              (opt) => opt.name === choiceName
            );

            if (selectedOption) {
              if (
                selectedOption.hasNestedChoices &&
                selectedOption.nestedChoices &&
                subChoiceName
              ) {
                const nestedOption = selectedOption.nestedChoices.find(
                  (nested) => nested.name === subChoiceName
                );
                if (nestedOption) {
                  fullDescription = nestedOption.description;
                }
              } else {
                fullDescription = selectedOption.description;
              }
            }
          }

          const hasSpecialAbilities =
            selectedOption?.benefits?.specialAbilities?.length > 0;

          if (!hasSpecialAbilities) {
            const featureName = subChoiceName
              ? `${choiceName}: ${subChoiceName}`
              : choiceName;

            sections.subclass.features.push({
              name: `${featureName} (Selected)`,
              type: "Selected Subclass Choice",
              source: character.subclass,
              level: parseInt(level) || null,
              description:
                fullDescription ||
                `Your selected specialization from level ${level}`,
              details: fullDescription
                ? [fullDescription]
                : [`Selected at level ${level}: ${featureName}`],
            });
          }

          if (selectedOption && selectedOption.benefits) {
            const benefits = selectedOption.benefits;

            if (benefits.immunities && benefits.immunities.length > 0) {
              sections.subclass.features.push({
                name: `${choiceName} - Immunities`,
                type: "Choice Benefit",
                source: character.subclass,
                level: parseInt(level) || null,
                description: `Immunities gained from ${choiceName}`,
                details: benefits.immunities.map(
                  (immunity) => `Immune to ${immunity}`
                ),
              });
            }

            if (
              benefits.specialAbilities &&
              benefits.specialAbilities.length > 0
            ) {
              benefits.specialAbilities.forEach((ability) => {
                const abilityDetails = [];

                if (ability.type) abilityDetails.push(`Type: ${ability.type}`);
                if (ability.duration)
                  abilityDetails.push(`Duration: ${ability.duration}`);
                if (ability.tempHP)
                  abilityDetails.push(`Temporary HP: ${ability.tempHP}`);
                if (ability.save) abilityDetails.push(`Save: ${ability.save}`);
                if (ability.uses) abilityDetails.push(`Uses: ${ability.uses}`);
                if (ability.damage)
                  abilityDetails.push(`Damage: ${ability.damage}`);
                if (ability.range)
                  abilityDetails.push(`Range: ${ability.range}`);
                if (ability.effect)
                  abilityDetails.push(`Effect: ${ability.effect}`);

                sections.subclass.features.push({
                  name: ability.name || `${choiceName} - Special Ability`,
                  type: "Special Ability",
                  source: character.subclass,
                  level: parseInt(level) || null,
                  description:
                    ability.description || `Special ability from ${choiceName}`,
                  details: abilityDetails,
                });
              });
            }

            if (benefits.resistances && benefits.resistances.length > 0) {
              sections.subclass.features.push({
                name: `${choiceName} - Resistances`,
                type: "Choice Benefit",
                source: character.subclass,
                level: parseInt(level) || null,
                description: `Damage resistances gained from ${choiceName}`,
                details: benefits.resistances.map(
                  (res) => `Resistance to ${res} damage`
                ),
              });
            }

            if (benefits.languages && benefits.languages.length > 0) {
              sections.subclass.features.push({
                name: `${choiceName} - Languages`,
                type: "Choice Benefit",
                source: character.subclass,
                level: parseInt(level) || null,
                description: `Languages gained from ${choiceName}`,
                details: benefits.languages,
              });
            }
          }
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

      if (character.backgroundSkills && character.backgroundSkills.length > 0) {
        sections.background.features.push({
          name: "Background Skills",
          type: "Skill Proficiency",
          source: character.background,
          level: null,
          description: `Skills chosen from your ${character.background} background`,
          details: character.backgroundSkills.map(
            (skill) => `Proficient in ${skill}`
          ),
        });
      } else if (
        backgroundData.skillProficiencies &&
        backgroundData.skillProficiencies.length > 0
      ) {
        sections.background.features.push({
          name: "Background Skill Options",
          type: "Skill Proficiency",
          source: character.background,
          level: null,
          description: `Choose skills from your ${character.background} background`,
          details: [
            `Available: ${backgroundData.skillProficiencies.join(", ")}`,
          ],
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
            details: [],
          });
        });
      }
    }

    if (
      character.innateHeritage &&
      heritageDescriptions?.[character.innateHeritage]
    ) {
      const heritageData = heritageDescriptions[character.innateHeritage];
      const heritageName = character.innateHeritage;

      sections.innateHeritage.features.push({
        name: `${heritageName} Heritage`,
        type: "Magical Heritage",
        source: "Innate Heritage",
        level: null,
        description: heritageData.description,
        details: [],
      });

      if (heritageData.benefits && Array.isArray(heritageData.benefits)) {
        const validBenefits = heritageData.benefits.filter(
          (benefit) =>
            !benefit.includes("Choose one of") &&
            !benefit.startsWith("Option") &&
            !benefit.startsWith("Ability Score Increase")
        );

        validBenefits.forEach((benefit) => {
          let featureName = "Heritage Ability";
          let description = benefit;

          if (benefit.includes(":")) {
            const colonIndex = benefit.indexOf(":");
            const potentialName = benefit.substring(0, colonIndex).trim();
            if (potentialName.length < 50) {
              featureName = potentialName;
              description = benefit.substring(colonIndex + 1).trim();
            }
          }

          sections.innateHeritage.features.push({
            name: featureName,
            type: "Heritage Benefit",
            source: heritageName,
            level: null,
            description: description,
            details: [],
          });
        });
      }

      if (character.heritageChoices?.[heritageName]) {
        Object.entries(character.heritageChoices[heritageName]).forEach(
          ([featureName, choiceName]) => {
            const feature = heritageData.features?.find(
              (f) => f.name === featureName
            );
            const selectedOption = feature?.options?.find(
              (opt) => opt.name === choiceName
            );

            sections.innateHeritage.features.push({
              name: `${featureName}: ${choiceName} (Selected)`,
              type: "Selected Heritage Choice",
              source: heritageName,
              level: null,
              description:
                selectedOption?.description ||
                `Selected ${choiceName} for ${featureName}`,
              details: [
                ...(selectedOption?.skillProficiencies
                  ? selectedOption.skillProficiencies.map(
                      (skill) => `Grants proficiency in ${skill}`
                    )
                  : []),
                ...(selectedOption?.toolProficiencies
                  ? selectedOption.toolProficiencies.map(
                      (tool) => `Grants proficiency with ${tool}`
                    )
                  : []),
              ].filter(Boolean),
            });
          }
        );
      }

      if (heritageData.features && heritageData.features.length > 0) {
        heritageData.features.forEach((feature) => {
          if (feature.isChoice && feature.options) {
            const userChoice =
              character.heritageChoices?.[heritageName]?.[feature.name];

            if (!userChoice) {
              sections.innateHeritage.features.push({
                name: feature.name,
                type: "Heritage Choice Feature",
                source: heritageName,
                level: null,
                description: feature.description,
                details: feature.options.map(
                  (option) => `${option.name}: ${option.description}`
                ),
              });
            }
          } else if (!feature.isChoice) {
            sections.innateHeritage.features.push({
              name: feature.name,
              type: "Heritage Feature",
              source: heritageName,
              level: null,
              description: feature.description,
              details: [],
            });
          }
        });
      }

      if (
        character.innateHeritageSkills &&
        character.innateHeritageSkills.length > 0
      ) {
        sections.innateHeritage.features.push({
          name: "Heritage Skills",
          type: "Heritage Proficiency",
          source: heritageName,
          level: null,
          description: `Skills gained from your ${heritageName} heritage`,
          details: character.innateHeritageSkills.map(
            (skill) => `Proficient in ${skill}`
          ),
        });
      }
    }

    const processedFeats = new Set();

    const addFeat = (featName, featType, source, level, featData) => {
      if (processedFeats.has(featName)) {
        return;
      }

      processedFeats.add(featName);

      sections.feats.features.push({
        name: featName,
        type: featType,
        source: source,
        level: level,
        description:
          featData?.preview ||
          featData?.description?.[0] ||
          `A feat representing specialized training or natural talent that enhances your character's capabilities.`,
        details: Array.isArray(featData?.description)
          ? featData.description
          : featData?.description
          ? [featData.description]
          : [
              `Acquired through character progression`,
              "Provides specific mechanical benefits",
              "Represents focused training or talent",
            ],
      });
    };

    if (character.asiChoices) {
      Object.entries(character.asiChoices).forEach(([level, choice]) => {
        if (choice.type === "feat" && choice.selectedFeat) {
          const featData = standardFeats.find(
            (f) => f.name === choice.selectedFeat
          );

          addFeat(
            choice.selectedFeat,
            "ASI Choice Feat",
            `Level ${level}`,
            parseInt(level),
            featData
          );
        }
      });
    }

    if (character.allFeats && character.allFeats.length > 0) {
      character.allFeats.forEach((featString) => {
        const levelMatch = featString.match(/^(.+?)\s*\(Level\s+(\d+)\)$/);

        if (levelMatch) {
          const [, featName, level] = levelMatch;
          const featData = standardFeats.find((f) => f.name === featName);

          addFeat(
            featName,
            "Level Feat",
            `Level ${level}`,
            parseInt(level),
            featData
          );
        } else {
          const featData = standardFeats.find((f) => f.name === featString);

          addFeat(
            featString,
            "Character Feat",
            "Character Creation",
            null,
            featData
          );
        }
      });
    }

    if (character.standardFeats && character.standardFeats.length > 0) {
      character.standardFeats.forEach((featName) => {
        const featData = standardFeats.find((f) => f.name === featName);

        addFeat(featName, "Standard Feat", "Character Level", null, featData);
      });
    }

    Object.keys(sections).forEach((sectionKey) => {
      sections[sectionKey].features.sort((a, b) => {
        const levelA = a.level === null ? Infinity : a.level;
        const levelB = b.level === null ? Infinity : b.level;

        if (levelA !== levelB) {
          return levelA - levelB;
        }

        const getTypePriority = (type, section) => {
          if (section === "subclass") {
            if (type === "Specialization") return 0;
            if (type === "Selected Subclass Choice") return 1;
            return 2;
          } else if (section === "background") {
            if (type === "Life Experience") return 0;
            if (type === "Background Skills") return 1;
            return 2;
          } else if (section === "house") {
            if (type === "House Membership") return 0;
            if (type === "House Feature") return 1;
            if (type === "House Choice Feature") return 2;
            if (type === "Selected Bonus") return 3;
            return 4;
          } else if (section === "innateHeritage") {
            if (type === "Magical Heritage") return 0;
            if (type === "Heritage Benefit") return 1;
            if (type === "Selected Heritage Choice") return 2;
            if (type === "Heritage Feature") return 3;
            if (type === "Heritage Skills") return 4;
            return 5;
          }
          return 0;
        };

        const priorityA = getTypePriority(a.type, sectionKey);
        const priorityB = getTypePriority(b.type, sectionKey);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return a.name.localeCompare(b.name);
      });
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
                      {feature.description && (
                        <div style={styles.featureDescription}>
                          {feature.description}
                        </div>
                      )}

                      {feature.details && feature.details.length > 0 && (
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
