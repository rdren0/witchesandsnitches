import { backgroundsData } from "../../SharedData/backgroundsData";

export const parseEquipmentString = (equipmentString) => {
  if (!equipmentString || typeof equipmentString !== "string") {
    return [];
  }

  const items = [];

  const rawItems = equipmentString
    .split(/,|\band\b/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  rawItems.forEach((itemText) => {
    // Clean up the text
    let cleanText = itemText
      .replace(/^(a|an|the)\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanText.length === 0) return;

    let quantity = 1;
    const quantityMatch = cleanText.match(/^(\d+)\s+(.+)$/);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[1]);
      cleanText = quantityMatch[2];
    }

    let category = "General";
    const lowerText = cleanText.toLowerCase();

    if (
      lowerText.includes("weapon") ||
      lowerText.includes("sword") ||
      lowerText.includes("bat")
    ) {
      category = "Weapon";
    } else if (lowerText.includes("armor") || lowerText.includes("robe")) {
      category = "Armor";
    } else if (lowerText.includes("potion") || lowerText.includes("kit")) {
      category = "Tool";
    } else if (
      lowerText.includes("instrument") ||
      lowerText.includes("musical")
    ) {
      category = "Instrument";
    } else if (
      lowerText.includes("book") ||
      lowerText.includes("scroll") ||
      lowerText.includes("letter")
    ) {
      category = "Literature";
    } else if (
      lowerText.includes("component") ||
      lowerText.includes("magical")
    ) {
      category = "Magical";
    }

    items.push({
      name: cleanText.charAt(0).toUpperCase() + cleanText.slice(1),
      description: `Starting equipment from ${
        backgroundsData ? "background" : "character creation"
      }`,
      quantity: quantity,
      value: "",
      category: category,
      attunement_required: false,
    });
  });

  return items;
};
