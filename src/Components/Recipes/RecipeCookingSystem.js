import { useState, useMemo } from "react";
import {
  ChefHat,
  Star,
  Search,
  Utensils,
  ArrowRight,
  Plus,
  Clock,
  Users,
  Filter,
} from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";

import { useTheme } from "../../contexts/ThemeContext";
import { recipes, recipeQualityDCs, recipeCategories } from "./recipesData";
import { createRecipesStyles } from "../../styles/masterStyles";
import { getDiscordWebhook } from "../../App/const";

const RecipeCookingSystem = ({ character, user, supabase }) => {
  const { theme, selectedCharacter } = useTheme();
  const styles = createRecipesStyles(theme);
  const { rollCookRecipe } = useRollFunctions();

  const [isRolling, setIsRolling] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // eslint-disable-next-line
  const [proficiencies, setProficiencies] = useState({
    cooking: 0,
    culinaryKit: true,
    herbologyKit: false,
  });

  const [ingredientQuality, setIngredientQuality] = useState("normal");

  const currentCharacter = useMemo(() => {
    return character || selectedCharacter;
  }, [character, selectedCharacter]);

  const getCharacterCookingModifier = useMemo(() => {
    if (!currentCharacter) return 0;

    const wisdomScore = currentCharacter.abilityScores?.wisdom || 10;
    const wisdomModifier = Math.floor((wisdomScore - 10) / 2);
    const intelligenceScore =
      currentCharacter.abilityScores?.intelligence || 10;
    const intelligenceModifier = Math.floor((intelligenceScore - 10) / 2);

    const level = currentCharacter.level || 1;
    const proficiencyBonus = Math.ceil(level / 4) + 1;

    const isCulinarian = currentCharacter.subclass === "Culinarian";
    const hasNoReservations =
      currentCharacter.subclassFeatures?.includes("No Reservations");

    let skillName = "survival";
    let baseModifier = wisdomModifier;

    if (isCulinarian && hasNoReservations) {
      skillName = "muggleStudies";
      baseModifier = intelligenceModifier;
    }

    const skillLevel = currentCharacter.skills?.[skillName] || 0;
    const skillProficiencies = currentCharacter.skillProficiencies || [];
    const skillExpertise = currentCharacter.skillExpertise || [];

    const isProficient =
      skillProficiencies.includes("Survival") ||
      skillProficiencies.includes("Muggle Studies") ||
      skillProficiencies.includes(skillName) ||
      isCulinarian;

    const hasExpertise =
      skillExpertise.includes("Survival") ||
      skillExpertise.includes("Muggle Studies") ||
      skillExpertise.includes(skillName);

    let skillBonus = 0;
    if (skillLevel === 1) {
      skillBonus = proficiencyBonus;
    } else if (skillLevel === 2) {
      skillBonus = proficiencyBonus * 2;
    } else if (hasExpertise) {
      skillBonus = proficiencyBonus * 2;
    } else if (isProficient) {
      skillBonus = proficiencyBonus;
    }

    const totalModifier = baseModifier + skillBonus;

    return totalModifier;
  }, [currentCharacter]);

  const ingredientModifiers = {
    flawed: 2,
    normal: 0,
    exceptional: -2,
    superior: -4,
  };

  const getFilteredRecipes = () => {
    const allRecipes = Object.values(recipes);

    let filtered = allRecipes;

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      const categoryRecipes = recipeCategories[selectedCategory] || [];
      filtered = filtered.filter((recipe) =>
        categoryRecipes.includes(recipe.name)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getSkillProficiencyInfo = useMemo(() => {
    const isCulinarian = currentCharacter?.subclass === "Culinarian";
    const hasNoReservations =
      currentCharacter?.subclassFeatures?.includes("No Reservations");

    let skillName = "Survival";
    let abilityName = "Wisdom";

    if (isCulinarian && hasNoReservations) {
      skillName = "Muggle Studies";
      abilityName = "Intelligence";
    }

    const skillLevel =
      currentCharacter?.skills?.survival ||
      currentCharacter?.skills?.muggleStudies ||
      0;
    const skillProficiencies = currentCharacter?.skillProficiencies || [];
    const skillExpertise = currentCharacter?.skillExpertise || [];

    const isProficient =
      skillProficiencies.includes("Survival") ||
      skillProficiencies.includes("Muggle Studies") ||
      isCulinarian;

    const hasExpertise =
      skillExpertise.includes("Survival") ||
      skillExpertise.includes("Muggle Studies");

    const proficiencyBonus = Math.ceil((currentCharacter?.level || 1) / 4) + 1;

    if (skillLevel === 2) {
      return {
        status: "expertise",
        bonus: proficiencyBonus * 2,
        description: `+${proficiencyBonus * 2} (expertise: 2x proficiency)`,
        skillName,
        abilityName,
      };
    } else if (skillLevel === 1) {
      return {
        status: "proficient",
        bonus: proficiencyBonus,
        description: `+${proficiencyBonus} (proficient)`,
        skillName,
        abilityName,
      };
    } else if (hasExpertise) {
      return {
        status: "expertise",
        bonus: proficiencyBonus * 2,
        description: `+${proficiencyBonus * 2} (expertise: 2x proficiency)`,
        skillName,
        abilityName,
      };
    } else if (isProficient) {
      return {
        status: "proficient",
        bonus: proficiencyBonus,
        description: `+${proficiencyBonus} (proficient)`,
        skillName,
        abilityName,
      };
    } else {
      return {
        status: "not proficient",
        bonus: 0,
        description: "+0 (not proficient)",
        skillName,
        abilityName,
      };
    }
  }, [
    currentCharacter?.skills?.survival,
    currentCharacter?.skills?.muggleStudies,
    currentCharacter?.skillProficiencies,
    currentCharacter?.skillExpertise,
    currentCharacter?.level,
    currentCharacter?.subclass,
    currentCharacter?.subclassFeatures,
  ]);

  const filteredRecipes = getFilteredRecipes();
  const characterModifier = getCharacterCookingModifier;

  const rollRecipe = async () => {
    const webhookUrl = getDiscordWebhook(character?.gameSession);

    if (!selectedRecipe || isRolling) return;

    setIsRolling(true);

    try {
      await rollCookRecipe({
        isRolling,
        setIsRolling,
        character: currentCharacter,
        selectedRecipe,
        proficiencies,
        ingredientQuality,
        qualityDCs: recipeQualityDCs,
        ingredientModifiers,
        characterModifier,
        webhookUrl,
        addRecipeToInventory: true,
        currentCharacter,
        supabase,
        user,
        rawIngredientQuality: ingredientQuality,
      });
    } catch (error) {
      console.error("Error rolling recipe:", error);
    } finally {
      setIsRolling(false);
    }
  };

  const categories = [
    { key: "all", label: "All Recipes", icon: Utensils },
    { key: "combat", label: "Combat", icon: Star },
    { key: "utility", label: "Utility", icon: Users },
    { key: "support", label: "Support", icon: Plus },
    { key: "healing", label: "Healing", icon: ArrowRight },
    { key: "spellcasting", label: "Spellcasting", icon: Clock },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <ChefHat size={32} style={styles.headerIcon} />
          <div>
            <h1 style={styles.title}>Recipe Cooking System</h1>
            <p style={styles.subtitle}>
              Prepare magical meals to enhance your party's abilities
            </p>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.recipeLibrary}>
          <div style={styles.searchAndFilter}>
            <div style={styles.searchContainer}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.categoryFilter}>
              <Filter size={16} style={styles.filterIcon} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.categorySelect}
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.recipeCount}>
            {filteredRecipes.length} recipe
            {filteredRecipes.length !== 1 ? "s" : ""} found
          </div>

          <div style={styles.recipeGrid}>
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.name}
                onClick={() => setSelectedRecipe(recipe)}
                style={{
                  ...styles.recipeItem,
                  ...(selectedRecipe?.name === recipe.name
                    ? styles.recipeItemSelected
                    : {}),
                }}
              >
                <div style={styles.recipeHeader}>
                  <h3 style={styles.recipeName}>{recipe.name}</h3>
                  <div style={styles.recipeMeta}>
                    <span style={styles.recipeTime}>
                      <Clock size={14} />
                      {recipe.eatingTime}
                    </span>
                    <span style={styles.recipeDuration}>
                      <Users size={14} />
                      {recipe.duration}
                    </span>
                  </div>
                </div>
                <p style={styles.recipeDescription}>{recipe.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.cookingInterface}>
          {selectedRecipe && (
            <div style={styles.selectedRecipeCard}>
              <h2 style={styles.selectedRecipeTitle}>
                <Utensils /> Cooking: {selectedRecipe.name}
              </h2>
              <p style={styles.selectedRecipeDescription}>
                {selectedRecipe.description}
              </p>

              <div style={styles.recipeDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Eating Time:</span>
                  <span style={styles.detailValue}>
                    {selectedRecipe.eatingTime}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Duration:</span>
                  <span style={styles.detailValue}>
                    {selectedRecipe.duration}
                  </span>
                </div>
              </div>

              <div style={styles.rollPreview}>
                <div style={styles.rollPreviewContent}>
                  <div style={styles.ingredientSection}>
                    <h3 style={styles.sectionTitle}>Ingredient Quality</h3>
                    <div style={styles.ingredientControls}>
                      {Object.keys(ingredientModifiers).map((quality) => (
                        <button
                          key={quality}
                          onClick={() => setIngredientQuality(quality)}
                          style={{
                            ...styles.qualityButton,
                            ...(ingredientQuality === quality
                              ? styles.qualityButtonActive
                              : {}),
                          }}
                        >
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                          <span style={styles.qualityModifier}>
                            {ingredientModifiers[quality] > 0 && "+"}
                            {ingredientModifiers[quality]} DC
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    marginTop: "8px",
                  }}
                >
                  <div>
                    <strong>Your Modifier Breakdown:</strong>
                  </div>
                  <div>
                    • {getSkillProficiencyInfo.abilityName} Modifier:{" "}
                    {Math.floor(
                      ((currentCharacter?.abilityScores?.[
                        getSkillProficiencyInfo.abilityName.toLowerCase()
                      ] || 10) -
                        10) /
                        2
                    ) >= 0
                      ? "+"
                      : ""}
                    {Math.floor(
                      ((currentCharacter?.abilityScores?.[
                        getSkillProficiencyInfo.abilityName.toLowerCase()
                      ] || 10) -
                        10) /
                        2
                    )}
                  </div>
                  <div>
                    • {getSkillProficiencyInfo.skillName}:{" "}
                    {getSkillProficiencyInfo.description}
                  </div>
                  <div>
                    •{" "}
                    <strong>
                      Total Skill Modifier: {characterModifier >= 0 ? "+" : ""}
                      {characterModifier}
                    </strong>
                  </div>
                  {currentCharacter?.subclass === "Culinarian" && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontStyle: "italic",
                        color: theme.primary,
                      }}
                    >
                      📚 Culinarian: Using {getSkillProficiencyInfo.skillName}{" "}
                      for recipe cooking
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.cookingControls}>
                <button
                  onClick={rollRecipe}
                  disabled={isRolling || !selectedRecipe}
                  style={{
                    ...styles.cookButton,
                    ...(isRolling ? styles.cookButtonDisabled : {}),
                  }}
                >
                  {isRolling ? (
                    <>
                      <div style={styles.spinner} />
                      Cooking...
                    </>
                  ) : (
                    <>
                      <ChefHat />
                      Cook Recipe
                    </>
                  )}
                </button>
              </div>
              {/* 
              <div style={styles.qualityEffects}>
                <h3 style={styles.sectionTitle}>Quality Effects</h3>
                <div style={styles.qualityList}>
                  {Object.entries(selectedRecipe.qualities).map(
                    ([quality, effect]) => (
                      <div key={quality} style={styles.qualityEffect}>
                        <div
                          style={{
                            ...styles.qualityEffectHeader,
                            ...styles[
                              `quality${
                                quality.charAt(0).toUpperCase() +
                                quality.slice(1)
                              }`
                            ],
                          }}
                        >
                          <Star size={16} />
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </div>
                        <p style={styles.qualityEffectText}>{effect}</p>
                      </div>
                    )
                  )}
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>

      <div style={styles.referenceGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quality DCs</h3>
          <div style={styles.referenceTable}>
            <div style={styles.referenceTableHeader}>
              <div>Quality</div>
              <div>DC Required</div>
            </div>
            {Object.entries(recipeQualityDCs).map(([quality, dc]) => (
              <div key={quality} style={styles.referenceTableRow}>
                <div style={styles.referenceTableRowHeader}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </div>
                <div>{dc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Ingredient Preparation Effects</h3>
          <div style={styles.ingredientEffectsList}>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>
                Flawed (prepared):
              </span>
              <span
                style={{
                  ...styles.ingredientEffectValue,
                  ...styles.ingredientEffectHarder,
                }}
              >
                +2 DC (harder)
              </span>
            </div>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>
                Normal (prepared):
              </span>
              <span style={styles.ingredientEffectValue}>±0 DC</span>
            </div>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>
                Exceptional (prepared):
              </span>
              <span
                style={{
                  ...styles.ingredientEffectValue,
                  ...styles.ingredientEffectEasier,
                }}
              >
                -2 DC (easier)
              </span>
            </div>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>
                Superior (prepared):
              </span>
              <span
                style={{
                  ...styles.ingredientEffectValue,
                  ...styles.ingredientEffectEasier,
                }}
              >
                -4 DC (easier)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCookingSystem;
