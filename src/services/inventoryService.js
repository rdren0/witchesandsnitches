import { backgroundsData } from "../SharedData/backgroundsData";
import { parseEquipmentString } from "../Components/utils/equipmentParser";

export const addStartingEquipment = async (
  discordUserId,
  characterId,
  items,
  supabase
) => {
  if (!items || items.length === 0) {
    return;
  }

  const inventoryItems = items.map((item) => ({
    discord_user_id: discordUserId,
    character_id: characterId,
    name: item.name,
    description: item.description,
    quantity: item.quantity || 1,
    value: item.value || null,
    category: item.category || "General",
    attunement_required: item.attunement_required || false,
  }));

  const { error } = await supabase
    .from("inventory_items")
    .insert(inventoryItems);

  if (error) {
    console.error("Error adding starting equipment:", error);
    throw new Error(`Failed to add starting equipment: ${error.message}`);
  }
};

export const hasStartingEquipment = async (
  discordUserId,
  characterId,
  supabase
) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("id")
    .eq("discord_user_id", discordUserId)
    .eq("character_id", characterId)
    .limit(1);

  if (error) {
    console.error("Error checking for existing equipment:", error);
    return false;
  }

  return data && data.length > 0;
};

export const getStartingEquipment = (backgroundName) => {
  if (!backgroundName || !backgroundsData[backgroundName]) {
    return [];
  }

  const background = backgroundsData[backgroundName];
  const equipment = background.typicalEquipment || "";

  return parseEquipmentString(equipment);
};
