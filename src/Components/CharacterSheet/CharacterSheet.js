import { useState, useEffect } from "react";
import { User, Shield, Heart, Zap, Dice6, ChevronUp } from "lucide-react";
import { styles } from "./characterSheetStyles";
import { Skills } from "./Skills";
import { formatModifier, modifiers } from "./utils";

const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

const CharacterSheet = ({ user, customUsername, supabase, className = "" }) => {
  const discordUserId = user?.user_metadata?.provider_id;

  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [character, setCharacter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!discordUserId) {
        setError("No user ID available");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("characters")
          .select("id, name, house, casting_style, level")
          .eq("discord_user_id", discordUserId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCharacters(data || []);

        if (data && data.length > 0) {
          setSelectedCharacterId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [discordUserId, supabase]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!selectedCharacterId) {
        setCharacter(null);
        return;
      }

      setCharacterLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", selectedCharacterId)
          .eq("discord_user_id", discordUserId)
          .single();

        if (error) throw error;

        if (data) {
          const transformedCharacter = {
            name: data.name,
            house: data.house,
            year: `Level ${data.level}`,
            background: data.background || "Unknown",
            bloodStatus: data.innate_heritage || "Unknown",
            wand: data.wand_type || "Unknown wand",
            strength: data.ability_scores?.strength || 10,
            dexterity: data.ability_scores?.dexterity || 10,
            constitution: data.ability_scores?.constitution || 10,
            intelligence: data.ability_scores?.intelligence || 10,
            wisdom: data.ability_scores?.wisdom || 10,
            charisma: data.ability_scores?.charisma || 10,
            hitPoints: data.hit_points || 1,
            armorClass:
              11 + Math.floor((data.ability_scores?.dexterity - 10) / 2) || 11,
            speed: 30,
            proficiencyBonus: Math.ceil(data.level / 4) + 1,
            skills: transformSkillProficiencies(data.skill_proficiencies || []),
            castingStyle: data.casting_style,
            subclass: data.subclass,
            standardFeats: data.standard_feats || [],
            magicModifiers: data.magic_modifiers || {},
          };

          setCharacter(transformedCharacter);
        }
      } catch (err) {
        console.error("Error fetching character:", err);
        setError(err.message);
      } finally {
        setCharacterLoading(false);
      }
    };

    fetchCharacter();
  }, [selectedCharacterId, discordUserId, supabase]);

  const transformSkillProficiencies = (skillArray) => {
    const skillMap = {
      Athletics: "athletics",
      Acrobatics: "acrobatics",
      "Sleight of Hand": "sleightOfHand",
      Stealth: "stealth",
      Herbology: "herbology",
      "History of Magic": "historyOfMagic",
      Investigation: "investigation",
      "Magical Theory": "magicalTheory",
      "Muggle Studies": "muggleStudies",
      Insight: "insight",
      "Magical Creatures": "magicalCreatures",
      Medicine: "medicine",
      Perception: "perception",
      "Potion Making": "potionMaking",
      Survival: "survival",
      Deception: "deception",
      Intimidation: "intimidation",
      Performance: "performance",
      Persuasion: "persuasion",
    };

    const skills = {};

    Object.values(skillMap).forEach((skill) => {
      skills[skill] = false;
    });

    skillArray.forEach((skillName) => {
      const mappedSkill = skillMap[skillName];
      if (mappedSkill) {
        skills[mappedSkill] = true;
      }
    });

    return skills;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <h2>Loading Characters...</h2>
          <p>Please wait while we fetch your characters.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Characters</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>No Characters Found</h2>
          <p>
            You haven't created any characters yet. Go to Character Creation to
            get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, ...{ className } }}>
      <div style={styles.characterSelector}>
        <h2 style={styles.selectorTitle}>
          <User className="w-5 h-5" />
          Select Character
        </h2>
        <div style={styles.selectContainer}>
          <select
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            style={styles.select}
          >
            <option value="">Choose a character...</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name} ({char.house} - Level {char.level}{" "}
                {char.casting_style})
              </option>
            ))}
          </select>
        </div>
      </div>

      {characterLoading && (
        <div style={styles.loadingContainer}>
          <h3>Loading Character Sheet...</h3>
        </div>
      )}

      {character && !characterLoading && (
        <>
          <div style={styles.headerCard}>
            <div style={styles.headerFlex}>
              <div style={styles.avatar}>
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={styles.characterName}>{character.name}</h1>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>House:</span> {character.house}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Level:</span> {character.year}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Class:</span>{" "}
                    {character.castingStyle}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Subclass:</span>{" "}
                    {character.subclass || "None"}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Background:</span>{" "}
                    {character.background}
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Heritage:</span>{" "}
                    {character.bloodStatus}
                  </div>
                  <div style={{ ...styles.infoItem, gridColumn: "span 2" }}>
                    <span style={styles.label}>Wand:</span> {character.wand}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.combatStats}>
              <div style={{ ...styles.statCard, ...styles.statCardRed }}>
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueRed }}>
                  {character.hitPoints}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelRed }}>
                  Hit Points
                </div>
              </div>
              <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueBlue }}>
                  {character.armorClass}
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelBlue }}>
                  Armor Class
                </div>
              </div>
              <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div style={{ ...styles.statValue, ...styles.statValueGreen }}>
                  {character.speed} ft
                </div>
                <div style={{ ...styles.statLabel, ...styles.statLabelGreen }}>
                  Speed
                </div>
              </div>
            </div>
          </div>

          <div style={styles.abilityCard}>
            <h2 style={styles.abilityTitle}>Ability Scores</h2>
            <div style={styles.abilityGrid}>
              {[
                { name: "Strength", key: "strength" },
                { name: "Dexterity", key: "dexterity" },
                { name: "Constitution", key: "constitution" },
                { name: "Intelligence", key: "intelligence" },
                { name: "Wisdom", key: "wisdom" },
                { name: "Charisma", key: "charisma" },
              ].map((ability) => (
                <div key={ability.key} style={styles.abilityItem}>
                  <span style={styles.abilityName}>{ability.name}</span>
                  <div style={styles.abilityModifier}>
                    {formatModifier(modifiers(character)[ability.key])}
                  </div>
                  <div style={styles.abilityScore}>
                    {character[ability.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Skills
            character={character}
            supabase={supabase}
            discordUserId={discordUserId}
            setCharacter={setCharacter}
            selectedCharacterId={selectedCharacterId}
          />
          <div style={styles.instructionsCard}>
            <div style={styles.instructionsGrid}>
              <div style={styles.instructionItem}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#1f2937",
                    border: "2px solid #1f2937",
                  }}
                />
                <span>
                  Click circle to add proficiency bonus (+
                  {character.proficiencyBonus})
                </span>
              </div>
              <div style={styles.instructionItem}>
                <Dice6 className="w-4 h-4 text-blue-500" />
                <span>Click skill name to roll d20 + modifier</span>
              </div>
              <div style={styles.instructionItem}>
                <ChevronUp className="w-4 h-4 text-purple-500" />
                <span>Click column headers to sort skills</span>
              </div>
            </div>
            {!discordWebhookUrl && (
              <div style={styles.warning}>
                ⚠️ No Discord webhook configured - rolls will show as alerts
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterSheet;
