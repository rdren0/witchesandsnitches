import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, BookOpen, PlusIcon, MinusIcon } from "lucide-react";
import SorceryPointTracker from "./SorceryPointTracker";
import { useTheme } from "../../../contexts/ThemeContext";

const SpellSlotTracker = ({
  character,
  supabase,
  discordUserId,
  setCharacter,
  selectedCharacterId,
}) => {
  const { theme } = useTheme();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalData, setModalData] = useState({
    level: 1,
    action: "use",
    amount: 1,
  });
  const SPELL_SLOT_PROGRESSION = useMemo(
    () => ({
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
      19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
      20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    }),
    []
  );

  const setupStandardSpellSlots = useCallback(
    async (characterLevel, isLevelUpRefresh = false) => {
      if (
        !character ||
        isUpdating ||
        !characterLevel ||
        characterLevel < 1 ||
        characterLevel > 20
      )
        return;

      setIsUpdating(true);

      try {
        const progression = SPELL_SLOT_PROGRESSION[characterLevel];
        if (!progression) {
          console.error("Invalid character level:", characterLevel);
          return;
        }

        const updateData = {
          character_id: selectedCharacterId,
          discord_user_id: discordUserId,
          updated_at: new Date().toISOString(),
        };

        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          updateData[`max_spell_slots_${spellLevel}`] = maxSlots;

          updateData[`spell_slots_${spellLevel}`] = maxSlots;
        });

        const { error } = await supabase
          .from("character_resources")
          .upsert(updateData, {
            onConflict: "character_id,discord_user_id",
          });

        if (error) {
          console.error("Error setting up spell slots:", error);
          return;
        }

        const newCharacterState = { ...character };
        progression.forEach((maxSlots, index) => {
          const spellLevel = index + 1;
          newCharacterState[`maxSpellSlots${spellLevel}`] = maxSlots;
          newCharacterState[`spellSlots${spellLevel}`] = maxSlots;
        });
        setCharacter(newCharacterState);

        const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
        if (discordWebhookUrl) {
          const embed = {
            title: `${character.name} - ${
              isLevelUpRefresh
                ? "Spell Slots Refreshed (Level Up!)"
                : "Spell Slots Configured"
            }`,
            color: isLevelUpRefresh ? 0x10b981 : 0x3b82f6,
            description: isLevelUpRefresh
              ? `Level up to ${characterLevel}! All spell slots restored and new levels unlocked.`
              : `Spell slots set up for level ${characterLevel} character`,
            timestamp: new Date().toISOString(),
            footer: {
              text: "Witches and Snitches - Spell Setup",
            },
          };

          try {
            await fetch(discordWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ embeds: [embed] }),
            });
          } catch (discordError) {
            console.error("Error sending to Discord:", discordError);
          }
        }
      } catch (error) {
        console.error("Error setting up spell slots:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [
      character,
      isUpdating,
      SPELL_SLOT_PROGRESSION,
      selectedCharacterId,
      discordUserId,
      supabase,
      setCharacter,
    ]
  );

  const [customSlots, setCustomSlots] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  });
  const [lastKnownLevel, setLastKnownLevel] = useState(null);

  useEffect(() => {
    if (
      character?.level &&
      lastKnownLevel &&
      character.level !== lastKnownLevel
    ) {
      console.log(
        `Character leveled up from ${lastKnownLevel} to ${character.level}, refreshing spell slots...`
      );
      setupStandardSpellSlots(character.level, true);
    }
    setLastKnownLevel(character?.level);
  }, [character?.level, lastKnownLevel, setupStandardSpellSlots]);

  useEffect(() => {
    const autoSetupSpellSlots = async () => {
      if (!character || !character.level || isUpdating) return;

      const hasSpellSlots = Object.keys(character).some(
        (key) => key.startsWith("maxSpellSlots") && character[key] > 0
      );

      if (!hasSpellSlots) {
        await setupStandardSpellSlots(character.level, false);
      }
    };

    autoSetupSpellSlots();
  }, [
    character?.level,
    selectedCharacterId,
    character,
    isUpdating,
    setupStandardSpellSlots,
  ]);

  const getSpellSlotData = () => {
    const slots = [];
    for (let level = 1; level <= 9; level++) {
      const current = character?.[`spellSlots${level}`] || 0;
      const max = character?.[`maxSpellSlots${level}`] || 0;
      if (max > 0) {
        slots.push({ level, current, max });
      }
    }
    return slots;
  };

  const spellSlots = getSpellSlotData();

  const getSlotColor = (current, max) => {
    if (max === 0) return "#6b7280";
    const percentage = current / max;
    if (percentage >= 0.75) return "#10b981";
    if (percentage >= 0.5) return "#3b82f6";
    if (percentage >= 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const updateCustomSpellSlots = async () => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: discordUserId,
        updated_at: new Date().toISOString(),
      };

      Object.keys(customSlots).forEach((level) => {
        const maxSlots = customSlots[level];
        updateData[`max_spell_slots_${level}`] = maxSlots;

        const currentSlots = character?.[`spellSlots${level}`] || 0;
        updateData[`spell_slots_${level}`] = Math.min(currentSlots, maxSlots);
      });

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        });

      if (error) {
        console.error("Error updating spell slots:", error);
        alert("Failed to update spell slots");
        return;
      }

      const newCharacterState = { ...character };
      Object.keys(customSlots).forEach((level) => {
        const maxSlots = customSlots[level];
        newCharacterState[`maxSpellSlots${level}`] = maxSlots;
        const currentSlots = character?.[`spellSlots${level}`] || 0;
        newCharacterState[`spellSlots${level}`] = Math.min(
          currentSlots,
          maxSlots
        );
      });
      setCharacter(newCharacterState);

      setShowCustomModal(false);

      const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
      if (discordWebhookUrl) {
        const totalSlots = Object.values(customSlots).reduce(
          (sum, slots) => sum + slots,
          0
        );
        const embed = {
          title: `${character.name} - Spell Slots Updated`,
          color: 0xf59e0b,
          description: `Spell slot maximums updated (${totalSlots} total slots)`,
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Spell Update",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }
    } catch (error) {
      console.error("Error updating spell slots:", error);
      alert("Error updating spell slots. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSpellSlotChange = async (level, change, action) => {
    if (!character || isUpdating) return;

    setIsUpdating(true);

    try {
      const currentSlots = character?.[`spellSlots${level}`] || 0;
      const maxSlots = character?.[`maxSpellSlots${level}`] || 0;
      const newSlots = Math.max(0, Math.min(maxSlots, currentSlots + change));

      const updateData = {
        character_id: selectedCharacterId,
        discord_user_id: discordUserId,
        [`spell_slots_${level}`]: newSlots,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("character_resources")
        .upsert(updateData, {
          onConflict: "character_id,discord_user_id",
        });

      if (error) {
        console.error("Error updating spell slots:", error);
        alert("Failed to update spell slots");
        return;
      }

      setCharacter((prev) => ({
        ...prev,
        [`spellSlots${level}`]: newSlots,
      }));

      const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
      if (discordWebhookUrl) {
        const embed = {
          title: `${character.name} - ${action}`,
          color: change > 0 ? 0x10b981 : 0x3b82f6,
          fields: [
            {
              name: "Spell Level",
              value: `Level ${level}`,
              inline: true,
            },
            {
              name: "Change",
              value: `${change > 0 ? "+" : ""}${change} Slot${
                Math.abs(change) !== 1 ? "s" : ""
              }`,
              inline: true,
            },
            {
              name: "Current Total",
              value: `${newSlots}/${maxSlots} Slots`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Witches and Snitches - Spell Slots",
          },
        };

        try {
          await fetch(discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] }),
          });
        } catch (discordError) {
          console.error("Error sending to Discord:", discordError);
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error updating spell slots:", error);
      alert("Error updating spell slots. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (level, action) => {
    setModalData({ level, action, amount: 1 });
    setShowModal(true);
  };

  const openCustomModal = () => {
    const currentCustomSlots = {};
    for (let level = 1; level <= 9; level++) {
      currentCustomSlots[level] = character?.[`maxSpellSlots${level}`] || 0;
    }
    setCustomSlots(currentCustomSlots);
    setShowCustomModal(true);
  };

  const styles = {
    container: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "12px",
      padding: "20px",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#3b82f6",
      fontSize: "16px",
      fontWeight: "600",
    },
    headerButtons: {
      display: "flex",
      gap: "8px",
    },
    addButton: {
      backgroundColor: "#f59e0b",
      border: `2px solid ${theme.border}`,
      borderRadius: "6px",
      color: theme.text,
      padding: "4px 8px",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    spellSlotsSection: {
      marginBottom: "20px",
    },
    slotsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      maxWidth: "100%",
      alignItems: "stretch",
    },
    slotItem: {
      backgroundColor: theme.background,
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
      position: "relative",
      cursor: "pointer",
      flex: "1 1 calc(20% - 9.6px)",
      minWidth: "120px",
      maxWidth: "23%",
      boxSizing: "border-box",
    },
    slotLevel: {
      fontSize: "14px",
      color: "#9ca3af",
      marginBottom: "4px",
      fontWeight: "500",
    },
    slotDisplay: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    slotButtons: {
      display: "flex",
      gap: "4px",
      justifyContent: "center",
    },
    slotButton: {
      padding: "2px 6px",
      borderRadius: "4px",
      border: "none",
      fontSize: "10px",
      cursor: "pointer",
      fontWeight: "600",
      minWidth: "50px",
      minHeight: "24px",
    },
    addSlotButton: {
      backgroundColor: "#10b981",
      color: "white",
    },
    useSlotButton: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "300px",
      maxWidth: "400px",
    },
    modalHeader: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#f9fafb",
      marginBottom: "16px",
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      color: "#d1d5db",
      fontSize: "14px",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "#374151",
      border: "1px solid #4b5563",
      borderRadius: "6px",
      color: "#f9fafb",
      fontSize: "16px",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    modalButton: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#6b7280",
      color: "white",
    },
    confirmButton: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    emptyState: {
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
      padding: "40px 20px",
    },
    resourcesContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
  };

  if (spellSlots.length === 0) {
    return (
      <div style={styles.resourcesContainer}>
        <div style={styles.container}>
          <div style={styles.headerTitle}>
            <BookOpen size={20} />
            Spell Slots
          </div>
          <div style={styles.emptyState}>
            {character?.level ? (
              <>
                Setting up spell slots for level {character.level} character...
                {isUpdating && (
                  <div style={{ marginTop: "8px" }}>Configuring...</div>
                )}
              </>
            ) : (
              "Character level needed to configure spell slots."
            )}
          </div>
        </div>

        {/* Still render Sorcery Points even if no spell slots */}
        <SorceryPointTracker
          character={character}
          supabase={supabase}
          discordUserId={discordUserId}
          setCharacter={setCharacter}
          selectedCharacterId={selectedCharacterId}
        />
      </div>
    );
  }
  const spellAndSorceryTiles = spellSlots.map(({ level, current, max }) => (
    <div
      key={level}
      style={styles.slotItem}
      onClick={() => openModal(level, "use")}
    >
      <div style={styles.slotLevel}>Level {level}</div>
      <div
        style={{
          ...styles.slotDisplay,
          color: getSlotColor(current, max),
        }}
      >
        {current}/{max}
      </div>
      <div style={styles.slotButtons}>
        <button
          style={{ ...styles.slotButton, ...styles.addSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openModal(level, "add");
          }}
          disabled={isUpdating || current >= max}
        >
          <PlusIcon size={12} />
        </button>
        <button
          style={{ ...styles.slotButton, ...styles.useSlotButton }}
          onClick={(e) => {
            e.stopPropagation();
            openModal(level, "use");
          }}
          disabled={isUpdating || current === 0}
        >
          <MinusIcon size={12} />
        </button>
      </div>
    </div>
  ));
  // spellAndSorceryTiles.push(
  //   <SorceryPointTracker
  //     key="sorcery-points"
  //     character={character}
  //     supabase={supabase}
  //     discordUserId={discordUserId}
  //     setCharacter={setCharacter}
  //     selectedCharacterId={selectedCharacterId}
  //   />
  // );

  return (
    <div style={styles.resourcesContainer}>
      {/* Spell Slots Component */}
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <BookOpen size={20} />
            Spell Slots
          </div>
          <div style={styles.headerButtons}>
            <button
              style={styles.addButton}
              onClick={openCustomModal}
              disabled={isUpdating}
            >
              <Plus size={12} />
              Configure
            </button>
          </div>
        </div>

        <div style={styles.slotsGrid}>{spellAndSorceryTiles}</div>

        {/* Custom Spell Slots Modal */}
        {showCustomModal && (
          <div style={styles.modal} onClick={() => setShowCustomModal(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <Plus
                  size={20}
                  style={{ marginRight: "8px", color: "#f59e0b" }}
                />
                Modify Spell Slot Maximums
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginBottom: "16px",
                  }}
                >
                  Adjust maximum spell slots for each level. Current slots will
                  be preserved where possible.
                </div>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <div
                    key={level}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      padding: "8px",
                      backgroundColor: "#374151",
                      borderRadius: "6px",
                    }}
                  >
                    <label
                      style={{
                        color: "#d1d5db",
                        fontSize: "14px",
                        minWidth: "80px",
                      }}
                    >
                      Level {level}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={customSlots[level]}
                      onChange={(e) =>
                        setCustomSlots((prev) => ({
                          ...prev,
                          [level]: Math.max(
                            0,
                            Math.min(20, parseInt(e.target.value) || 0)
                          ),
                        }))
                      }
                      style={{
                        ...styles.input,
                        width: "80px",
                        margin: 0,
                        padding: "6px 8px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={styles.modalButtons}>
                <button
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onClick={() => setShowCustomModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.confirmButton }}
                  onClick={updateCustomSpellSlots}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Spell Slots"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding/using spell slots */}
        {showModal && (
          <div style={styles.modal} onClick={() => setShowModal(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <BookOpen
                  size={20}
                  style={{ marginRight: "8px", color: "#3b82f6" }}
                />
                {modalData.action === "add" ? "Add" : "Use"} Level{" "}
                {modalData.level} Spell Slot
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Slots to {modalData.action === "add" ? "Add" : "Use"}:
                </label>
                <input
                  type="number"
                  min="1"
                  max={
                    modalData.action === "add"
                      ? spellSlots.find((s) => s.level === modalData.level)
                          ?.max || 1
                      : spellSlots.find((s) => s.level === modalData.level)
                          ?.current || 1
                  }
                  value={modalData.amount}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      amount: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  style={styles.input}
                  autoFocus
                />
              </div>

              <div style={styles.modalButtons}>
                <button
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.confirmButton }}
                  onClick={() =>
                    handleSpellSlotChange(
                      modalData.level,
                      modalData.action === "add"
                        ? modalData.amount
                        : -modalData.amount,
                      modalData.action === "add"
                        ? "Spell Slot Added"
                        : "Spell Slot Used"
                    )
                  }
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? modalData.action === "add"
                      ? "Adding..."
                      : "Using..."
                    : `${modalData.action === "add" ? "Add" : "Use"} ${
                        modalData.amount
                      }`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellSlotTracker;
