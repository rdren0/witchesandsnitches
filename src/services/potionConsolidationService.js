/**
 * Service for consolidating duplicate potion items in inventory
 * This helps merge potions of the same type and quality that were created separately
 */

/**
 * Extracts the core potion name without quality prefix
 * e.g., "Exceptional Healing Potion" -> "Healing Potion"
 */
const extractPotionBaseName = (name) => {
  const qualityPrefixes = ['Flawed', 'Normal', 'Exceptional', 'Superior'];
  let baseName = name.trim();

  for (const prefix of qualityPrefixes) {
    if (baseName.startsWith(prefix + ' ')) {
      baseName = baseName.substring(prefix.length + 1);
      break;
    }
  }

  return baseName;
};

/**
 * Extracts the quality from a potion name
 * e.g., "Exceptional Healing Potion" -> "Exceptional"
 */
const extractPotionQuality = (name) => {
  const qualityPrefixes = ['Flawed', 'Normal', 'Exceptional', 'Superior'];
  const nameTrimmed = name.trim();

  for (const prefix of qualityPrefixes) {
    if (nameTrimmed.startsWith(prefix + ' ')) {
      return prefix;
    }
  }

  return null;
};

/**
 * Removes the "Brewed on..." timestamp from the description to compare core content
 */
const stripBrewingTimestamp = (description) => {
  if (!description) return '';

  // Remove the "Brewed on [timestamp] with [ingredients]..." part
  const lines = description.split('\n');
  const coreLines = lines.filter(line => {
    const lineTrimmed = line.trim();
    // Skip lines that start with "Brewed on" or "Sent by"
    return !lineTrimmed.startsWith('Brewed on') && !lineTrimmed.startsWith('Sent by');
  });

  return coreLines.join('\n').trim();
};

/**
 * Consolidates duplicate potions for a specific character
 * @param {string} characterId - The character's ID
 * @param {object} supabase - Supabase client
 * @returns {object} - Results of the consolidation
 */
export const consolidatePotions = async (characterId, supabase) => {
  if (!characterId || !supabase) {
    throw new Error('characterId and supabase client are required');
  }

  try {
    // Fetch all potion items for this character
    const { data: items, error: fetchError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('character_id', characterId)
      .eq('category', 'Potions')
      .order('created_at', { ascending: true }); // Keep oldest first

    if (fetchError) throw fetchError;

    if (!items || items.length === 0) {
      return {
        success: true,
        itemsProcessed: 0,
        itemsConsolidated: 0,
        itemsRemaining: 0,
        groups: []
      };
    }

    // Group potions by base name + quality + core description
    const potionGroups = {};

    items.forEach(item => {
      const baseName = extractPotionBaseName(item.name);
      const quality = extractPotionQuality(item.name);
      const coreDescription = stripBrewingTimestamp(item.description);

      // Create a unique key for grouping
      const groupKey = `${baseName}|||${quality}|||${coreDescription}`;

      if (!potionGroups[groupKey]) {
        potionGroups[groupKey] = {
          baseName,
          quality,
          coreDescription,
          items: []
        };
      }

      potionGroups[groupKey].items.push(item);
    });

    // Process each group and consolidate duplicates
    const consolidationResults = [];
    let totalConsolidated = 0;

    for (const [groupKey, group] of Object.entries(potionGroups)) {
      if (group.items.length <= 1) {
        // No duplicates, skip
        continue;
      }

      // Keep the first (oldest) item and merge others into it
      const [keepItem, ...duplicateItems] = group.items;
      const totalQuantity = group.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const originalQuantity = keepItem.quantity; // Store original in case we need to rollback

      // Step 1: Update the kept item with the total quantity
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ quantity: totalQuantity })
        .eq('id', keepItem.id);

      if (updateError) {
        console.error(`Error updating item ${keepItem.id}:`, updateError);
        // Skip this group entirely if update fails - don't delete anything
        continue;
      }

      // Step 2: Only delete duplicates if the update succeeded
      const duplicateIds = duplicateItems.map(item => item.id);
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error(`Error deleting duplicates for ${keepItem.name}:`, deleteError);
        // Delete failed but update succeeded - rollback the quantity update
        const { error: rollbackError } = await supabase
          .from('inventory_items')
          .update({ quantity: originalQuantity })
          .eq('id', keepItem.id);

        if (rollbackError) {
          console.error(`CRITICAL: Failed to rollback quantity for item ${keepItem.id}:`, rollbackError);
        }
        // Skip this group - don't count it as consolidated
        continue;
      }

      // Both operations succeeded - record the consolidation
      consolidationResults.push({
        name: keepItem.name,
        originalCount: group.items.length,
        totalQuantity,
        keptItemId: keepItem.id,
        deletedIds: duplicateIds
      });

      totalConsolidated += duplicateItems.length;
    }

    return {
      success: true,
      itemsProcessed: items.length,
      itemsConsolidated: totalConsolidated,
      itemsRemaining: items.length - totalConsolidated,
      groups: consolidationResults
    };

  } catch (error) {
    console.error('Error consolidating potions:', error);
    return {
      success: false,
      error: error.message,
      itemsProcessed: 0,
      itemsConsolidated: 0,
      itemsRemaining: 0,
      groups: []
    };
  }
};

/**
 * Finds an existing potion in inventory that matches the name and quality
 * Used when adding new potions to prevent creating duplicates
 * @param {string} characterId - The character's ID
 * @param {string} potionName - The full potion name (e.g., "Exceptional Healing Potion")
 * @param {object} supabase - Supabase client
 * @returns {object|null} - The existing potion item or null
 */
export const findExistingPotion = async (characterId, potionName, supabase) => {
  if (!characterId || !potionName || !supabase) {
    return null;
  }

  try {
    const baseName = extractPotionBaseName(potionName);
    const quality = extractPotionQuality(potionName);

    // Fetch all potions with matching category
    const { data: items, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('character_id', characterId)
      .eq('category', 'Potions');

    if (error) throw error;

    if (!items || items.length === 0) {
      return null;
    }

    // Find a matching potion by name
    const matchingItem = items.find(item => {
      const itemBaseName = extractPotionBaseName(item.name);
      const itemQuality = extractPotionQuality(item.name);

      return itemBaseName === baseName && itemQuality === quality;
    });

    return matchingItem || null;

  } catch (error) {
    console.error('Error finding existing potion:', error);
    return null;
  }
};
