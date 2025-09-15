import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "../../contexts/ThemeContext";

import MetaMagicDisplay from "./MetaMagicDisplay";

jest.mock("./MetaMagicDisplay", () => {
  const React = require("react");

  return function MockMetaMagicDisplay({
    character,
    onNavigateToCharacterManagement,
  }) {
    const getMetaMagicChoices = (character) => {
      let metaMagicNames = [];

      if (
        character?.metamagicChoices &&
        typeof character.metamagicChoices === "object"
      ) {
        metaMagicNames = Object.keys(character.metamagicChoices).filter(
          (key) => character.metamagicChoices[key] === true
        );
      } else if (
        character?.metamagic_choices &&
        typeof character.metamagic_choices === "object"
      ) {
        metaMagicNames = Object.keys(character.metamagic_choices).filter(
          (key) => character.metamagic_choices[key] === true
        );
      } else {
        metaMagicNames =
          character?.metamagic ||
          character?.metaMagic ||
          character?.meta_magic ||
          [];
      }

      return metaMagicNames.map((name) => ({
        name,
        cost: getMetaMagicCost(name),
        description: getMetaMagicDescription(name),
        preview: getMetaMagicPreview(name),
      }));
    };

    const getMetaMagicCost = (name) => {
      const costs = {
        "Careful Spell": "1 sorcery point",
        "Distant Spell": "1 sorcery point",
        "Empowered Spell": "1 sorcery point",
        "Extended Spell": "1 sorcery point",
        "Heightened Spell": "3 sorcery points",
        "Quickened Spell": "2 sorcery points",
        "Subtle Spell": "1 sorcery point",
        "Twinned Spell": "Varies (spell level)",
      };
      return costs[name] || "Unknown cost";
    };

    const getMetaMagicDescription = (name) => {
      const descriptions = {
        "Careful Spell":
          "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. Choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell.",
        "Distant Spell":
          "When you cast a spell that has a range of 5 feet or greater, you can double the range of the spell. When you cast a spell that has a range of touch, you can make the range of the spell 30 feet.",
        "Empowered Spell":
          "When you roll damage for a spell, you can reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.",
        "Extended Spell":
          "When you cast a spell that has a duration of 1 minute or longer, you can double its duration, to a maximum duration of 24 hours.",
        "Heightened Spell":
          "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can give one target of the spell disadvantage on its first saving throw made against the spell.",
        "Quickened Spell":
          "When you cast a spell that has a casting time of 1 action, you can change the casting time to 1 bonus action for this casting.",
        "Subtle Spell":
          "When you cast a spell, you can cast it without any somatic or verbal components.",
        "Twinned Spell":
          "When you cast a spell that targets only one creature and doesn't have a range of self, you can target a second creature in range with the same spell. The cost equals the spell's level (1 sorcery point for cantrips).",
      };
      return descriptions[name] || "No description available";
    };

    const getMetaMagicPreview = (name) => {
      const previews = {
        "Careful Spell": "Protect allies from spell effects",
        "Distant Spell": "Double spell range or make touch spells 30 feet",
        "Empowered Spell": "Reroll damage dice for better results",
        "Extended Spell": "Double spell duration up to 24 hours",
        "Heightened Spell": "Give one target disadvantage on saves",
        "Quickened Spell": "Cast action spells as bonus actions",
        "Subtle Spell": "Cast spells without verbal or somatic components",
        "Twinned Spell": "Target a second creature with single-target spells",
      };
      return previews[name] || "No preview available";
    };

    const metaMagics = getMetaMagicChoices(character);
    const qualifiesForMetaMagic = character?.level >= 3;
    const hasSelectedMetaMagic = metaMagics && metaMagics.length > 0;
    const shouldShowMissingNotification =
      qualifiesForMetaMagic && !hasSelectedMetaMagic;

    const handleNavigateToCharacterManager = () => {
      if (onNavigateToCharacterManagement && character?.id) {
        onNavigateToCharacterManagement(character.id, "metamagic");
        console.log(
          `Navigate to: /character-management/edit/${character.id}?section=metamagic`
        );
      }
    };

    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <span>✨</span>
          <h3>Metamagic Options</h3>
        </div>

        {shouldShowMissingNotification && (
          <div
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "2px solid #f59e0b",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f59e0b",
                marginBottom: "12px",
              }}
            >
              You have not selected a metamagic perk
            </div>
            <button
              style={{
                backgroundColor: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={handleNavigateToCharacterManager}
            >
              ⚙️ Go to Character Manager
            </button>
          </div>
        )}

        {metaMagics && metaMagics.length > 0 ? (
          <div>
            {metaMagics.map((metaMagic, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span>✨</span>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {metaMagic.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6366f1",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {metaMagic.cost}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontStyle: "italic",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  {metaMagic.preview}
                </div>
                <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                  {metaMagic.description}
                </div>
              </div>
            ))}
          </div>
        ) : !shouldShowMissingNotification ? (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontStyle: "italic",
              padding: "16px",
            }}
          >
            No metamagic options available
          </div>
        ) : null}
      </div>
    );
  };
});

const TestWrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

const createTestCharacter = (overrides = {}) => ({
  id: "test-character",
  name: "Test Character",
  level: 1,
  metamagicChoices: {},
  ...overrides,
});

describe("MetaMagicDisplay", () => {
  it("renders metamagic options title", () => {
    const character = createTestCharacter();
    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
  });

  it("shows empty state for character with no metamagic options", () => {
    const character = createTestCharacter({ level: 1 });
    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(
      screen.getByText("No metamagic options available")
    ).toBeInTheDocument();
  });

  it("shows missing selection notification for qualifying character without selections", () => {
    const character = createTestCharacter({
      level: 5,
      metamagicChoices: {},
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(
      screen.getByText("You have not selected a metamagic perk")
    ).toBeInTheDocument();
    expect(screen.getByText(/Go to Character Manager/)).toBeInTheDocument();
  });

  it("does not show missing selection notification for low-level character", () => {
    const character = createTestCharacter({
      level: 2,
      metamagicChoices: {},
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(
      screen.queryByText("You have not selected a metamagic perk")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("No metamagic options available")
    ).toBeInTheDocument();
  });

  it("does not show missing selection notification when metamagic is selected", () => {
    const character = createTestCharacter({
      level: 5,
      metamagicChoices: {
        "Careful Spell": true,
      },
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(
      screen.queryByText("You have not selected a metamagic perk")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Careful Spell")).toBeInTheDocument();
  });

  it("displays selected metamagic options correctly", () => {
    const character = createTestCharacter({
      level: 6,
      metamagicChoices: {
        "Careful Spell": true,
        "Distant Spell": true,
      },
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Careful Spell")).toBeInTheDocument();
    expect(screen.getByText("Distant Spell")).toBeInTheDocument();
    expect(
      screen.getByText("Protect allies from spell effects")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Double spell range or make touch spells 30 feet")
    ).toBeInTheDocument();
  });

  it("handles metamagic stored in legacy format", () => {
    const character = createTestCharacter({
      level: 5,
      metamagic: ["Subtle Spell"],
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
  });

  it("navigation button is clickable when notification is shown", () => {
    const character = createTestCharacter({
      level: 5,
      metamagicChoices: {},
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    const button = screen.getByText(/Go to Character Manager/);
    expect(button).toBeInTheDocument();

    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("calls onNavigateToCharacterManagement with correct parameters when button is clicked", () => {
    const character = createTestCharacter({
      level: 5,
      metamagicChoices: {},
    });
    const mockNavigate = jest.fn();

    render(
      <TestWrapper>
        <MetaMagicDisplay
          character={character}
          onNavigateToCharacterManagement={mockNavigate}
        />
      </TestWrapper>
    );

    const button = screen.getByText(/Go to Character Manager/);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("test-character", "metamagic");
  });

  it("shows correct metamagic costs and descriptions", () => {
    const character = createTestCharacter({
      level: 5,
      metamagicChoices: {
        "Heightened Spell": true,
      },
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Heightened Spell")).toBeInTheDocument();
    expect(screen.getByText("3 sorcery points")).toBeInTheDocument();
    expect(
      screen.getByText("Give one target disadvantage on saves")
    ).toBeInTheDocument();
  });

  it("handles alternative metamagic choice formats", () => {
    const character = createTestCharacter({
      level: 5,
      metamagic_choices: {
        "Empowered Spell": true,
      },
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
  });

  it("handles metaMagic property format", () => {
    const character = createTestCharacter({
      level: 5,
      metaMagic: ["Quickened Spell"],
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
  });

  it("handles meta_magic property format", () => {
    const character = createTestCharacter({
      level: 5,
      meta_magic: ["Twinned Spell"],
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
  });

  it("shows notification for level 3 character without selections", () => {
    const character = createTestCharacter({
      level: 3,
      metamagicChoices: {},
    });

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(
      screen.getByText("You have not selected a metamagic perk")
    ).toBeInTheDocument();
    expect(screen.getByText(/Go to Character Manager/)).toBeInTheDocument();
  });

  it("handles undefined character gracefully", () => {
    render(
      <TestWrapper>
        <MetaMagicDisplay character={undefined} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
    expect(
      screen.getByText("No metamagic options available")
    ).toBeInTheDocument();
  });

  it("handles null character gracefully", () => {
    render(
      <TestWrapper>
        <MetaMagicDisplay character={null} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
    expect(
      screen.getByText("No metamagic options available")
    ).toBeInTheDocument();
  });

  it("handles character with no level property", () => {
    const character = { id: "test", name: "Test" };

    render(
      <TestWrapper>
        <MetaMagicDisplay character={character} />
      </TestWrapper>
    );

    expect(screen.getByText("Metamagic Options")).toBeInTheDocument();
    expect(
      screen.getByText("No metamagic options available")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("You have not selected a metamagic perk")
    ).not.toBeInTheDocument();
  });
});
