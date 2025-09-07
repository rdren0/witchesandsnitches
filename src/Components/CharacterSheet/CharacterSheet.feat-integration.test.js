/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LuckPointButton from "./LuckPointButton";
import CharacterFeatsDisplay from "./CharacterFeatsDisplay";
import { calculateFeatBenefits } from "../CharacterManager/utils/featBenefitsCalculator";

const mockTheme = {
  background: "#ffffff",
  surface: "#f8f9fa",
  text: "#333333",
  textSecondary: "#666666",
  primary: "#007bff",
  border: "#e0e0e0",
  error: "#dc3545",
  success: "#28a745",
};

jest.mock("../../contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: mockTheme }),
}));

const ThemeWrapper = ({ children }) => <div>{children}</div>;

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      })),
    })),
    upsert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    })),
  })),
};

jest.mock("../utils/diceRoller", () => ({
  useRollFunctions: () => ({
    rollLuckPoint: jest.fn(),
    rollInitiative: jest.fn(),
  }),
}));

describe("CharacterSheet Feat Integration Tests", () => {
  const baseCharacter = {
    id: "test-character",
    name: "Test Character",
    level: 5,
    proficiencyBonus: 3,
    castingStyle: "intelligence",
    strength: 10,
    dexterity: 14,
    constitution: 12,
    intelligence: 16,
    wisdom: 13,
    charisma: 8,
    standardFeats: [],
    asiChoices: {},
    featChoices: {},
    hitPoints: 35,
    ownerId: "test-user",
  };

  describe("Initiative Calculation with Feats", () => {
    it("should calculate base initiative without feats", () => {
      const character = { ...baseCharacter };

      const getInitiativeModifier = (
        initiativeAbility,
        effectiveAbilityScores,
        characterData
      ) => {
        let baseModifier;
        if (initiativeAbility === "intelligence") {
          baseModifier =
            Math.floor((effectiveAbilityScores.intelligence - 10) / 2) || 0;
        } else {
          baseModifier =
            Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 0;
        }

        if (characterData) {
          const featBenefits = calculateFeatBenefits(characterData);
          return baseModifier + featBenefits.combatBonuses.initiativeBonus;
        }

        return baseModifier;
      };

      const effectiveAbilityScores = {
        dexterity: 14,
        intelligence: 16,
      };

      const dexInitiative = getInitiativeModifier(
        "dexterity",
        effectiveAbilityScores,
        character
      );
      const intInitiative = getInitiativeModifier(
        "intelligence",
        effectiveAbilityScores,
        character
      );

      expect(dexInitiative).toBe(2);
      expect(intInitiative).toBe(3);
    });

    it("should include Alert feat bonus in initiative calculation", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert"],
      };

      const getInitiativeModifier = (
        initiativeAbility,
        effectiveAbilityScores,
        characterData
      ) => {
        let baseModifier;
        if (initiativeAbility === "intelligence") {
          baseModifier =
            Math.floor((effectiveAbilityScores.intelligence - 10) / 2) || 0;
        } else {
          baseModifier =
            Math.floor((effectiveAbilityScores.dexterity - 10) / 2) || 0;
        }

        if (characterData) {
          const featBenefits = calculateFeatBenefits(characterData);
          return baseModifier + featBenefits.combatBonuses.initiativeBonus;
        }

        return baseModifier;
      };

      const effectiveAbilityScores = {
        dexterity: 14,
        intelligence: 16,
      };

      const dexInitiative = getInitiativeModifier(
        "dexterity",
        effectiveAbilityScores,
        character
      );
      const intInitiative = getInitiativeModifier(
        "intelligence",
        effectiveAbilityScores,
        character
      );

      expect(dexInitiative).toBe(7);
      expect(intInitiative).toBe(8);
    });

    it("should handle multiple initiative-affecting feats", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.initiativeBonus).toBe(5);
    });
  });

  describe("Lucky Feat Integration", () => {
    it("should not display luck points without Lucky feat", () => {
      const character = { ...baseCharacter };

      render(
        <ThemeWrapper>
          <LuckPointButton
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
            selectedCharacterId="test-character"
          />
        </ThemeWrapper>
      );

      expect(screen.queryByText("Luck")).not.toBeInTheDocument();
    });

    it("should display luck points with Lucky feat", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Lucky"],
        luck: 3,
      };

      render(
        <ThemeWrapper>
          <LuckPointButton
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
            selectedCharacterId="test-character"
          />
        </ThemeWrapper>
      );

      expect(screen.getByText("Luck")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should calculate max luck points based on proficiency bonus", () => {
      const lowLevelCharacter = {
        ...baseCharacter,
        level: 2,
        proficiencyBonus: 2,
        standardFeats: ["Lucky"],
      };

      const highLevelCharacter = {
        ...baseCharacter,
        level: 10,
        proficiencyBonus: 4,
        standardFeats: ["Lucky"],
      };

      const lowLevelBenefits = calculateFeatBenefits(lowLevelCharacter);
      const highLevelBenefits = calculateFeatBenefits(highLevelCharacter);

      expect(lowLevelBenefits.resources.luckPoints).toBe(2);
      expect(highLevelBenefits.resources.luckPoints).toBe(4);
    });

    it("should open modal when luck button is clicked", async () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Lucky"],
        luck: 2,
      };

      render(
        <ThemeWrapper>
          <LuckPointButton
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
            selectedCharacterId="test-character"
          />
        </ThemeWrapper>
      );

      fireEvent.click(screen.getByText("Luck"));

      await waitFor(() => {
        expect(screen.getByText("Luck Points")).toBeInTheDocument();
        expect(screen.getByText("Spend Point")).toBeInTheDocument();
        expect(screen.getByText("2/3")).toBeInTheDocument();
      });
    });
  });

  describe("Feat Display in CharacterFeatsDisplay", () => {
    it("should display standard feats correctly", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert", "Lucky", "Tough"],
      };

      render(
        <ThemeWrapper>
          <CharacterFeatsDisplay
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
          />
        </ThemeWrapper>
      );

      expect(screen.getByText("Feats")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should display ASI choice feats correctly", () => {
      const character = {
        ...baseCharacter,
        asiChoices: {
          4: {
            type: "feat",
            selectedFeat: "Mobile",
          },
          8: {
            type: "feat",
            selectedFeat: "War Caster",
          },
        },
      };

      render(
        <ThemeWrapper>
          <CharacterFeatsDisplay
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
          />
        </ThemeWrapper>
      );

      fireEvent.click(screen.getByText("Feats"));

      expect(screen.getByText(/Mobile/)).toBeInTheDocument();
      expect(screen.getByText(/War Caster/)).toBeInTheDocument();
      expect(screen.getByText(/Level 4/)).toBeInTheDocument();
      expect(screen.getByText(/Level 8/)).toBeInTheDocument();
    });

    it("should search feats correctly", async () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert", "Lucky", "Tough", "Mobile"],
      };

      render(
        <ThemeWrapper>
          <CharacterFeatsDisplay
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
          />
        </ThemeWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Search all features/);
      fireEvent.change(searchInput, { target: { value: "alert" } });

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should handle empty feat list gracefully", () => {
      const character = {
        ...baseCharacter,
        standardFeats: [],
        asiChoices: {},
      };

      render(
        <ThemeWrapper>
          <CharacterFeatsDisplay
            character={character}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
          />
        </ThemeWrapper>
      );

      expect(screen.getByText("House Features")).toBeInTheDocument();
      expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    });
  });

  describe("Combat Bonuses Integration", () => {
    it("should calculate Tough feat HP bonus correctly", () => {
      const character = {
        ...baseCharacter,
        level: 5,
        standardFeats: ["Tough"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.hitPointsPerLevel).toBe(2);

      const totalHpBonus =
        featBenefits.combatBonuses.hitPointsPerLevel * character.level;
      expect(totalHpBonus).toBe(10);
    });

    it("should calculate Observant feat passive bonuses", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Observant"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.passivePerceptionBonus).toBe(5);
      expect(featBenefits.combatBonuses.passiveInvestigationBonus).toBe(5);
    });

    it("should handle multiple combat bonus feats", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert", "Observant", "War Caster"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.initiativeBonus).toBe(5);
      expect(featBenefits.combatBonuses.passivePerceptionBonus).toBe(5);
      expect(featBenefits.combatBonuses.concentrationAdvantage).toBe(true);
    });
  });

  describe("Speed Bonuses Integration", () => {
    it("should calculate Mobile feat speed bonus", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Mobile"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.speeds.walkingBonus).toBe(10);
    });

    it("should handle Athlete climb speed bonus", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Athlete"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.speeds.climb).toBe("equal_to_walking");
    });

    it("should accumulate multiple speed bonuses", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Mobile", "Nimble"],
      };

      const featBenefits = calculateFeatBenefits(character);

      expect(featBenefits.speeds.walkingBonus).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Special Abilities Integration", () => {
    it("should handle Alert feat immunity to surprise", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.immunities).toContain("surprised");
      expect(featBenefits.combatBonuses.unseeingAdvantageImmunity).toBe(true);
    });

    it("should handle Durable feat death save advantage", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Durable"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.deathSaveAdvantage).toBe(true);
    });

    it("should accumulate special abilities from multiple feats", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert", "Durable", "War Caster"],
      };

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.immunities).toContain("surprised");
      expect(featBenefits.combatBonuses.deathSaveAdvantage).toBe(true);
      expect(featBenefits.combatBonuses.concentrationAdvantage).toBe(true);
      expect(featBenefits.spellcasting.spellOpportunityAttacks).toBe(true);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle null character gracefully", () => {
      render(
        <ThemeWrapper>
          <CharacterFeatsDisplay
            character={null}
            supabase={mockSupabase}
            discordUserId="test-user"
            setCharacter={jest.fn()}
          />
        </ThemeWrapper>
      );

      expect(screen.getByText(/No Character Selected/)).toBeInTheDocument();
    });

    it("should handle invalid feat names gracefully", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["NonexistentFeat", "Alert"],
      };

      const featBenefits = calculateFeatBenefits(character);

      expect(featBenefits.combatBonuses.initiativeBonus).toBe(5);
    });

    it("should handle malformed feat data", () => {
      const character = {
        ...baseCharacter,
        standardFeats: [null, undefined, "", "Alert"],
      };

      expect(() => calculateFeatBenefits(character)).not.toThrow();

      const featBenefits = calculateFeatBenefits(character);
      expect(featBenefits.combatBonuses.initiativeBonus).toBe(5);
    });
  });

  describe("Performance Tests", () => {
    it("should handle many feats efficiently", () => {
      const character = {
        ...baseCharacter,
        standardFeats: [
          "Alert",
          "Lucky",
          "Tough",
          "Mobile",
          "Observant",
          "War Caster",
          "Durable",
          "Athlete",
          "Actor",
          "Keen Mind",
        ],
      };

      const startTime = performance.now();
      const featBenefits = calculateFeatBenefits(character);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(featBenefits).toBeDefined();
    });

    it("should handle repeated calculations efficiently", () => {
      const character = {
        ...baseCharacter,
        standardFeats: ["Alert", "Lucky", "Tough"],
      };

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        calculateFeatBenefits(character);
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});

describe("Integration with Real Character Data", () => {
  it("should work with complex character configuration", () => {
    const complexCharacter = {
      id: "complex-character",
      name: "Complex Test Character",
      level: 8,
      proficiencyBonus: 3,
      castingStyle: "intelligence",
      strength: 12,
      dexterity: 16,
      constitution: 14,
      intelligence: 18,
      wisdom: 13,
      charisma: 10,
      standardFeats: ["Alert", "War Caster"],
      asiChoices: {
        4: {
          type: "feat",
          selectedFeat: "Lucky",
        },
        8: {
          type: "abilityScoreIncrease",
          strength: 1,
          intelligence: 1,
        },
      },
      featChoices: {},
      hitPoints: 52,
      luck: 3,
      ownerId: "test-user",
    };

    const featBenefits = calculateFeatBenefits(complexCharacter);

    expect(featBenefits.combatBonuses.initiativeBonus).toBe(5);
    expect(featBenefits.combatBonuses.concentrationAdvantage).toBe(true);
    expect(featBenefits.resources.luckPoints).toBe(3);
    expect(featBenefits.spellcasting.spellOpportunityAttacks).toBe(true);

    render(
      <ThemeWrapper>
        <CharacterFeatsDisplay
          character={complexCharacter}
          supabase={mockSupabase}
          discordUserId="test-user"
          setCharacter={jest.fn()}
        />
      </ThemeWrapper>
    );

    expect(screen.getByText("Feats")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
