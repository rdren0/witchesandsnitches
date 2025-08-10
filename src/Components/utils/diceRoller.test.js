import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  RollResultModal,
  RollModalProvider,
  useRollModal,
  calculateSkillBonus,
  applyRavenclawBonus,
  applyHornedSerpentBonus,
  rollDice,
  rollAbilityCheckWithProficiency,
  rollMagicCasting,
  rollAbility,
  rollBrewPotion,
  rollInitiative,
  rollSkill,
  attemptSpell,
  attemptArithmancySpell,
  attemptRunesSpell,
  rollCookRecipe,
  rollGenericD20,
  rollSavingThrow,
  rollResearch,
  rollFlexibleDice,
  rollCorruption,
  rollAbilityStat,
  getMaxAchievableQuality,
  getProficiencyAnalysis,
  useRollFunctions,
  rollFlexibleDie,
  hasSubclassFeature,
} from "./diceRoller";

jest.mock("@dice-roller/rpg-dice-roller", () => ({
  DiceRoller: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  X: ({ size, ...props }) => <div data-testid="x-icon" {...props} />,
  Dice6: ({ size, style, ...props }) => (
    <div data-testid="dice6-icon" {...props} />
  ),
}));

jest.mock("../SpellBook/utils", () => ({
  getModifierInfo: jest.fn(() => ({
    abilityName: "Intelligence",
    abilityModifier: 3,
    wandType: "Elder",
    wandModifier: 2,
  })),
}));

jest.mock("../../SharedData/spells", () => ({
  spellsData: {
    Charms: {
      levels: {
        Cantrips: [{ name: "Test Cantrip" }],
        "Level 1": [{ name: "Test Spell Level 1" }],
        "Level 2": [{ name: "Test Spell Level 2" }],
      },
    },
  },
}));

jest.mock("../../App/const", () => ({
  getDiscordWebhook: jest.fn(() => "https://discord.webhook.url"),
}));

jest.mock("../../Images", () => ({}));

global.fetch = jest.fn();
global.alert = jest.fn();

const { DiceRoller } = require("@dice-roller/rpg-dice-roller");

const mockCharacter = {
  name: "Test Character",
  gameSession: "test-session",
  house: "Ravenclaw",
  abilityScores: {
    intelligence: 16,
    wisdom: 14,
    charisma: 12,
  },
  skills: { acrobatics: 1 },
  proficiencyBonus: 2,
  initiativeModifier: 3,
};

const mockParams = {
  character: mockCharacter,
  isRolling: false,
  setIsRolling: jest.fn(),
  showRollResult: jest.fn(),
};

