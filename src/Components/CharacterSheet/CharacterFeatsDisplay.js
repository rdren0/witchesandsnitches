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

      if (houseData.features) {
        if (houseData.features.length === 1) {
          const feature = houseData.features[0];
          sections.house.features.push({
            name: feature.name,
            type: feature.isChoice ? "House Choice Feature" : "House Feature",
            source: houseName,
            level: null,
            description: feature.description,
            details:
              feature.isChoice && feature.options
                ? feature.options.map(
                    (opt) => `${opt.name}: ${opt.description}`
                  )
                : [],
          });
        } else if (houseData.features.length > 1) {
          sections.house.features.push({
            name: "House Abilities",
            type: "House Features",
            source: houseName,
            level: null,
            description: `Your training in ${houseName} house has granted you specialized abilities and techniques.`,
            details: houseData.features.map((feature) =>
              feature.isChoice && feature.options
                ? `${feature.name}: ${feature.description}`
                : `${feature.name}: ${feature.description}`
            ),
          });
        }
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
          `Your specialized focus in ${character.subclass}.`,
        details: [],
      });

      if (character.subclassChoices) {
        Object.entries(character.subclassChoices).forEach(([level, choice]) => {
          const choiceName =
            typeof choice === "string"
              ? choice
              : choice?.mainChoice ||
                choice?.selectedChoice ||
                choice?.name ||
                String(choice);

          let selectedOption = null;
          if (subclassData?.higherLevelFeatures) {
            for (const feature of subclassData.higherLevelFeatures) {
              if (feature.choices && feature.choices.length > 0) {
                const foundOption = feature.choices.find(
                  (opt) => opt.name === choiceName
                );
                if (foundOption) {
                  selectedOption = foundOption;
                  break;
                }
              }
            }
          }

          sections.subclass.features.push({
            name: `${choiceName} (Selected)`,
            type: "Selected Subclass Choice",
            source: character.subclass,
            level: parseInt(level) || null,
            description: `Your selected specialization from level ${level}`,
            details: selectedOption?.description
              ? [selectedOption.description]
              : [`Your chosen specialization: ${choiceName}`],
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
      const heritageName = character.innateHeritage;

      sections.innateHeritage.features.push({
        name: `${heritageName} Heritage`,
        type: "Magical Heritage",
        source: "Innate Heritage",
        level: null,
        description: "",
        details: [heritageData.description],
      });

      const processedBenefitTexts = new Set();

      if (heritageData.benefits && Array.isArray(heritageData.benefits)) {
        const validBenefits = heritageData.benefits.filter(
          (benefit) =>
            !benefit.includes("Choose one of") &&
            !benefit.startsWith("Option") &&
            !benefit.startsWith("Ability Score Increase")
        );

        if (validBenefits.length === 1) {
          const benefit = validBenefits[0];
          let featureName = "Heritage Ability";
          let description = benefit;

          if (benefit.includes(":")) {
            const colonIndex = benefit.indexOf(":");
            const potentialName = benefit.substring(0, colonIndex).trim();
            if (potentialName.length < 50) {
              featureName = potentialName;
              description = benefit.substring(colonIndex + 1).trim();
            }
          } else if (benefit.toLowerCase().includes("proficiency")) {
            featureName = "Heritage Proficiencies";
          } else if (benefit.toLowerCase().includes("cantrip")) {
            featureName = "Heritage Magic";
          } else if (benefit.toLowerCase().includes("spell")) {
            featureName = "Heritage Spellcasting";
          } else if (benefit.toLowerCase().includes("resistance")) {
            featureName = "Heritage Resistance";
          } else if (benefit.toLowerCase().includes("darkvision")) {
            featureName = "Heritage Darkvision";
          }

          sections.innateHeritage.features.push({
            name: featureName,
            type: "Heritage Ability",
            source: heritageName,
            level: null,
            description: description,
            details: [],
          });
        } else if (validBenefits.length > 1) {
          let primaryDescription = heritageData.description;

          const firstBenefit = validBenefits[0];
          if (
            firstBenefit &&
            !firstBenefit.includes("Gain proficiency") &&
            !firstBenefit.includes("You can") &&
            firstBenefit.length > 50
          ) {
            primaryDescription = firstBenefit;
          }

          sections.innateHeritage.features.push({
            name: "Heritage Abilities",
            type: "Heritage Benefits",
            source: heritageName,
            level: null,
            description: primaryDescription,
            details: validBenefits,
          });
        }
      }

      if (heritageData.modifiers?.abilityIncreases?.length > 0) {
        heritageData.modifiers.abilityIncreases.forEach((increase) => {
          if (increase.type === "fixed") {
            let specificBenefit = null;
            if (heritageData.benefits) {
              specificBenefit = heritageData.benefits.find(
                (benefit) =>
                  benefit.includes("Ability Score Increase") &&
                  benefit.toLowerCase().includes(increase.ability.toLowerCase())
              );
            }

            if (specificBenefit) {
              const abilityName =
                increase.ability.charAt(0).toUpperCase() +
                increase.ability.slice(1);

              sections.innateHeritage.features.push({
                name: `${abilityName} Enhancement`,
                type: "Ability Bonus",
                source: heritageName,
                level: null,
                description: specificBenefit,
                details: [],
              });
            }
          }
        });
      }

      if (heritageData.modifiers?.abilityDecreases?.length > 0) {
        heritageData.modifiers.abilityDecreases.forEach((decrease) => {
          if (decrease.type === "fixed") {
            let specificBenefit = null;
            if (heritageData.benefits) {
              specificBenefit = heritageData.benefits.find(
                (benefit) =>
                  benefit
                    .toLowerCase()
                    .includes(decrease.ability.toLowerCase()) &&
                  (benefit.includes("Reduce") || benefit.includes("-"))
              );
            }

            if (specificBenefit) {
              const abilityName =
                decrease.ability.charAt(0).toUpperCase() +
                decrease.ability.slice(1);

              sections.innateHeritage.features.push({
                name: `${abilityName} Trade-off`,
                type: "Ability Penalty",
                source: heritageName,
                level: null,
                description: specificBenefit,
                details: [],
              });
            }
          }
        });
      }

      if (heritageData.modifiers?.skillProficiencies?.length > 0) {
        const skillsCoveredInBenefits = heritageData.benefits?.some(
          (benefit) =>
            benefit.toLowerCase().includes("proficiency") &&
            heritageData.modifiers.skillProficiencies.some((skill) =>
              benefit.toLowerCase().includes(skill.toLowerCase())
            )
        );

        if (!skillsCoveredInBenefits) {
          let specificBenefit = null;
          if (heritageData.benefits) {
            specificBenefit = heritageData.benefits.find(
              (benefit) =>
                benefit.toLowerCase().includes("proficiency") ||
                benefit.toLowerCase().includes("gain proficiency")
            );
          }

          sections.innateHeritage.features.push({
            name: "Heritage Skill Training",
            type: "Heritage Proficiency",
            source: heritageName,
            level: null,
            description:
              specificBenefit ||
              `Your ${heritageName.toLowerCase()} heritage provides training in specialized skills.`,
            details: heritageData.modifiers.skillProficiencies.map(
              (skill) => `Proficient in ${skill}`
            ),
          });
        }
      }

      if (heritageData.features && heritageData.features.length > 0) {
        heritageData.features.forEach((feature) => {
          if (feature.isChoice && feature.options) {
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
          } else {
            sections.innateHeritage.features.push({
              name: feature.name,
              type: "Heritage Feature",
              source: heritageName,
              level: null,
              description: feature.description,
              details: [feature.description],
            });
          }
        });
      }

      if (
        character.heritageChoices &&
        character.heritageChoices[heritageName]
      ) {
        const choices = character.heritageChoices[heritageName];
        Object.entries(choices).forEach(([featureName, choiceName]) => {
          const parentFeature = heritageData.features?.find(
            (f) => f.name === featureName
          );
          const selectedOption = parentFeature?.options?.find(
            (opt) => opt.name === choiceName
          );

          sections.innateHeritage.features.push({
            name: `${choiceName} (Selected)`,
            type: "Selected Heritage Choice",
            source: heritageName,
            level: null,
            description:
              selectedOption?.description ||
              `Your chosen specialization: ${choiceName}`,
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
        });
      }

      if (
        character.innateHeritageSkills &&
        character.innateHeritageSkills.length > 0
      ) {
        const skillsAlreadyCovered =
          heritageData.modifiers?.skillProficiencies?.length > 0 ||
          heritageData.benefits?.some((benefit) =>
            character.innateHeritageSkills.some((skill) =>
              benefit.toLowerCase().includes(skill.toLowerCase())
            )
          );

        if (!skillsAlreadyCovered) {
          let specificBenefit = null;
          if (heritageData.benefits) {
            specificBenefit = heritageData.benefits.find((benefit) =>
              character.innateHeritageSkills.some((skill) =>
                benefit.toLowerCase().includes(skill.toLowerCase())
              )
            );
          }

          sections.innateHeritage.features.push({
            name: "Heritage Skill Aptitude",
            type: "Heritage Proficiency",
            source: heritageName,
            level: null,
            description:
              specificBenefit ||
              `Your ${heritageName.toLowerCase()} heritage grants natural aptitude in specialized skills.`,
            details: character.innateHeritageSkills.map(
              (skill) => `Heritage proficiency: ${skill}`
            ),
          });
        }
      }

      if (heritageData.modifiers?.other) {
        const otherAbilities = heritageData.modifiers.other;
        Object.entries(otherAbilities).forEach(([abilityKey, value]) => {
          if (value === true || (typeof value === "number" && value > 0)) {
            let specificBenefit = null;
            if (heritageData.benefits) {
              specificBenefit = heritageData.benefits.find((benefit) => {
                const lowerBenefit = benefit.toLowerCase();
                const lowerKey = abilityKey.toLowerCase();

                if (
                  abilityKey === "darkvision" &&
                  lowerBenefit.includes("darkvision")
                ) {
                  return true;
                } else if (
                  abilityKey === "speedBonus" &&
                  (lowerBenefit.includes("speed") ||
                    lowerBenefit.includes("walking"))
                ) {
                  return true;
                } else if (
                  abilityKey === "naturalWeapons" &&
                  (lowerBenefit.includes("hooves") ||
                    lowerBenefit.includes("talons") ||
                    lowerBenefit.includes("natural weapon"))
                ) {
                  return true;
                } else if (
                  abilityKey === "poisonResistance" &&
                  lowerBenefit.includes("poison resistance")
                ) {
                  return true;
                } else if (
                  abilityKey === "keenSmell" &&
                  lowerBenefit.includes("keen smell")
                ) {
                  return true;
                } else if (
                  abilityKey === "muscularBuild" &&
                  lowerBenefit.includes("muscular build")
                ) {
                  return true;
                } else if (
                  abilityKey === "heftyBuild" &&
                  lowerBenefit.includes("hefty")
                ) {
                  return true;
                } else if (
                  abilityKey === "nimbleBody" &&
                  lowerBenefit.includes("nimble body")
                ) {
                  return true;
                } else if (
                  lowerKey
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .split(" ")
                    .some((word) => lowerBenefit.includes(word))
                ) {
                  return true;
                }
                return false;
              });
            }

            if (
              specificBenefit &&
              !specificBenefit.includes("Ability Score Increase") &&
              !processedBenefitTexts.has(specificBenefit)
            ) {
              let featureName, description;
              if (specificBenefit.includes(":")) {
                const colonIndex = specificBenefit.indexOf(":");
                featureName = specificBenefit.substring(0, colonIndex).trim();
                description = specificBenefit.substring(colonIndex + 1).trim();
              } else {
                featureName = abilityKey
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();
                description = specificBenefit;
              }

              processedBenefitTexts.add(specificBenefit);

              sections.innateHeritage.features.push({
                name: featureName,
                type: "Heritage Ability",
                source: heritageName,
                level: null,
                description: description,
                details: [],
              });
            }
          }
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
            return 1;
          } else if (section === "house") {
            if (type === "House Membership") return 0;
            return 1;
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
