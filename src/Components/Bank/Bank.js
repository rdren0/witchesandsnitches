import { useState, useEffect } from "react";
import { Plus, Minus, Coins } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Bank = ({ user, selectedCharacter, supabase }) => {
  const { theme } = useTheme();

  const [totalKnuts, setTotalKnuts] = useState(0);
  const [inputGalleons, setInputGalleons] = useState("");
  const [inputSickles, setInputSickles] = useState("");
  const [inputKnuts, setInputKnuts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const discordUserId = user?.user_metadata?.provider_id;

  const SICKLES_PER_GALLEON = 17;
  const KNUTS_PER_SICKLE = 29;
  const KNUTS_PER_GALLEON = SICKLES_PER_GALLEON * KNUTS_PER_SICKLE;

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

      const { data, error } = await supabase
        .from("character_money")
        .select("total_knuts")
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setTotalKnuts(data.total_knuts || 0);
      } else {
        setTotalKnuts(0);
      }
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
      const { data: existingData, error: fetchError } = await supabase
        .from("character_money")
        .select("id")
        .eq("character_id", characterId)
        .eq("discord_user_id", discordUserId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

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
        const { error: insertError } = await supabase
          .from("character_money")
          .insert([
            {
              character_id: characterId,
              discord_user_id: discordUserId,
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

  const getBreakdown = (knuts) => {
    const galleons = Math.floor(knuts / KNUTS_PER_GALLEON);
    const remainingAfterGalleons = knuts % KNUTS_PER_GALLEON;
    const sickles = Math.floor(remainingAfterGalleons / KNUTS_PER_SICKLE);
    const finalKnuts = remainingAfterGalleons % KNUTS_PER_SICKLE;

    return { galleons, sickles, knuts: finalKnuts };
  };

  const calculateTotalInputKnuts = () => {
    const galleons = parseFloat(inputGalleons) || 0;
    const sickles = parseFloat(inputSickles) || 0;
    const knuts = parseFloat(inputKnuts) || 0;

    return Math.round(
      galleons * KNUTS_PER_GALLEON + sickles * KNUTS_PER_SICKLE + knuts
    );
  };

  const addMoney = async () => {
    const knutsToAdd = calculateTotalInputKnuts();
    if (knutsToAdd > 0) {
      const newTotal = totalKnuts + knutsToAdd;
      const success = await saveMoneyData(newTotal);

      if (success) {
        setTotalKnuts(newTotal);
        clearInputs();
      }
    }
  };

  const subtractMoney = async () => {
    const knutsToSubtract = calculateTotalInputKnuts();
    if (knutsToSubtract > 0) {
      const newTotal = Math.max(0, totalKnuts - knutsToSubtract);
      const success = await saveMoneyData(newTotal);

      if (success) {
        setTotalKnuts(newTotal);
        clearInputs();
      }
    }
  };

  const resetMoney = async () => {
    if (window.confirm("Are you sure you want to reset your money to 0?")) {
      const success = await saveMoneyData(0);

      if (success) {
        setTotalKnuts(0);
        clearInputs();
      }
    }
  };

  const clearInputs = () => {
    setInputGalleons("");
    setInputSickles("");
    setInputKnuts("");
  };

  const hasInput = inputGalleons || inputSickles || inputKnuts;
  const { galleons, sickles, knuts } = getBreakdown(totalKnuts);

  const containerStyle = {
    backgroundColor: theme.surface,
    borderRadius: "16px",
    padding: "24px",
    border: `2px solid ${theme.border}`,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  };

  if (!user || !discordUserId) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "12px",
            }}
          >
            Authentication Required
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: theme.textSecondary,
            }}
          >
            Please log in with Discord to manage your wizarding bank account.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "12px",
            }}
          >
            No Character Selected
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: theme.textSecondary,
            }}
          >
            Please select a character to manage their bank account.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: theme.textSecondary,
            fontStyle: "italic",
          }}
        >
          Loading bank account...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: theme.text,
            margin: "0 0 8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Coins size={28} color={theme.primary} />
          Wizarding Bank
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            margin: 0,
          }}
        >
          Manage your magical currency with precision
        </p>
        <p
          style={{
            fontSize: "12px",
            color: theme.primary,
            marginTop: "4px",
            fontWeight: "500",
          }}
        >
          Account for: {selectedCharacter.name}
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background:
            theme.gradient ||
            `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            textAlign: "center",
            color: "white",
            opacity: 0.9,
          }}
        >
          Current Balance
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🥇 Galleons
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {galleons}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🥈 Sickles
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {sickles}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🥉 Knuts
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {knuts}
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: theme.background,
          padding: "20px",
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: theme.text,
            margin: "0 0 16px 0",
          }}
        >
          Add/Remove Money
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.text,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              🥇 Galleons
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputGalleons}
              onChange={(e) => setInputGalleons(e.target.value)}
              placeholder="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `2px solid ${theme.border}`,
                borderRadius: "8px",
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                textAlign: "center",
              }}
              disabled={isSaving}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.text,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              🥈 Sickles
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputSickles}
              onChange={(e) => setInputSickles(e.target.value)}
              placeholder="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `2px solid ${theme.border}`,
                borderRadius: "8px",
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                textAlign: "center",
              }}
              disabled={isSaving}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.text,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              🥉 Knuts
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputKnuts}
              onChange={(e) => setInputKnuts(e.target.value)}
              placeholder="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `2px solid ${theme.border}`,
                borderRadius: "8px",
                backgroundColor: theme.surface,
                color: theme.text,
                fontSize: "16px",
                transition: "border-color 0.2s ease",
                textAlign: "center",
              }}
              disabled={isSaving}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={addMoney}
            disabled={!hasInput || isSaving}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: hasInput && !isSaving ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor:
                hasInput && !isSaving
                  ? theme.success || "#10B981"
                  : theme.textSecondary,
              color: "white",
              opacity: hasInput && !isSaving ? 1 : 0.6,
            }}
          >
            <Plus size={18} />
            {isSaving ? "Saving..." : "Add"}
          </button>

          <button
            onClick={subtractMoney}
            disabled={!hasInput || isSaving}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: hasInput && !isSaving ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor:
                hasInput && !isSaving
                  ? theme.error || "#EF4444"
                  : theme.textSecondary,
              color: "white",
              opacity: hasInput && !isSaving ? 1 : 0.6,
            }}
          >
            <Minus size={18} />
            {isSaving ? "Saving..." : "Remove"}
          </button>
        </div>
      </div>

      <button
        onClick={resetMoney}
        disabled={isSaving || totalKnuts === 0}
        style={{
          width: "100%",
          padding: "12px 16px",
          backgroundColor:
            isSaving || totalKnuts === 0 ? theme.textSecondary : theme.primary,
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: isSaving || totalKnuts === 0 ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
          opacity: isSaving || totalKnuts === 0 ? 0.6 : 1,
        }}
      >
        <Coins size={18} />
        {isSaving && "Saving..."}
      </button>

      <div
        style={{
          backgroundColor: theme.background,
          padding: "16px",
          borderRadius: "8px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: theme.text,
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Exchange Rates
        </div>
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            lineHeight: "1.4",
            margin: "0 0 4px 0",
          }}
        >
          1 Galleon = 17 Sickles = 493 Knuts
        </div>
        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            lineHeight: "1.4",
            margin: "0 0 4px 0",
          }}
        >
          1 Sickle = 29 Knuts
        </div>
      </div>
    </div>
  );
};

export default Bank;