describe("RollModal Components and Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    global.alert.mockClear();

    const { getDiscordWebhook } = require("../../App/const");
    getDiscordWebhook.mockReturnValue("https://discord.webhook.url");

    const { getModifierInfo } = require("../SpellBook/utils");
    getModifierInfo.mockReturnValue({
      abilityName: "Intelligence",
      abilityModifier: 3,
      wandType: "Elder",
      wandModifier: 2,
    });

    DiceRoller.mockImplementation(() => ({
      roll: jest.fn(() => ({
        total: 15,
        notation: "1d20",
        output: "15",
        rolls: [
          {
            rolls: [{ value: 15, discarded: false }],
          },
        ],
      })),
    }));

    fetch.mockResolvedValue({ ok: true });
  });

  describe("Utility Functions", () => {
    describe("hasSubclassFeature", () => {
      it("should return true when character has the feature", () => {
        const character = { subclassFeatures: ["Researcher", "Scholar"] };
        expect(hasSubclassFeature(character, "Researcher")).toBe(true);
      });

      it("should return false when character does not have the feature", () => {
        const character = { subclassFeatures: ["Scholar"] };
        expect(hasSubclassFeature(character, "Researcher")).toBe(false);
      });

      it("should return false when character has no features", () => {
        const character = {};
        expect(hasSubclassFeature(character, "Researcher")).toBe(false);
      });

      it("should return false when character is null", () => {
        expect(hasSubclassFeature(null, "Researcher")).toBe(false);
      });
    });

    describe("calculateSkillBonus", () => {
      const character = {
        skills: { acrobatics: 1, athletics: 2 },
        proficiencyBonus: 2,
      };

      it("should return ability modifier for unproficient skills", () => {
        expect(
          calculateSkillBonus({
            skillName: "stealth",
            abilityMod: 3,
            character,
          })
        ).toBe(3);
      });

      it("should return ability modifier + proficiency for proficient skills", () => {
        expect(
          calculateSkillBonus({
            skillName: "acrobatics",
            abilityMod: 3,
            character,
          })
        ).toBe(5);
      });

      it("should return ability modifier + double proficiency for expertise", () => {
        expect(
          calculateSkillBonus({
            skillName: "athletics",
            abilityMod: 3,
            character,
          })
        ).toBe(7);
      });

      it("should return 0 when no character", () => {
        expect(
          calculateSkillBonus({
            skillName: "acrobatics",
            abilityMod: 3,
            character: null,
          })
        ).toBe(0);
      });
    });

    describe("applyRavenclawBonus", () => {
      const ravenclawCharacter = { house: "Ravenclaw" };
      const gryffindorCharacter = { house: "Gryffindor" };

      it("should apply bonus for Ravenclaw with Int/Wis check and proficiency", () => {
        expect(
          applyRavenclawBonus(3, ravenclawCharacter, "intelligence", true)
        ).toBe(6);
        expect(applyRavenclawBonus(5, ravenclawCharacter, "wisdom", true)).toBe(
          6
        );
      });

      it("should not apply bonus for rolls above 5", () => {
        expect(
          applyRavenclawBonus(8, ravenclawCharacter, "intelligence", true)
        ).toBe(8);
      });

      it("should not apply bonus without proficiency", () => {
        expect(
          applyRavenclawBonus(3, ravenclawCharacter, "intelligence", false)
        ).toBe(3);
      });

      it("should not apply bonus for non-Int/Wis checks", () => {
        expect(
          applyRavenclawBonus(3, ravenclawCharacter, "strength", true)
        ).toBe(3);
      });

      it("should not apply bonus for non-Ravenclaw characters", () => {
        expect(
          applyRavenclawBonus(3, gryffindorCharacter, "intelligence", true)
        ).toBe(3);
      });
    });

    describe("applyHornedSerpentBonus", () => {
      const hornedSerpentCharacter = {
        house: "Horned Serpent",
        proficiencyBonus: 4,
      };
      const ravenclawCharacter = { house: "Ravenclaw" };

      it("should apply bonus for Horned Serpent with Int/Cha check without proficiency", () => {
        const result = applyHornedSerpentBonus(
          3,
          hornedSerpentCharacter,
          "intelligence",
          false
        );
        expect(result.modifier).toBe(5);
        expect(result.bonusApplied).toBe(true);
        expect(result.bonusAmount).toBe(2);
      });

      it("should not apply bonus with proficiency", () => {
        const result = applyHornedSerpentBonus(
          3,
          hornedSerpentCharacter,
          "intelligence",
          true
        );
        expect(result.modifier).toBe(3);
        expect(result.bonusApplied).toBe(false);
      });

      it("should not apply bonus for non-Int/Cha checks", () => {
        const result = applyHornedSerpentBonus(
          3,
          hornedSerpentCharacter,
          "strength",
          false
        );
        expect(result.modifier).toBe(3);
        expect(result.bonusApplied).toBe(false);
      });

      it("should not apply bonus for non-Horned Serpent characters", () => {
        const result = applyHornedSerpentBonus(
          3,
          ravenclawCharacter,
          "intelligence",
          false
        );
        expect(result.modifier).toBe(3);
        expect(result.bonusApplied).toBe(false);
      });
    });

    describe("rollDice", () => {
      it("should return dice roll result", () => {
        const result = rollDice();
        expect(result).toHaveProperty("total");
        expect(result).toHaveProperty("originalRoll");
        expect(result).toHaveProperty("notation");
        expect(result).toHaveProperty("output");
        expect(result).toHaveProperty("ravenclawBonusApplied");
      });

      it("should apply Ravenclaw bonus when applicable", () => {
        const character = { house: "Ravenclaw" };

        DiceRoller.mockImplementation(() => ({
          roll: jest.fn(() => ({ total: 3 })),
        }));

        const result = rollDice(character, "intelligence", true);
        expect(result.total).toBe(6);
        expect(result.originalRoll).toBe(3);
        expect(result.ravenclawBonusApplied).toBe(true);
      });
    });

    describe("rollAbilityStat", () => {
      it("should roll 4d6 keep highest 3", () => {
        DiceRoller.mockImplementation(() => ({
          roll: jest.fn(() => ({ total: 14 })),
        }));

        const result = rollAbilityStat();
        expect(result).toBe(14);
      });
    });

    describe("getMaxAchievableQuality", () => {
      it("should return correct quality for no proficiencies", () => {
        const proficiencies = {
          potionMaking: 0,
          potioneersKit: false,
          herbologyKit: false,
        };
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "normal",
          })
        ).toBe("flawed");
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "superior",
          })
        ).toBe("normal");
      });

      it("should return correct quality for one proficiency", () => {
        const proficiencies = {
          potionMaking: 1,
          potioneersKit: false,
          herbologyKit: false,
        };
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "normal",
          })
        ).toBe("normal");
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "exceptional",
          })
        ).toBe("normal");
      });

      it("should return correct quality for expertise", () => {
        const proficiencies = {
          potionMaking: 2,
          potioneersKit: true,
          herbologyKit: false,
        };
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "normal",
          })
        ).toBe("exceptional");
        expect(
          getMaxAchievableQuality({
            proficiencies,
            ingredientQuality: "superior",
          })
        ).toBe("exceptional");
      });
    });

    describe("getProficiencyAnalysis", () => {
      it("should return correct analysis for no proficiencies", () => {
        const proficiencies = {
          potionMaking: 0,
          potioneersKit: false,
          herbologyKit: false,
        };
        const result = getProficiencyAnalysis(proficiencies, "normal");
        expect(result).toContain("0 Proficiencies");
        expect(result).toContain("flawed quality");
      });

      it("should return correct analysis for expertise", () => {
        const proficiencies = {
          potionMaking: 2,
          potioneersKit: true,
          herbologyKit: false,
        };
        const result = getProficiencyAnalysis(proficiencies, "exceptional");
        expect(result).toContain("1 Proficiency + 1 Expertise");
        expect(result).toContain("exceptional quality");
      });
    });
  });

  describe("RollResultModal Component", () => {
    const mockRollResult = {
      title: "Test Roll",
      rollValue: 15,
      modifier: 3,
      total: 18,
      isCriticalSuccess: false,
      isCriticalFailure: false,
      description: "Test description",
      type: "ability",
    };

    it("should not render when not open", () => {
      render(
        <RollResultModal
          rollResult={mockRollResult}
          isOpen={false}
          onClose={() => {}}
        />
      );
      expect(screen.queryByText("Test Roll")).not.toBeInTheDocument();
    });

    it("should not render when no roll result", () => {
      render(
        <RollResultModal rollResult={null} isOpen={true} onClose={() => {}} />
      );
      expect(screen.queryByText("Test Roll")).not.toBeInTheDocument();
    });

    it("should render roll result when open", () => {
      render(
        <RollResultModal
          rollResult={mockRollResult}
          isOpen={true}
          onClose={() => {}}
        />
      );

      expect(screen.getByText("Test Roll")).toBeInTheDocument();
      expect(screen.getByText("18")).toBeInTheDocument();
      expect(screen.getByText("15 +3 = 18")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("should show critical success styling", () => {
      const criticalSuccessResult = {
        ...mockRollResult,
        isCriticalSuccess: true,
      };

      render(
        <RollResultModal
          rollResult={criticalSuccessResult}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText("✨ CRITICAL SUCCESS!")).toBeInTheDocument();
    });

    it("should show critical failure styling", () => {
      const criticalFailureResult = {
        ...mockRollResult,
        isCriticalFailure: true,
      };

      render(
        <RollResultModal
          rollResult={criticalFailureResult}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText("💥 CRITICAL FAILURE!")).toBeInTheDocument();
    });

    it("should call onClose when close button is clicked", () => {
      const mockOnClose = jest.fn();
      render(
        <RollResultModal
          rollResult={mockRollResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should call onClose when main close button is clicked", () => {
      const mockOnClose = jest.fn();
      render(
        <RollResultModal
          rollResult={mockRollResult}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByText("Close");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should show potion quality when present", () => {
      const potionResult = {
        ...mockRollResult,
        potionQuality: "exceptional",
        inventoryAdded: true,
      };

      render(
        <RollResultModal
          rollResult={potionResult}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(
        screen.getByText(/Potion Quality: Exceptional/)
      ).toBeInTheDocument();
      expect(screen.getByText("✅ Added to inventory")).toBeInTheDocument();
    });

    it("should show recipe quality when present", () => {
      const recipeResult = {
        ...mockRollResult,
        recipeQuality: "superior",
      };

      render(
        <RollResultModal
          rollResult={recipeResult}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText(/Recipe Quality: Superior/)).toBeInTheDocument();
    });

    it("should show individual dice results when present", () => {
      const diceResult = {
        ...mockRollResult,
        individualDiceResults: {
          keptDice: [18, 15],
          discardedDice: [3],
          rollType: "advantage",
        },
      };

      render(
        <RollResultModal
          rollResult={diceResult}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText("Individual Dice Results")).toBeInTheDocument();
      expect(
        screen.getByText("Highest dice kept | Crossed out dice discarded")
      ).toBeInTheDocument();
    });
  });

  describe("RollModalProvider and useRollModal", () => {
    const TestComponent = () => {
      const { showRollResult } = useRollModal();

      return (
        <button
          onClick={() =>
            showRollResult({
              title: "Test",
              rollValue: 10,
              modifier: 2,
              total: 12,
            })
          }
        >
          Show Roll
        </button>
      );
    };

    it("should provide roll modal context", () => {
      render(
        <RollModalProvider>
          <TestComponent />
        </RollModalProvider>
      );

      const button = screen.getByText("Show Roll");
      fireEvent.click(button);

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("should fallback to alert when used outside provider", () => {
      render(<TestComponent />);

      const button = screen.getByText("Show Roll");
      fireEvent.click(button);

      expect(global.alert).toHaveBeenCalledWith("Test: d20(10) + 2 = 12");
    });
  });

  describe("Roll Functions", () => {
    describe("rollAbility", () => {
      it("should roll ability check successfully", async () => {
        const ability = { name: "Intelligence", key: "intelligence" };
        const characterModifiers = { intelligence: 3 };

        await rollAbility({
          ability,
          characterModifiers,
          ...mockParams,
        });

        expect(mockParams.setIsRolling).toHaveBeenCalledWith(true);
        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Intelligence Check",
            type: "ability",
          })
        );
        expect(fetch).toHaveBeenCalled();
      });

      it("should handle errors gracefully", async () => {
        console.error = jest.fn();
        fetch.mockRejectedValue(new Error("Network error"));

        const ability = { name: "Intelligence", key: "intelligence" };
        const characterModifiers = { intelligence: 3 };

        await rollAbility({
          ability,
          characterModifiers,
          ...mockParams,
        });

        expect(console.error).toHaveBeenCalled();
      });

      it("should not call fetch when discord webhook URL is missing", async () => {
        const { getDiscordWebhook } = require("../../App/const");
        getDiscordWebhook.mockReturnValue(null);

        const ability = { name: "Intelligence", key: "intelligence" };
        const characterModifiers = { intelligence: 3 };

        await rollAbility({
          ability,
          characterModifiers,
          ...mockParams,
        });

        expect(fetch).not.toHaveBeenCalled();
      });
    });

    describe("rollSkill", () => {
      it("should roll skill check successfully", async () => {
        const skill = { name: "acrobatics", displayName: "Acrobatics" };
        const abilityMod = 2;

        await rollSkill({
          skill,
          abilityMod,
          ...mockParams,
        });

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Acrobatics Check",
            type: "skill",
          })
        );
      });
    });

    describe("rollInitiative", () => {
      it("should roll initiative successfully", async () => {
        await rollInitiative(mockParams);

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Initiative Roll",
            type: "initiative",
          })
        );
      });
    });

    describe("rollSavingThrow", () => {
      it("should roll saving throw successfully", async () => {
        const ability = { name: "Wisdom" };
        const savingThrowModifier = 5;

        await rollSavingThrow({
          ability,
          savingThrowModifier,
          ...mockParams,
        });

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Wisdom Saving Throw",
            type: "saving_throw",
          })
        );
      });
    });

    describe("rollGenericD20", () => {
      it("should roll generic d20 successfully", async () => {
        await rollGenericD20({
          modifier: 5,
          title: "Custom Roll",
          description: "Custom description",
          ...mockParams,
        });

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Custom Roll",
            type: "generic",
          })
        );
      });
    });

    describe("rollMagicCasting", () => {
      it("should roll magic casting successfully", async () => {
        await rollMagicCasting({
          school: "Charms",
          type: "Cast",
          modifier: 5,
          ...mockParams,
        });

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Charms Cast Roll",
            type: "spell",
          })
        );
      });
    });

    describe("attemptSpell", () => {
      const spellParams = {
        spellName: "Test Spell Level 1",
        subject: "Charms",
        selectedCharacter: mockCharacter,
        getSpellModifier: jest.fn(() => 5),
        setSpellAttempts: jest.fn(),
        discordUserId: "user123",
        setAttemptingSpells: jest.fn(),
        setCriticalSuccesses: jest.fn(),
        setFailedAttempts: jest.fn(),
        updateSpellProgressSummary: jest.fn().mockResolvedValue(),
        showRollResult: jest.fn(),
      };

      it("should attempt spell successfully", async () => {
        const result = await attemptSpell(spellParams);

        expect(result).toHaveProperty("isSuccess");
        expect(result).toHaveProperty("d20Roll");
        expect(result).toHaveProperty("total");

        expect(spellParams.setAttemptingSpells).toHaveBeenCalledWith(
          expect.any(Function)
        );

        const firstCall = spellParams.setAttemptingSpells.mock.calls[0][0];
        expect(firstCall({})).toEqual({ "Test Spell Level 1": true });
      });

      it("should handle custom roll", async () => {
        const result = await attemptSpell({
          ...spellParams,
          customRoll: 20,
        });

        expect(result.d20Roll).toBe(20);
        expect(result.isCriticalSuccess).toBe(true);
      });

      it("should return early if no character or userId", async () => {
        const result = await attemptSpell({
          ...spellParams,
          selectedCharacter: null,
        });

        expect(result).toBeUndefined();
        expect(global.alert).toHaveBeenCalledWith(
          "Please select a character first!"
        );
      });

      it.skip("should return early if no discord webhook URL", async () => {
        const { getDiscordWebhook } = require("../../App/const");
        getDiscordWebhook.mockReturnValue(null);
        console.error = jest.fn();

        const result = await attemptSpell(spellParams);

        expect(result).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith(
          "Discord webhook URL not configured"
        );
      });
    });

    describe("rollBrewPotion", () => {
      const brewParams = {
        selectedPotion: {
          name: "Test Potion",
          description: "Test description",
          rarity: "common",
        },
        proficiencies: {
          potioneersKit: true,
          herbologyKit: false,
          potionMaking: 1,
        },
        ingredientQuality: "normal",
        qualityDCs: {
          common: {
            flawed: 8,
            normal: 12,
            exceptional: 16,
            superior: 20,
          },
        },
        ingredientModifiers: { normal: 0 },
        characterModifier: 5,
        addPotionToInventory: false,
        rawIngredientQuality: "normal",
        ...mockParams,
      };

      it("should brew potion successfully", async () => {
        const result = await rollBrewPotion(brewParams);

        expect(result).toHaveProperty("achievedQuality");
        expect(result).toHaveProperty("diceRoll");
        expect(result).toHaveProperty("total");
        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Potion Brewing: Test Potion",
            type: "potion",
          })
        );
      });
    });

    describe("rollCookRecipe", () => {
      const cookParams = {
        selectedRecipe: {
          name: "Test Recipe",
          description: "Test description",
          eatingTime: "1 action",
          duration: "1 hour",
          qualities: {
            flawed: "Poor effect",
            regular: "Normal effect",
            exceptional: "Good effect",
            superior: "Great effect",
          },
        },
        proficiencies: {
          culinaryKit: true,
          herbologyKit: false,
        },
        ingredientQuality: "regular",
        qualityDCs: {
          flawed: 8,
          regular: 12,
          exceptional: 16,
          superior: 20,
        },
        ingredientModifiers: { regular: 0 },
        characterModifier: 5,
        webhookUrl: "https://discord.webhook.url",
        addRecipeToInventory: false,
        rawIngredientQuality: "regular",
        ...mockParams,
      };

      it("should cook recipe successfully", async () => {
        const result = await rollCookRecipe(cookParams);

        expect(result).toHaveProperty("achievedQuality");
        expect(result).toHaveProperty("diceRoll");
        expect(result).toHaveProperty("total");
        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Recipe Cooking: Test Recipe",
            type: "recipe",
          })
        );
      });
    });

    describe("rollFlexibleDice", () => {
      it("should roll flexible dice with advantage", async () => {
        DiceRoller.mockImplementation(() => ({
          roll: jest.fn(() => ({
            total: 18,
            notation: "2d20kh1",
            output: "18",
            rolls: [
              {
                rolls: [
                  { value: 18, discarded: false },
                  { value: 5, discarded: true },
                ],
              },
            ],
          })),
        }));

        await rollFlexibleDice({
          diceQuantity: 1,
          diceType: 20,
          rollType: "advantage",
          modifier: 3,
          title: "Advantage Roll",
          ...mockParams,
        });

        expect(mockParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Advantage Roll",
            type: "flexible",
            rollType: "advantage",
          })
        );
      });
    });

    describe("rollCorruption", () => {
      const corruptionParams = {
        character: mockCharacter,
        pointsGained: 2,
        pointsRedeemed: 0,
        reason: "Dark deed",
        pointsTotal: 5,
        pointsRemaining: 5,
        type: "gained",
      };

      it("should send corruption gained webhook", async () => {
        await rollCorruption(corruptionParams);

        expect(fetch).toHaveBeenCalledWith(
          "https://discord.webhook.url",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: expect.stringContaining("Corruption Gained"),
          })
        );
      });

      it("should send corruption redeemed webhook", async () => {
        await rollCorruption({
          ...corruptionParams,
          type: "redeemed",
          pointsRemaining: 3,
        });

        expect(fetch).toHaveBeenCalledWith(
          "https://discord.webhook.url",
          expect.objectContaining({
            method: "POST",
            body: expect.stringContaining("Corruption Redeemed"),
          })
        );
      });

      it("should handle missing webhook URL gracefully", async () => {
        console.error = jest.fn();
        const { getDiscordWebhook } = require("../../App/const");
        getDiscordWebhook.mockReturnValue(null);

        await rollCorruption(corruptionParams);

        expect(console.error).toHaveBeenCalledWith(
          "Discord webhook URL not configured"
        );
        expect(fetch).not.toHaveBeenCalled();
      });
    });

    describe("rollResearch", () => {
      let researchParams;

      beforeEach(() => {
        researchParams = {
          spellName: "Test Spell Level 1",
          subject: "Charms",
          selectedCharacter: mockCharacter,
          dc: 15,
          playerYear: 3,
          spellYear: 1,
          getSpellModifier: jest.fn(() => 5),
          getModifierInfo: jest.fn(() => ({
            abilityName: "Intelligence",
            abilityModifier: 3,
            wandType: "Elder",
            wandModifier: 2,
          })),
          showRollResult: jest.fn(),
        };
      });

      it("should research spell successfully", async () => {
        const result = await rollResearch(researchParams);

        expect(result).toHaveProperty("d20Roll");
        expect(result).toHaveProperty("isSuccess");
        expect(result).toHaveProperty("totalRoll");
        expect(researchParams.showRollResult).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Research: Test Spell Level 1",
            type: "research",
          })
        );

        expect(researchParams.getModifierInfo).toHaveBeenCalledWith(
          "Test Spell Level 1",
          "Charms",
          mockCharacter
        );
      });

      it("should handle custom roll for research", async () => {
        const result = await rollResearch({
          ...researchParams,
          customRoll: 20,
        });

        expect(result.d20Roll).toBe(20);
        expect(result.isNaturalTwenty).toBe(true);
      });
    });
  });

  describe("useRollFunctions Hook", () => {
    it("should return all roll functions with showRollResult", () => {
      let rollFunctions;

      const TestComponent = () => {
        rollFunctions = useRollFunctions();
        return null;
      };

      render(
        <RollModalProvider>
          <TestComponent />
        </RollModalProvider>
      );

      expect(rollFunctions).toHaveProperty("rollAbility");
      expect(rollFunctions).toHaveProperty("rollInitiative");
      expect(rollFunctions).toHaveProperty("rollSkill");
      expect(rollFunctions).toHaveProperty("attemptSpell");
      expect(rollFunctions).toHaveProperty("rollBrewPotion");
      expect(rollFunctions).toHaveProperty("rollGenericD20");
      expect(rollFunctions).toHaveProperty("rollSavingThrow");
      expect(rollFunctions).toHaveProperty("rollResearch");
      expect(rollFunctions).toHaveProperty("rollCorruption");
      expect(rollFunctions).toHaveProperty("rollCookRecipe");
      expect(rollFunctions).toHaveProperty("rollMagicCasting");
      expect(rollFunctions).toHaveProperty("rollFlexibleDice");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    beforeEach(() => {
      console.error = jest.fn();
    });

    it("should handle missing character in rollAbility with Discord integration", async () => {
      await rollAbility({
        ability: { name: "Strength", key: "strength" },
        characterModifiers: { strength: 2 },
        character: null,
        isRolling: false,
        setIsRolling: jest.fn(),
        showRollResult: jest.fn(),
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error sending Discord message:",
        expect.any(TypeError)
      );
    });

    it("should handle fetch errors in roll functions", async () => {
      fetch.mockRejectedValue(new Error("Network error"));

      await rollAbility({
        ability: { name: "Strength", key: "strength" },
        characterModifiers: { strength: 2 },
        character: { name: "Test", gameSession: "test" },
        isRolling: false,
        setIsRolling: jest.fn(),
        showRollResult: jest.fn(),
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error sending Discord webhook:",
        expect.any(Error)
      );
    });

    it("should prevent rolling when already rolling", async () => {
      const setIsRolling = jest.fn();
      const showRollResult = jest.fn();

      await rollAbility({
        ability: { name: "Strength", key: "strength" },
        characterModifiers: { strength: 2 },
        character: { name: "Test" },
        isRolling: true,
        setIsRolling,
        showRollResult,
      });

      expect(setIsRolling).not.toHaveBeenCalled();
      expect(showRollResult).not.toHaveBeenCalled();
    });

    it("should handle rollCorruption with missing character gracefully", async () => {
      console.error = jest.fn();
      const { getDiscordWebhook } = require("../../App/const");
      getDiscordWebhook.mockReturnValue(null);

      await rollCorruption({
        character: null,
        pointsGained: 1,
        pointsTotal: 1,
        type: "gained",
      });

      expect(console.error).toHaveBeenCalledWith(
        "Discord webhook URL not configured"
      );
    });
  });
  describe("rollAbilityCheckWithProficiency", () => {
    const abilityCheckParams = {
      abilityType: "intelligence",
      hasProficiency: true,
      modifier: 5,
      title: "Intelligence Check with Proficiency",
      character: mockCharacter,
      isRolling: false,
      setIsRolling: jest.fn(),
      showRollResult: jest.fn(),
    };

    it("should roll ability check with proficiency successfully", async () => {
      await rollAbilityCheckWithProficiency(abilityCheckParams);

      expect(abilityCheckParams.setIsRolling).toHaveBeenCalledWith(true);
      expect(abilityCheckParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Intelligence Check with Proficiency",
          type: "ability",
          abilityType: "intelligence",
        })
      );
    });

    it("should apply Ravenclaw bonus when applicable", async () => {
      // Mock low roll for Ravenclaw bonus
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({ total: 3 })),
      }));

      await rollAbilityCheckWithProficiency({
        ...abilityCheckParams,
        character: { ...mockCharacter, house: "Ravenclaw" },
      });

      expect(abilityCheckParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          ravenclawBonusApplied: true,
          rollValue: 6, // 3 boosted to 6
          originalRoll: 3,
        })
      );
    });

    it("should apply Horned Serpent bonus when applicable", async () => {
      const hornedSerpentCharacter = {
        ...mockCharacter,
        house: "Horned Serpent",
        proficiencyBonus: 4,
      };

      await rollAbilityCheckWithProficiency({
        ...abilityCheckParams,
        character: hornedSerpentCharacter,
        hasProficiency: false, // Required for Horned Serpent bonus
        abilityType: "charisma",
      });

      expect(abilityCheckParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          hornedSerpentBonusApplied: true,
          hornedSerpentBonusAmount: 2,
        })
      );
    });

    it("should prevent rolling when already rolling", async () => {
      const setIsRolling = jest.fn();
      const showRollResult = jest.fn();

      await rollAbilityCheckWithProficiency({
        ...abilityCheckParams,
        isRolling: true,
        setIsRolling,
        showRollResult,
      });

      expect(setIsRolling).not.toHaveBeenCalled();
      expect(showRollResult).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      console.error = jest.fn();

      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => {
          throw new Error("Dice rolling failed");
        }),
      }));

      await rollAbilityCheckWithProficiency({
        ...abilityCheckParams,
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error with ability check:",
        expect.any(Error)
      );
    });
  });

  describe("attemptArithmancySpell", () => {
    let arithmancyParams;

    beforeEach(() => {
      arithmancyParams = {
        spellName: "Test Spell Level 1",
        subject: "Charms",
        selectedCharacter: mockCharacter,
        setSpellAttempts: jest.fn(),
        discordUserId: "user123",
        setAttemptingSpells: jest.fn(),
        setCriticalSuccesses: jest.fn(),
        setFailedAttempts: jest.fn(),
        updateSpellProgressSummary: jest.fn().mockResolvedValue(),
        showRollResult: jest.fn(),
      };
    });

    it("should attempt Arithmancy spell successfully", async () => {
      await attemptArithmancySpell(arithmancyParams);

      expect(arithmancyParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Spell Level 1 (Arithmancy Cast)",
          type: "spell",
          description: expect.stringContaining("Arithmancy casting"),
        })
      );

      expect(arithmancyParams.setAttemptingSpells).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should use Intelligence modifier for Arithmancy", async () => {
      await attemptArithmancySpell(arithmancyParams);

      expect(arithmancyParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: 5,
        })
      );
    });

    it("should return early if no character or userId", async () => {
      global.alert = jest.fn();

      await attemptArithmancySpell({
        ...arithmancyParams,
        selectedCharacter: null,
      });

      expect(global.alert).toHaveBeenCalledWith(
        "Please select a character first!"
      );
    });

    it("should handle critical success", async () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({ total: 20 })),
      }));

      await attemptArithmancySpell(arithmancyParams);

      expect(arithmancyParams.setCriticalSuccesses).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(arithmancyParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          isCriticalSuccess: true,
          rollValue: 20,
        })
      );
    });

    it("should handle critical failure", async () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({ total: 1 })),
      }));

      await attemptArithmancySpell(arithmancyParams);

      expect(arithmancyParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          isCriticalFailure: true,
          rollValue: 1,
        })
      );
    });
  });

  describe("attemptRunesSpell", () => {
    let runesParams;

    beforeEach(() => {
      runesParams = {
        spellName: "Test Spell Level 1",
        subject: "Charms",
        selectedCharacter: mockCharacter,
        setSpellAttempts: jest.fn(),
        discordUserId: "user123",
        setAttemptingSpells: jest.fn(),
        setCriticalSuccesses: jest.fn(),
        setFailedAttempts: jest.fn(),
        updateSpellProgressSummary: jest.fn().mockResolvedValue(),
        showRollResult: jest.fn(),
      };
    });

    it("should attempt Runic spell successfully", async () => {
      await attemptRunesSpell(runesParams);

      expect(runesParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Spell Level 1 (Runic Cast)",
          type: "spell",
          description: expect.stringContaining("Runic casting"),
        })
      );

      expect(runesParams.setAttemptingSpells).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should use Wisdom modifier for Runes", async () => {
      await attemptRunesSpell(runesParams);

      expect(runesParams.showRollResult).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: 4,
        })
      );
    });

    it("should return early if no character or userId", async () => {
      global.alert = jest.fn();

      await attemptRunesSpell({
        ...runesParams,
        discordUserId: null,
      });

      expect(global.alert).toHaveBeenCalledWith(
        "Please select a character first!"
      );
    });

    it("should handle successful spell attempt", async () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({ total: 18 })),
      }));

      await attemptRunesSpell(runesParams);

      expect(runesParams.setSpellAttempts).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should handle failed spell attempt", async () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({ total: 2 })),
      }));

      await attemptRunesSpell(runesParams);

      expect(runesParams.setFailedAttempts).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  describe("rollFlexibleDie", () => {
    it("should roll normal dice", () => {
      const result = rollFlexibleDie(2, 6, "normal");

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("notation");
      expect(result).toHaveProperty("output");
      expect(result).toHaveProperty("diceQuantity", 2);
      expect(result).toHaveProperty("diceType", 6);
      expect(result).toHaveProperty("rollType", "normal");
      expect(result).toHaveProperty("individualDiceResults");
    });

    it("should roll with advantage", () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({
          total: 18,
          notation: "2d20kh1",
          output: "18",
          rolls: [
            {
              rolls: [
                { value: 18, discarded: false },
                { value: 5, discarded: true },
              ],
            },
          ],
        })),
      }));

      const result = rollFlexibleDie(1, 20, "advantage");

      expect(result.rollType).toBe("advantage");
      expect(result.total).toBe(18);
      expect(result.individualDiceResults).toHaveProperty("keptDice");
      expect(result.individualDiceResults).toHaveProperty("discardedDice");
      expect(result.individualDiceResults.rollType).toBe("advantage");
    });

    it("should roll with disadvantage", () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({
          total: 5,
          notation: "2d20kl1",
          output: "5",
          rolls: [
            {
              rolls: [
                { value: 18, discarded: true },
                { value: 5, discarded: false },
              ],
            },
          ],
        })),
      }));

      const result = rollFlexibleDie(1, 20, "disadvantage");

      expect(result.rollType).toBe("disadvantage");
      expect(result.total).toBe(5);
      expect(result.individualDiceResults.rollType).toBe("disadvantage");
    });

    it("should handle multiple dice", () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({
          total: 24,
          notation: "4d6",
          output: "24",
          rolls: [
            {
              rolls: [
                { value: 6, discarded: false },
                { value: 6, discarded: false },
                { value: 6, discarded: false },
                { value: 6, discarded: false },
              ],
            },
          ],
        })),
      }));

      const result = rollFlexibleDie(4, 6, "normal");

      expect(result.diceQuantity).toBe(4);
      expect(result.diceType).toBe(6);
      expect(result.total).toBe(24);
    });

    it("should handle dice roll extraction errors gracefully", () => {
      DiceRoller.mockImplementation(() => ({
        roll: jest.fn(() => ({
          total: 10,
          notation: "1d20",
          output: "10",
          rolls: null,
        })),
      }));

      const result = rollFlexibleDie(1, 20, "normal");

      expect(result.individualDiceResults).toEqual({
        allDice: [],
        keptDice: [],
        discardedDice: [],
        rollType: "normal",
      });
    });

    it("should use default parameters", () => {
      const result = rollFlexibleDie();

      expect(result.diceQuantity).toBe(1);
      expect(result.diceType).toBe(20);
      expect(result.rollType).toBe("normal");
    });
  });
});
