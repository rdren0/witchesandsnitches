import { backgroundsData } from "../../SharedData/backgroundsData";

// Rules source: updatedRules.txt — BACKGROUNDS section
// Each background grants 2 skill proficiencies and at least one feature.

const EXPECTED_BACKGROUNDS = [
  "Activist",
  "Artist",
  "Bookworm",
  "Bully",
  "Camper",
  "Class Clown",
  "Dreamer",
  "Follower",
  "Groundskeeper",
  "Investigator",
  "Klutz",
  "Loser",
  "Potioneer",
  "Protector",
  "Quidditch Fan",
  "Socialite",
  "Troublemaker",
];

describe("Background tab — all expected backgrounds are defined", () => {
  test.each(EXPECTED_BACKGROUNDS)("%s is defined", (name) => {
    expect(backgroundsData).toHaveProperty(name);
  });
});

describe("Background tab — data completeness", () => {
  const backgrounds = Object.keys(backgroundsData);

  test.each(backgrounds)("%s has name, description, skillProficiencies, features", (name) => {
    const bg = backgroundsData[name];
    expect(bg.name).toBe(name);
    expect(typeof bg.description).toBe("string");
    expect(bg.description.length).toBeGreaterThan(0);
    expect(Array.isArray(bg.skillProficiencies)).toBe(true);
    expect(Array.isArray(bg.features)).toBe(true);
  });
});

describe("Background tab — each background grants exactly 2 skill proficiencies", () => {
  const backgrounds = Object.keys(backgroundsData);

  test.each(backgrounds)("%s grants 2 skill proficiencies", (name) => {
    expect(backgroundsData[name].skillProficiencies).toHaveLength(2);
  });
});

describe("Background tab — each background has at least one feature", () => {
  const backgrounds = Object.keys(backgroundsData);

  test.each(backgrounds)("%s has at least one feature", (name) => {
    expect(backgroundsData[name].features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Background tab — specific skill proficiency spot checks", () => {
  it("Activist grants Persuasion and History of Magic", () => {
    expect(backgroundsData.Activist.skillProficiencies).toEqual(
      expect.arrayContaining(["Persuasion", "History of Magic"])
    );
  });

  it("Bookworm grants Magical Theory and Investigation", () => {
    expect(backgroundsData.Bookworm.skillProficiencies).toEqual(
      expect.arrayContaining(["Magical Theory", "Investigation"])
    );
  });

  it("Investigator grants Investigation and Insight", () => {
    expect(backgroundsData.Investigator.skillProficiencies).toEqual(
      expect.arrayContaining(["Investigation", "Insight"])
    );
  });

  it("Troublemaker grants Sleight of Hand and Stealth", () => {
    expect(backgroundsData.Troublemaker.skillProficiencies).toEqual(
      expect.arrayContaining(["Sleight of Hand", "Stealth"])
    );
  });
});

describe("Background tab — tool proficiencies are arrays when present", () => {
  const backgroundsWithTools = Object.entries(backgroundsData).filter(
    ([, bg]) => bg.toolProficiencies !== undefined
  );

  it("any toolProficiencies field is an array", () => {
    backgroundsWithTools.forEach(([, bg]) => {
      expect(Array.isArray(bg.toolProficiencies)).toBe(true);
    });
  });

  it("Dreamer has Astronomer's tools", () => {
    expect(backgroundsData.Dreamer.toolProficiencies).toContain("Astronomer's tools");
  });

  it("Groundskeeper has Herbologist's tools", () => {
    expect(backgroundsData.Groundskeeper.toolProficiencies).toContain("Herbologist's tools");
  });
});
