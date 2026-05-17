import { houseFeatures, schoolGroups } from "../../SharedData/houseData";
import { calculateHouseModifiers } from "../../Components/CharacterManager/utils/utils";

// Rules source: updatedRules.txt — HOUSES section
// Each house grants +1 to two fixed abilities and +1 to one chosen ability.
// All houses grant one feat.

describe("House tab — school groupings", () => {
  it("Hogwarts contains Gryffindor, Hufflepuff, Ravenclaw, Slytherin", () => {
    expect(schoolGroups.main.schools.Hogwarts).toEqual(
      expect.arrayContaining(["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"])
    );
  });

  it("Ilvermorny contains Horned Serpent, Wampus Cat, Thunderbird, Pukwudgie", () => {
    expect(schoolGroups.main.schools.Ilvermorny).toEqual(
      expect.arrayContaining(["Horned Serpent", "Wampus Cat", "Thunderbird", "Pukwudgie"])
    );
  });
});

describe("House tab — fixed ability score bonuses (rules: +1 to two fixed abilities)", () => {
  const cases = [
    ["Gryffindor",    ["constitution", "charisma"]],
    ["Hufflepuff",    ["constitution", "wisdom"]],
    ["Ravenclaw",     ["intelligence", "wisdom"]],
    ["Slytherin",     ["dexterity", "charisma"]],
    ["Beauxbatons",   ["dexterity", "wisdom"]],
    ["Durmstrang",    ["strength", "constitution"]],
    ["Uagadou",       ["strength", "dexterity"]],
    ["Mahoutokoro",   ["dexterity", "intelligence"]],
    ["Castelobruxo",  ["constitution", "dexterity"]],
    ["Koldovstoretz", ["strength", "wisdom"]],
    ["Horned Serpent",["intelligence", "charisma"]],
    ["Wampus Cat",    ["dexterity", "constitution"]],
    ["Thunderbird",   ["strength", "charisma"]],
    ["Pukwudgie",     ["wisdom", "charisma"]],
  ];

  test.each(cases)("%s has correct fixed ability bonuses", (house, expected) => {
    expect(houseFeatures[house].fixed).toEqual(expect.arrayContaining(expected));
    expect(houseFeatures[house].fixed).toHaveLength(2);
  });
});

describe("House tab — all houses grant a feat", () => {
  const houses = Object.keys(houseFeatures);

  test.each(houses)("%s grants a feat", (house) => {
    expect(houseFeatures[house].feat).toBe(true);
  });
});

describe("House tab — calculateHouseModifiers fixed bonuses", () => {
  it("applies +1 to each fixed ability for Gryffindor", () => {
    const character = { house: "Gryffindor" };
    const { modifiers } = calculateHouseModifiers(character, {});
    expect(modifiers.constitution).toBe(1);
    expect(modifiers.charisma).toBe(1);
    expect(modifiers.strength).toBe(0);
    expect(modifiers.dexterity).toBe(0);
    expect(modifiers.intelligence).toBe(0);
    expect(modifiers.wisdom).toBe(0);
  });

  it("applies +1 to each fixed ability for Ravenclaw", () => {
    const character = { house: "Ravenclaw" };
    const { modifiers } = calculateHouseModifiers(character, {});
    expect(modifiers.intelligence).toBe(1);
    expect(modifiers.wisdom).toBe(1);
    expect(modifiers.strength).toBe(0);
    expect(modifiers.dexterity).toBe(0);
    expect(modifiers.constitution).toBe(0);
    expect(modifiers.charisma).toBe(0);
  });

  it("applies +1 to chosen ability on top of fixed bonuses", () => {
    const character = { house: "Slytherin" };
    const houseChoices = { Slytherin: { abilityChoice: "intelligence" } };
    const { modifiers } = calculateHouseModifiers(character, houseChoices);
    expect(modifiers.dexterity).toBe(1);
    expect(modifiers.charisma).toBe(1);
    expect(modifiers.intelligence).toBe(1);
  });

  it("returns zero modifiers for unknown house", () => {
    const character = { house: "Unknown" };
    const { modifiers } = calculateHouseModifiers(character, {});
    const total = Object.values(modifiers).reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });

  it("returns zero modifiers when house is not set", () => {
    const character = {};
    const { modifiers } = calculateHouseModifiers(character, {});
    const total = Object.values(modifiers).reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });
});

describe("House tab — total ability bonus is always exactly 3 when choice is made", () => {
  const houses = Object.keys(houseFeatures);

  test.each(houses)("%s total bonus = 3 with a choice", (house) => {
    const character = { house };
    const fixedAbilities = houseFeatures[house].fixed;
    const nonFixed = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
      .find((a) => !fixedAbilities.includes(a));
    const houseChoices = { [house]: { abilityChoice: nonFixed } };
    const { modifiers } = calculateHouseModifiers(character, houseChoices);
    const total = Object.values(modifiers).reduce((a, b) => a + b, 0);
    expect(total).toBe(3);
  });
});
