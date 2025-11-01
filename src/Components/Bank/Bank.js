import { useState, useEffect } from "react";
import { Plus, Minus, Coins } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const SICKLES_PER_GALLEON = 17;
const KNUTS_PER_SICKLE = 29;
const KNUTS_PER_GALLEON = SICKLES_PER_GALLEON * KNUTS_PER_SICKLE;

const getBreakdown = (knuts) => {
  const galleons = Math.floor(knuts / KNUTS_PER_GALLEON);
  const remainingAfterGalleons = knuts % KNUTS_PER_GALLEON;
  const sickles = Math.floor(remainingAfterGalleons / KNUTS_PER_SICKLE);
  const finalKnuts = remainingAfterGalleons % KNUTS_PER_SICKLE;
  return { galleons, sickles, knuts: finalKnuts };
};

const Bank = ({
  user,
  selectedCharacter,
  supabase,
  adminMode,
  displayOnly = false,
}) => {
  const { theme } = useTheme();

  const [totalKnuts, setTotalKnuts] = useState(0);
  const [inputGalleons, setInputGalleons] = useState("");
  const [inputSickles, setInputSickles] = useState("");
  const [inputKnuts, setInputKnuts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const discordUserId = user?.user_metadata?.provider_id;

  useEffect(() => {
    if (selectedCharacter?.id && discordUserId) {
      loadMoneyData();
    }
  }, [selectedCharacter?.id, discordUserId]);

  const loadMoneyData = async () => {
    if (!selectedCharacter?.id || !discordUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const characterId = parseInt(selectedCharacter.id);
      if (isNaN(characterId)) {
        throw new Error("Invalid character ID");
      }

      let query = supabase
        .from("character_money")
        .select("total_knuts")
        .eq("character_id", characterId);

      if (!adminMode) {
        query = query.eq("discord_user_id", discordUserId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;

      setTotalKnuts(data?.total_knuts || 0);
    } catch (err) {
      console.error("Error loading money data:", err);
      setError("Failed to load money data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMoneyData = async (newTotalKnuts) => {
    if (!selectedCharacter?.id || !discordUserId) {
      setError("Please select a character first");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const characterId = parseInt(selectedCharacter.id);
      if (isNaN(characterId)) {
        throw new Error("Invalid character ID");
      }

      let query = supabase
        .from("character_money")
        .select("id")
        .eq("character_id", characterId);

      if (!adminMode) {
        query = query.eq("discord_user_id", discordUserId);
      }

      const { data: existingData, error: fetchError } =
        await query.maybeSingle();

      if (fetchError) throw fetchError;

      if (existingData) {
        const { error: updateError } = await supabase
          .from("character_money")
          .update({
            total_knuts: newTotalKnuts,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id);

        if (updateError) throw updateError;
      } else {
        const characterDiscordUserId = adminMode
          ? selectedCharacter.discord_user_id
          : discordUserId;

        const { error: insertError } = await supabase
          .from("character_money")
          .insert([
            {
              character_id: characterId,
              discord_user_id: characterDiscordUserId,
              total_knuts: newTotalKnuts,
            },
          ]);

        if (insertError) throw insertError;
      }

      return true;
    } catch (err) {
      console.error("Error saving money data:", err);
      setError("Failed to save money data: " + err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const calculateInputKnuts = () => {
    const galleons = parseFloat(inputGalleons) || 0;
    const sickles = parseFloat(inputSickles) || 0;
    const knuts = parseFloat(inputKnuts) || 0;

    return Math.round(
      galleons * KNUTS_PER_GALLEON + sickles * KNUTS_PER_SICKLE + knuts
    );
  };

  const handleTransaction = async (isAdding) => {
    const knutsToChange = calculateInputKnuts();
    if (knutsToChange <= 0) return;

    const newTotal = isAdding
      ? totalKnuts + knutsToChange
      : Math.max(0, totalKnuts - knutsToChange);

    const success = await saveMoneyData(newTotal);
    if (success) {
      setTotalKnuts(newTotal);
      clearInputs();
    }
  };

  const clearInputs = () => {
    setInputGalleons("");
    setInputSickles("");
    setInputKnuts("");
  };

  const hasInput = inputGalleons || inputSickles || inputKnuts;
  const { galleons, sickles, knuts } = getBreakdown(totalKnuts);

  if (displayOnly) {
    if (isLoading) {
      return (
        <div style={{ fontSize: "12px", color: theme.textSecondary }}>
          Loading...
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        <span>
          🥇 Galleons:{" "}
          <strong style={{ fontWeight: "700", color: theme.text }}>
            {galleons}
          </strong>
        </span>
        <span>
          🥈 Sickles:{" "}
          <strong style={{ fontWeight: "700", color: theme.text }}>
            {sickles}
          </strong>
        </span>
        <span>
          🥉 Knuts:{" "}
          <strong style={{ fontWeight: "700", color: theme.text }}>
            {knuts}
          </strong>
        </span>
      </div>
    );
  }

  if (!user || !discordUserId) {
    return (
      <div style={styles.container(theme)}>
        <div style={styles.message}>
          Please log in to manage your bank account.
        </div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div style={styles.container(theme)}>
        <div style={styles.message}>Please select a character.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.container(theme)}>
        <div style={styles.message}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container(theme)}>
      <div style={styles.header(theme)}>
        <Coins size={20} color={theme.primary} />
        <span style={styles.headerText(theme)}>
          Bank • {selectedCharacter.name}
        </span>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.balance(theme)}>
        <div style={styles.balanceItem}>
          <div style={styles.balanceNumber}>{galleons}</div>
          <div style={styles.balanceLabel}>Galleons</div>
        </div>
        <div style={styles.balanceItem}>
          <div style={styles.balanceNumber}>{sickles}</div>
          <div style={styles.balanceLabel}>Sickles</div>
        </div>
        <div style={styles.balanceItem}>
          <div style={styles.balanceNumber}>{knuts}</div>
          <div style={styles.balanceLabel}>Knuts</div>
        </div>
      </div>

      <div style={styles.inputRow}>
        <input
          type="number"
          step="1"
          min="0"
          value={inputGalleons}
          onChange={(e) => setInputGalleons(e.target.value)}
          placeholder="0"
          style={styles.input(theme)}
          disabled={isSaving}
          className="bank-input"
        />
        <input
          type="number"
          step="1"
          min="0"
          value={inputSickles}
          onChange={(e) => setInputSickles(e.target.value)}
          placeholder="0"
          style={styles.input(theme)}
          disabled={isSaving}
          className="bank-input"
        />
        <input
          type="number"
          step="1"
          min="0"
          value={inputKnuts}
          onChange={(e) => setInputKnuts(e.target.value)}
          placeholder="0"
          style={styles.input(theme)}
          disabled={isSaving}
          className="bank-input"
        />
      </div>

      <style>{`
        .bank-input::-webkit-outer-spin-button,
        .bank-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .bank-input {
          -moz-appearance: textfield;
          text-align: center !important;
        }
        .bank-input::placeholder {
          text-align: center;
        }
      `}</style>

      <div style={styles.buttonRow}>
        <button
          onClick={() => handleTransaction(true)}
          disabled={!hasInput || isSaving}
          style={styles.actionBtn(theme, "add", hasInput && !isSaving)}
        >
          <Plus size={16} />
          Add
        </button>
        <button
          onClick={() => handleTransaction(false)}
          disabled={!hasInput || isSaving}
          style={styles.actionBtn(theme, "remove", hasInput && !isSaving)}
        >
          <Minus size={16} />
          Remove
        </button>
      </div>

      <div style={styles.exchangeRates}>
        <div style={styles.hint(theme)}>1 Galleon = 17 Sickles = 493 Knuts</div>
        <div style={styles.hint(theme)}>1 Sickle = 29 Knuts</div>
      </div>
    </div>
  );
};

const styles = {
  container: (theme) => ({
    backgroundColor: theme.surface,
    borderRadius: "12px",
    padding: "16px",
    border: `1px solid ${theme.border}`,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    maxWidth: "400px",
  }),

  header: (theme) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${theme.border}`,
  }),

  headerText: (theme) => ({
    fontSize: "14px",
    fontWeight: "600",
    color: theme.text,
  }),

  message: {
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
    color: "#666",
  },

  error: {
    backgroundColor: "#FEE2E2",
    border: "1px solid #FECACA",
    color: "#DC2626",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "13px",
  },

  balance: (theme) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "12px 24px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    marginBottom: "12px",
  }),

  balanceItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },

  balanceNumber: {
    fontSize: "20px",
    fontWeight: "700",
  },

  balanceLabel: {
    fontSize: "11px",
    fontWeight: "500",
    opacity: 0.8,
  },

  inputRow: {
    display: "flex",
    justifyContent: "space-around",
    padding: "0 24px",
    marginBottom: "8px",
  },

  input: (theme) => ({
    width: "60px",
    padding: "8px 4px",
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    backgroundColor: theme.surface,
    color: theme.text,
    fontSize: "14px",
    textAlign: "center",
    boxSizing: "border-box",
    flex: 1,
    maxWidth: "60px",
  }),

  buttonRow: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "12px",
  },

  actionBtn: (theme, type, isEnabled) => ({
    flex: 1,
    maxWidth: "120px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: isEnabled ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    backgroundColor: isEnabled
      ? type === "add"
        ? theme.success || "#10B981"
        : theme.error || "#EF4444"
      : theme.textSecondary,
    color: "white",
    opacity: isEnabled ? 1 : 0.5,
  }),

  exchangeRates: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  hint: (theme) => ({
    fontSize: "11px",
    color: theme.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  }),
};

export default Bank;
