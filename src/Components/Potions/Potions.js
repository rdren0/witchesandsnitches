import { useState, useMemo } from "react";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Beaker,
  Star,
  Search,
  FlaskRound,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useRollFunctions } from "../utils/diceRoller";

import { useTheme } from "../../contexts/ThemeContext";
import { potions, qualityDCs } from "./potionsData";
import { createPotionsStyles } from "../../styles/masterStyles";

const PotionBrewingSystem = ({ character, supabase, user }) => {
  const { theme, selectedCharacter } = useTheme();
  const styles = createPotionsStyles(theme);
  const { rollBrewPotion } = useRollFunctions();

  const [isRolling, setIsRolling] = useState(false);
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [brewingSkills, setBrewingSkill] = useState("potionMaking");
  const [brewingInProgress, setBrewingInProgress] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [proficiencies, setProficiencies] = useState({
    potionMaking: 0,
    potioneersKit: true,
    herbologyKit: false,
  });

  const [ingredientQuality, setIngredientQuality] = useState("normal");

  const currentCharacter = useMemo(() => {
    return character || selectedCharacter;
  }, [character, selectedCharacter]);

  const getCharacterPotionModifier = useMemo(() => {
    if (!currentCharacter) return 0;

    const wisdomScore = currentCharacter.abilityScores?.wisdom || 10;
    const wisdomModifier = Math.floor((wisdomScore - 10) / 2);

    const level = currentCharacter.level || 1;
    const proficiencyBonus = Math.ceil(level / 4) + 1;

    const skillLevel = currentCharacter.skills?.potionMaking || 0;

    const skillProficiencies = currentCharacter.skillProficiencies || [];
    const skillExpertise = currentCharacter.skillExpertise || [];

    const isProficientInPotionMaking =
      skillProficiencies.includes("Potion Making") ||
      skillProficiencies.includes("Potion-Making") ||
      skillProficiencies.includes("potionMaking");

    const hasExpertiseInPotionMaking =
      skillExpertise.includes("Potion Making") ||
      skillExpertise.includes("Potion-Making") ||
      skillExpertise.includes("potionMaking");

    let skillBonus = 0;
    if (skillLevel === 1) {
      skillBonus = proficiencyBonus;
    } else if (skillLevel === 2) {
      skillBonus = proficiencyBonus * 2;
    } else if (hasExpertiseInPotionMaking) {
      skillBonus = proficiencyBonus * 2;
    } else if (isProficientInPotionMaking) {
      skillBonus = proficiencyBonus;
    }

    const totalModifier = wisdomModifier + skillBonus;

    return totalModifier;
  }, [currentCharacter]);

  const ingredientModifiers = {
    flawed: 2,
    normal: 0,
    exceptional: -2,
    superior: -4,
  };

  const transformIngredientQuality = (rawQuality, proficiencies) => {
    const hasKit = proficiencies.potioneersKit || proficiencies.herbologyKit;

    if (!hasKit) {
      return null;
    }

    const profLevel = proficiencies.potionMaking;

    const transformationTable = {
      0: {
        poor: "flawed",
        normal: "flawed",
        exceptional: "normal",
        superior: "normal",
      },
      1: {
        poor: "flawed",
        normal: "normal",
        exceptional: "normal",
        superior: "normal",
      },
      2: {
        poor: "normal",
        normal: "normal",
        exceptional: "exceptional",
        superior: "exceptional",
      },
      3: {
        poor: "normal",
        normal: "exceptional",
        exceptional: "exceptional",
        superior: "exceptional",
      },
      4: {
        poor: "exceptional",
        normal: "exceptional",
        exceptional: "superior",
        superior: "superior",
      },
    };

    const transforms = transformationTable[profLevel] || transformationTable[0];
    return transforms[rawQuality] || rawQuality;
  };

  const getPreparedIngredientQuality = () => {
    return transformIngredientQuality(ingredientQuality, proficiencies);
  };

  const getMaxAchievableQuality = () => {
    const preparedQuality = getPreparedIngredientQuality();
    if (!preparedQuality) return "Cannot brew without kit";

    const qualityHierarchy = ["flawed", "normal", "exceptional", "superior"];
    const preparedIndex = qualityHierarchy.indexOf(preparedQuality);

    if (preparedIndex === -1) {
      console.error("Invalid prepared ingredient quality:", preparedQuality);
      return "flawed";
    }

    const maxIndex = Math.min(preparedIndex + 2, qualityHierarchy.length - 1);
    const maxQuality = qualityHierarchy[maxIndex];

    return maxQuality;
  };

  const getDiceIcon = (value) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[Math.min(value - 1, 5)];
    return <IconComponent size={24} />;
  };

  const getPotionValue = (quality, rarity) => {
    const baseValues = {
      common: {
        flawed: "5g",
        normal: "25g",
        exceptional: "50g",
        superior: "100g",
      },
      uncommon: {
        flawed: "25g",
        normal: "100g",
        exceptional: "200g",
        superior: "400g",
      },
      rare: {
        flawed: "100g",
        normal: "500g",
        exceptional: "1000g",
        superior: "2000g",
      },
      "very rare": {
        flawed: "500g",
        normal: "2500g",
        exceptional: "5000g",
        superior: "10000g",
      },
      legendary: {
        flawed: "2500g",
        normal: "12500g",
        exceptional: "25000g",
        superior: "50000g",
      },
    };

    return baseValues[rarity]?.[quality] || "Unknown";
  };

  const addPotionToInventory = async (brewingResult) => {
    if (!supabase || !currentCharacter?.id || !user) {
      console.error("Missing required data for inventory addition");
      return false;
    }

    try {
      const potionItem = {
        name: `${
          brewingResult.achievedQuality.charAt(0).toUpperCase() +
          brewingResult.achievedQuality.slice(1)
        } ${brewingResult.potion.name}`,
        description: `${
          brewingResult.potion.description
        }\n\nBrewed on ${new Date().toLocaleString()} with ${ingredientQuality} ingredients (prepared to ${getPreparedIngredientQuality()}). Roll: ${
          brewingResult.diceRoll || brewingResult.roll
        } + ${brewingResult.characterModifier} = ${
          (brewingResult.diceRoll || brewingResult.roll) +
          brewingResult.characterModifier
        }`,
        quantity: 1,
        value: getPotionValue(
          brewingResult.achievedQuality,
          brewingResult.potion.rarity
        ),
        category: "Potion",
        attunement_required: false,
        character_id: currentCharacter.id,
        discord_user_id: user?.discord_user_id || user?.id,
      };

      const { data, error } = await supabase
        .from("inventory_items")
        .insert([potionItem])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error adding potion to inventory:", error);
      return false;
    }
  };

  const brewPotion = async () => {
    if (!selectedPotion) return;

    const preparedQuality = getPreparedIngredientQuality();
    if (!preparedQuality) {
      alert(
        "You need either a Potioneer's Kit or Herbology Kit to brew potions!"
      );
      return;
    }

    setBrewingInProgress(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const characterModifier = getCharacterPotionModifier;

      const brewingResult = await rollBrewPotion({
        isRolling,
        setIsRolling,
        character: selectedCharacter || character,
        selectedPotion,
        proficiencies,
        ingredientQuality: preparedQuality,
        qualityDCs,
        ingredientModifiers,
        characterModifier,

        addPotionToInventory,
        currentCharacter,
        supabase,
        user,
        rawIngredientQuality: ingredientQuality,
      });

      if (brewingResult) {
        const result = {
          ...brewingResult,
          rawIngredientQuality: ingredientQuality,
          preparedIngredientQuality: preparedQuality,
          characterModifier,
          timestamp: new Date().toLocaleString(),
        };
        setLastResult(result);
      }
    } catch (error) {
      console.error("Error brewing potion:", error);
    } finally {
      setBrewingInProgress(false);
    }
  };

  const getFilteredPotions = () => {
    let allPotions = [];

    Object.entries(potions).forEach(([year, yearPotions]) => {
      allPotions.push(
        ...yearPotions.map((p) => ({ ...p, year: parseInt(year) }))
      );
    });

    if (searchTerm) {
      allPotions = allPotions.filter(
        (potion) =>
          potion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          potion.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allPotions;
  };

  const getSkillProficiencyInfo = useMemo(() => {
    const skillLevel = currentCharacter?.skills?.potionMaking || 0;
    const skillProficiencies = currentCharacter?.skillProficiencies || [];
    const skillExpertise = currentCharacter?.skillExpertise || [];

    const isProficientInPotionMaking =
      skillProficiencies.includes("Potion Making") ||
      skillProficiencies.includes("Potion-Making") ||
      skillProficiencies.includes("potionMaking");

    const hasExpertiseInPotionMaking =
      skillExpertise.includes("Potion Making") ||
      skillExpertise.includes("Potion-Making") ||
      skillExpertise.includes("potionMaking");

    const proficiencyBonus = Math.ceil((currentCharacter?.level || 1) / 4) + 1;

    if (skillLevel === 2) {
      return {
        status: "expertise",
        bonus: proficiencyBonus * 2,
        description: `+${proficiencyBonus * 2} (expertise: 2x proficiency)`,
      };
    } else if (skillLevel === 1) {
      return {
        status: "proficient",
        bonus: proficiencyBonus,
        description: `+${proficiencyBonus} (proficient)`,
      };
    } else if (hasExpertiseInPotionMaking) {
      return {
        status: "expertise",
        bonus: proficiencyBonus * 2,
        description: `+${proficiencyBonus * 2} (expertise: 2x proficiency)`,
      };
    } else if (isProficientInPotionMaking) {
      return {
        status: "proficient",
        bonus: proficiencyBonus,
        description: `+${proficiencyBonus} (proficient)`,
      };
    } else {
      return {
        status: "not proficient",
        bonus: 0,
        description: "+0 (not proficient)",
      };
    }
  }, [
    currentCharacter?.skills?.potionMaking,
    currentCharacter?.skillProficiencies,
    currentCharacter?.skillExpertise,
    currentCharacter?.level,
  ]);

  const filteredPotions = getFilteredPotions();
  const preparedQuality = getPreparedIngredientQuality();
  const characterModifier = getCharacterPotionModifier;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <FlaskRound /> Potion Brewing
      </h1>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Character Proficiencies & Ingredients</h3>

        <div style={styles.proficiencyGrid}>
          <div style={styles.proficiencySection}>
            <h4 style={styles.proficiencyTitle}>Proficiencies</h4>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Potion-Making</label>
              <select
                value={proficiencies.potionMaking}
                onChange={(e) =>
                  setProficiencies((prev) => ({
                    ...prev,
                    potionMaking: parseInt(e.target.value),
                  }))
                }
                style={styles.select}
              >
                <option value={0}>No Proficiency</option>
                <option value={1}>Proficient</option>
                <option value={2}>2 Proficiencies or 1 Expertise</option>
                <option value={3}>1 Proficiency + 1 Expertise</option>
                <option value={4}>2 Expertise</option>
              </select>
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={brewingSkills === "potionMaking"}
                  onChange={(e) => ({})}
                />
                Potion Making
              </label>

              {/* <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={brewingSkills === "medicine"}
                  onChange={(e) => ({})}
                />
                Medicine
              </label> */}
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={proficiencies.potioneersKit}
                  onChange={(e) =>
                    setProficiencies((prev) => ({
                      ...prev,
                      potioneersKit: e.target.checked,
                    }))
                  }
                />
                Potioneer's Kit
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={proficiencies.herbologyKit}
                  onChange={(e) =>
                    setProficiencies((prev) => ({
                      ...prev,
                      herbologyKit: e.target.checked,
                    }))
                  }
                />
                Herbology Kit
              </label>
            </div>
          </div>

          <div style={styles.proficiencySection}>
            <h4 style={styles.proficiencyTitle}>Raw Ingredient Quality</h4>
            <select
              value={ingredientQuality}
              onChange={(e) => setIngredientQuality(e.target.value)}
              style={styles.select}
            >
              <option value="poor">Poor (raw ingredients)</option>
              <option value="normal">Normal (raw ingredients)</option>
              <option value="exceptional">Exceptional (raw ingredients)</option>
              <option value="superior">Superior (raw ingredients)</option>
            </select>

            {preparedQuality && (
              <div style={styles.ingredientTransformation}>
                <div style={styles.transformationRow}>
                  <span style={styles.rawQuality}>
                    {ingredientQuality.charAt(0).toUpperCase() +
                      ingredientQuality.slice(1)}{" "}
                    (raw)
                  </span>
                  <ArrowRight
                    size={16}
                    style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}
                  />
                  <span style={styles.preparedQuality}>
                    {preparedQuality.charAt(0).toUpperCase() +
                      preparedQuality.slice(1)}{" "}
                    (prepared)
                  </span>
                </div>
                <div style={styles.dcModifier}>
                  DC Modifier:{" "}
                  {ingredientModifiers[preparedQuality] > 0 ? "+" : ""}
                  {ingredientModifiers[preparedQuality]}
                </div>
              </div>
            )}

            <div style={styles.maxQualityInfo}>
              <strong>Max Achievable Quality:</strong>{" "}
              {getMaxAchievableQuality()}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <Search style={styles.searchIcon} size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search potions..."
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Select Potion to Brew</h2>

          <div style={styles.potionList}>
            {filteredPotions.map((potion, index) => (
              <div
                key={`${potion.year}-${index}`}
                onClick={() => setSelectedPotion(potion)}
                style={{
                  ...styles.potionItem,
                  ...(selectedPotion?.name === potion.name
                    ? styles.potionItemSelected
                    : {}),
                }}
              >
                <div style={styles.potionHeader}>
                  <h3 style={styles.potionName}>{potion.name}</h3>
                  <div style={styles.potionMeta}>
                    <span style={styles.potionYear}>Year {potion.year}</span>
                    <span
                      style={{
                        ...styles.rarityBadge,
                        backgroundColor:
                          styles.rarityColors[potion.rarity] ||
                          styles.rarityColors.common,
                      }}
                    >
                      {potion.rarity}
                    </span>
                  </div>
                </div>
                <p style={styles.potionDescription}>{potion.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.brewingInterface}>
          {selectedPotion && (
            <div style={styles.selectedPotionCard}>
              <h2 style={styles.selectedPotionTitle}>
                <FlaskRound /> Brewing: {selectedPotion.name}
              </h2>
              <p style={styles.selectedPotionDescription}>
                {selectedPotion.description}
              </p>

              <div style={styles.rollPreview}>
                <div style={styles.rollPreviewContent}></div>
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
                    • Wisdom Modifier:{" "}
                    {Math.floor(
                      ((currentCharacter?.abilityScores?.wisdom || 10) - 10) / 2
                    ) >= 0
                      ? "+"
                      : ""}
                    {Math.floor(
                      ((currentCharacter?.abilityScores?.wisdom || 10) - 10) / 2
                    )}
                  </div>
                  <div>
                    • Potion Making Skill: {getSkillProficiencyInfo.description}
                  </div>
                  <div>
                    •{" "}
                    <strong>
                      Total Skill Modifier: {characterModifier >= 0 ? "+" : ""}
                      {characterModifier}
                    </strong>
                  </div>
                </div>
                {selectedPotion.rarity && qualityDCs[selectedPotion.rarity] && (
                  <div
                    style={{
                      backgroundColor: theme.surface,
                      padding: "4px",
                      margin: "6px",
                      border: `2px solid ${theme.primary}`,
                      borderRadius: "8px",
                      fontSize: "18px",
                    }}
                  >
                    <div
                      style={{
                        padding: "2px",
                        paddingBottom: "4px",
                      }}
                    >
                      Quality Thresholds:
                    </div>
                    {[
                      "superior",
                      "exceptional",
                      "normal",
                      "flawed",
                      "ruined",
                    ].map((quality) => {
                      const baseDC =
                        qualityDCs[selectedPotion.rarity][quality] || 0;
                      const adjustedDC =
                        baseDC + (ingredientModifiers[preparedQuality] || 0);
                      const maxQuality = getMaxAchievableQuality();

                      const qualityHierarchy = [
                        "ruined",
                        "flawed",
                        "normal",
                        "exceptional",
                        "superior",
                      ];
                      const maxIndex = qualityHierarchy.indexOf(maxQuality);
                      const qualityIndex = qualityHierarchy.indexOf(quality);

                      const isAchievable =
                        maxQuality !== "Cannot brew without kit" &&
                        qualityIndex <= maxIndex;

                      let displayText;
                      if (!isAchievable) {
                        displayText = "Not achievable";
                      } else if (quality === "ruined") {
                        const flawedDC =
                          qualityDCs[selectedPotion.rarity]["flawed"] || 0;
                        const flawedAdjustedDC =
                          flawedDC +
                          (ingredientModifiers[preparedQuality] || 0);
                        const totalNeededForFlawed = flawedAdjustedDC;
                        const ruinedMaxTotal = totalNeededForFlawed - 1;
                        displayText =
                          ruinedMaxTotal >= 1
                            ? `${ruinedMaxTotal} or less total`
                            : "Impossible to avoid";
                      } else {
                        const totalNeeded = adjustedDC;
                        if (totalNeeded > 20 + characterModifier) {
                          displayText = "Impossible";
                        } else if (totalNeeded <= 1 + characterModifier) {
                          displayText = "Automatic";
                        } else {
                          displayText = `${totalNeeded}+ total`;
                        }
                      }

                      return (
                        <div key={quality} style={styles.thresholdCard}>
                          <span style={styles.thresholdCardTitle}>
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                            :
                          </span>
                          <span>{displayText}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <button
              onClick={brewPotion}
              disabled={
                !selectedPotion || brewingInProgress || !preparedQuality
              }
              style={{
                ...styles.brewButton,
                ...(!selectedPotion || brewingInProgress || !preparedQuality
                  ? styles.brewButtonDisabled
                  : {}),
              }}
            >
              <Beaker
                size={24}
                className={brewingInProgress ? "animate-bounce" : ""}
              />
              {brewingInProgress ? "Brewing..." : "Brew Potion!"}
            </button>
            {!preparedQuality && (
              <div style={styles.warningText}>
                You need either a Potioneer's Kit or Herbology Kit to brew
                potions!
              </div>
            )}
          </div>

          {lastResult && (
            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Brewing Result</h3>

              <div style={styles.resultGrid}>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Potion:</span>
                  <span style={styles.resultValue}>
                    {lastResult.potion.name}
                  </span>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Ingredients Used:</span>
                  <span style={styles.resultValue}>
                    {lastResult.rawIngredientQuality} →{" "}
                    {lastResult.preparedIngredientQuality}
                  </span>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Roll:</span>
                  <div style={styles.diceResult}>
                    {getDiceIcon(
                      Math.min(lastResult.diceRoll || lastResult.roll, 6)
                    )}
                    <span style={styles.diceValue}>
                      {lastResult.diceRoll || lastResult.roll}
                      <Plus size={12} style={{ margin: "0 2px" }} />
                      {lastResult.characterModifier >= 0 ? "+" : ""}
                      {lastResult.characterModifier}
                      {lastResult.total &&
                        lastResult.total !==
                          (lastResult.diceRoll || lastResult.roll) && (
                          <span style={styles.totalValue}>
                            {" "}
                            = {lastResult.total}
                          </span>
                        )}
                    </span>
                  </div>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Target DC:</span>
                  <span style={styles.resultValue}>{lastResult.targetDC}</span>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Quality Achieved:</span>
                  <span
                    style={{
                      ...styles.qualityResult,
                      ...styles[
                        `quality${
                          lastResult.achievedQuality.charAt(0).toUpperCase() +
                          lastResult.achievedQuality.slice(1)
                        }`
                      ],
                    }}
                  >
                    <Star size={16} />
                    {lastResult.achievedQuality}
                  </span>
                </div>

                <div style={styles.resultTimestamp}>
                  Brewed on {lastResult.timestamp}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.referenceGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quality DCs by Rarity</h3>
          <div style={styles.referenceTable}>
            <div style={styles.referenceTableHeader}>
              <div>Rarity</div>
              <div>Flawed</div>
              <div>Normal</div>
              <div>Exceptional</div>
              <div>Superior</div>
            </div>
            {Object.entries(qualityDCs).map(([rarity, dcs]) => (
              <div key={rarity} style={styles.referenceTableRow}>
                <div style={styles.referenceTableRowHeader}>{rarity}</div>
                <div>{dcs.flawed}</div>
                <div>{dcs.normal}</div>
                <div>{dcs.exceptional}</div>
                <div>{dcs.superior}</div>
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

export default PotionBrewingSystem;
