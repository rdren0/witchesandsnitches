import { useState } from "react";
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
} from "lucide-react";
import { useRollFunctions } from "../../App/diceRoller";

import { useTheme } from "../../contexts/ThemeContext";
import { potions, qualityDCs } from "../data";
import { getMaxAchievableQuality } from "../../App/diceRoller";
import { createPotionsStyles } from "../../styles/masterStyles";

const PotionBrewingSystem = ({ character }) => {
  const { theme, selectedCharacter } = useTheme();
  const styles = createPotionsStyles(theme);
  const { rollBrewPotion } = useRollFunctions();

  const [isRolling, setIsRolling] = useState(false);
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [brewingInProgress, setBrewingInProgress] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [proficiencies, setProficiencies] = useState({
    potionMaking: 0,
    potioneersKit: false,
    herbologyKit: false,
  });

  const [ingredientQuality, setIngredientQuality] = useState("normal");

  const ingredientModifiers = {
    poor: 2,
    normal: 0,
    exceptional: -2,
    superior: -4,
  };

  const getDiceIcon = (value) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[Math.min(value - 1, 5)];
    return <IconComponent size={24} />;
  };

  const brewPotion = async () => {
    if (!selectedPotion) return;

    setBrewingInProgress(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const brewingResult = await rollBrewPotion({
        isRolling,
        setIsRolling,
        character: selectedCharacter,
        selectedPotion,
        proficiencies,
        ingredientQuality,
        qualityDCs,
        ingredientModifiers,
      });

      if (brewingResult) {
        const result = {
          ...brewingResult,
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

    // Get all potions from all years
    Object.entries(potions).forEach(([year, yearPotions]) => {
      allPotions.push(
        ...yearPotions.map((p) => ({ ...p, year: parseInt(year) }))
      );
    });

    // Filter by search term if provided
    if (searchTerm) {
      allPotions = allPotions.filter(
        (potion) =>
          potion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          potion.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allPotions;
  };

  const filteredPotions = getFilteredPotions();

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
                <option value={2}>Expertise</option>
              </select>
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
            <h4 style={styles.proficiencyTitle}>Ingredient Quality</h4>
            <select
              value={ingredientQuality}
              onChange={(e) => setIngredientQuality(e.target.value)}
              style={styles.select}
            >
              <option value="poor">Poor (+2 DC)</option>
              <option value="normal">Normal (±0 DC)</option>
              <option value="exceptional">Exceptional (-2 DC)</option>
              <option value="superior">Superior (-4 DC)</option>
            </select>

            <div style={styles.maxQualityInfo}>
              <strong>Max Achievable Quality:</strong>{" "}
              {getMaxAchievableQuality({ proficiencies, ingredientQuality })
                .charAt(0)
                .toUpperCase() +
                getMaxAchievableQuality({
                  proficiencies,
                  ingredientQuality,
                }).slice(1)}
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
            </div>
          )}

          <div style={styles.card}>
            <button
              onClick={brewPotion}
              disabled={!selectedPotion || brewingInProgress}
              style={{
                ...styles.brewButton,
                ...(!selectedPotion || brewingInProgress
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
                  <span style={styles.resultLabel}>Roll:</span>
                  <div style={styles.diceResult}>
                    {getDiceIcon(Math.min(lastResult.roll, 6))}
                    <span style={styles.diceValue}>{lastResult.roll}</span>
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
          <h3 style={styles.cardTitle}>Ingredient Quality Effects</h3>
          <div style={styles.ingredientEffectsList}>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>Poor:</span>
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
              <span style={styles.ingredientEffectLabel}>Normal:</span>
              <span style={styles.ingredientEffectValue}>±0 DC</span>
            </div>
            <div style={styles.ingredientEffectRow}>
              <span style={styles.ingredientEffectLabel}>Exceptional:</span>
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
              <span style={styles.ingredientEffectLabel}>Superior:</span>
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
