const extractPotionBaseName = (name) => {
  const qualityPrefixes = ["Flawed", "Normal", "Exceptional", "Superior"];
  let baseName = name.trim();

  for (const prefix of qualityPrefixes) {
    if (baseName.startsWith(prefix + " ")) {
      baseName = baseName.substring(prefix.length + 1);
      break;
    }
  }

  return baseName;
};

const extractPotionQuality = (name) => {
  const qualityPrefixes = ["Flawed", "Normal", "Exceptional", "Superior"];
  const nameTrimmed = name.trim();

  for (const prefix of qualityPrefixes) {
    if (nameTrimmed.startsWith(prefix + " ")) {
      return prefix;
    }
  }

  return null;
};

const stripBrewingTimestamp = (description) => {
  if (!description) return "";

  const lines = description.split("\n");
  const coreLines = lines.filter((line) => {
    const lineTrimmed = line.trim();

    return (
      !lineTrimmed.startsWith("Brewed on") && !lineTrimmed.startsWith("Sent by")
    );
  });

  return coreLines.join("\n").trim();
};

export const consolidatePotions = async (characterId, supabase) => {
  if (!characterId || !supabase) {
    throw new Error("characterId and supabase client are required");
  }

  try {
    const { data: items, error: fetchError } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("character_id", characterId)
      .eq("category", "Potions")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    if (!items || items.length === 0) {
      return {
        success: true,
        itemsProcessed: 0,
        itemsConsolidated: 0,
        itemsRemaining: 0,
        groups: [],
      };
    }

    const potionGroups = {};

    items.forEach((item) => {
      const baseName = extractPotionBaseName(item.name);
      const quality = extractPotionQuality(item.name);
      const coreDescription = stripBrewingTimestamp(item.description);

      const groupKey = `${baseName}|||${quality}|||${coreDescription}`;

      if (!potionGroups[groupKey]) {
        potionGroups[groupKey] = {
          baseName,
          quality,
          coreDescription,
          items: [],
        };
      }

      potionGroups[groupKey].items.push(item);
    });

    const consolidationResults = [];
    let totalConsolidated = 0;

    for (const [groupKey, group] of Object.entries(potionGroups)) {
      if (group.items.length <= 1) {
        continue;
      }

      const [keepItem, ...duplicateItems] = group.items;
      const totalQuantity = group.items.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      const originalQuantity = keepItem.quantity;

      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ quantity: totalQuantity })
        .eq("id", keepItem.id);

      if (updateError) {
        console.error(`Error updating item ${keepItem.id}:`, updateError);

        continue;
      }

      const duplicateIds = duplicateItems.map((item) => item.id);
      const { error: deleteError } = await supabase
        .from("inventory_items")
        .delete()
        .in("id", duplicateIds);

      if (deleteError) {
        console.error(
          `Error deleting duplicates for ${keepItem.name}:`,
          deleteError
        );

        const { error: rollbackError } = await supabase
          .from("inventory_items")
          .update({ quantity: originalQuantity })
          .eq("id", keepItem.id);

        if (rollbackError) {
          console.error(
            `CRITICAL: Failed to rollback quantity for item ${keepItem.id}:`,
            rollbackError
          );
        }

        continue;
      }

      consolidationResults.push({
        name: keepItem.name,
        originalCount: group.items.length,
        totalQuantity,
        keptItemId: keepItem.id,
        deletedIds: duplicateIds,
      });

      totalConsolidated += duplicateItems.length;
    }

    return {
      success: true,
      itemsProcessed: items.length,
      itemsConsolidated: totalConsolidated,
      itemsRemaining: items.length - totalConsolidated,
      groups: consolidationResults,
    };
  } catch (error) {
    console.error("Error consolidating potions:", error);
    return {
      success: false,
      error: error.message,
      itemsProcessed: 0,
      itemsConsolidated: 0,
      itemsRemaining: 0,
      groups: [],
    };
  }
};

export const findExistingPotion = async (characterId, potionName, supabase) => {
  if (!characterId || !potionName || !supabase) {
    return null;
  }

  try {
    const baseName = extractPotionBaseName(potionName);
    const quality = extractPotionQuality(potionName);

    const { data: items, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("character_id", characterId)
      .eq("category", "Potions");

    if (error) throw error;

    if (!items || items.length === 0) {
      return null;
    }

    const matchingItem = items.find((item) => {
      const itemBaseName = extractPotionBaseName(item.name);
      const itemQuality = extractPotionQuality(item.name);

      return itemBaseName === baseName && itemQuality === quality;
    });

    return matchingItem || null;
  } catch (error) {
    console.error("Error finding existing potion:", error);
    return null;
  }
};
