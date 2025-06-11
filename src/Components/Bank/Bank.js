import { useState } from "react";
import { Plus, Minus, Coins } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Bank = () => {
  const { theme } = useTheme();

  const [totalKnuts, setTotalKnuts] = useState(0);
  const [inputGalleons, setInputGalleons] = useState("");
  const [inputSickles, setInputSickles] = useState("");
  const [inputKnuts, setInputKnuts] = useState("");

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

  const calculateTotalInputKnuts = () => {
    const galleons = parseFloat(inputGalleons) || 0;
    const sickles = parseFloat(inputSickles) || 0;
    const knuts = parseFloat(inputKnuts) || 0;

    return Math.round(
      galleons * KNUTS_PER_GALLEON + sickles * KNUTS_PER_SICKLE + knuts
    );
  };

  const addMoney = () => {
    const knutsToAdd = calculateTotalInputKnuts();
    if (knutsToAdd > 0) {
      setTotalKnuts((prev) => prev + knutsToAdd);
      clearInputs();
    }
  };

  const subtractMoney = () => {
    const knutsToSubtract = calculateTotalInputKnuts();
    if (knutsToSubtract > 0) {
      setTotalKnuts((prev) => Math.max(0, prev - knutsToSubtract));
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

  const styles = {
    container: {
      backgroundColor: theme.surface,
      borderRadius: "16px",
      padding: "24px",
      border: `2px solid ${theme.border}`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      textAlign: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: theme.text,
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
    },
    subtitle: {
      fontSize: "14px",
      color: theme.textSecondary,
      margin: 0,
    },
    balanceCard: {
      background:
        theme.gradient ||
        `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    balanceTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      textAlign: "center",
      color: "white",
      opacity: 0.9,
    },
    currencyRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    currencyLabel: {
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    currencyValue: {
      fontSize: "20px",
      fontWeight: "bold",
    },
    totalRow: {
      borderTop: "2px solid rgba(255, 255, 255, 0.3)",
      marginTop: "16px",
      paddingTop: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    totalLabel: {
      fontWeight: "500",
      opacity: 0.9,
    },
    totalValue: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    inputCard: {
      backgroundColor: theme.background,
      padding: "20px",
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
      marginBottom: "16px",
    },
    inputTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "16px",
      margin: "0 0 16px 0",
    },
    inputGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
      marginBottom: "16px",
    },
    inputColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: theme.text,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: `2px solid ${theme.border}`,
      borderRadius: "8px",
      backgroundColor: theme.surface,
      color: theme.text,
      fontSize: "16px",
      transition: "border-color 0.2s ease",
      textAlign: "center",
      fontFamily: "inherit",
    },
    buttonRow: {
      display: "flex",
      gap: "12px",
    },
    button: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "inherit",
    },
    addButton: {
      backgroundColor: theme.success || "#10B981",
      color: "white",
    },
    addButtonDisabled: {
      backgroundColor: theme.textSecondary,
      color: "white",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    removeButton: {
      backgroundColor: theme.error || "#EF4444",
      color: "white",
    },
    removeButtonDisabled: {
      backgroundColor: theme.textSecondary,
      color: "white",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    resetButton: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: theme.primary,
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
      fontFamily: "inherit",
    },
    referenceCard: {
      backgroundColor: theme.background,
      padding: "16px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
    },
    referenceTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.text,
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    referenceText: {
      fontSize: "12px",
      color: theme.textSecondary,
      lineHeight: "1.4",
      margin: "0 0 4px 0",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Coins size={28} color={theme.primary} />
          Wizarding Bank
        </h2>
        <p style={styles.subtitle}>
          Manage your magical currency with precision
        </p>
      </div>

      <div style={styles.balanceCard}>
        <h3 style={styles.balanceTitle}>Current Balance</h3>

        <div style={styles.currencyRow}>
          <span style={styles.currencyLabel}>🥇 Galleons</span>
          <span style={styles.currencyValue}>{galleons}</span>
        </div>

        <div style={styles.currencyRow}>
          <span style={styles.currencyLabel}>🥈 Sickles</span>
          <span style={styles.currencyValue}>{sickles}</span>
        </div>

        <div style={styles.currencyRow}>
          <span style={styles.currencyLabel}>🥉 Knuts</span>
          <span style={styles.currencyValue}>{knuts}</span>
        </div>
      </div>

      <div style={styles.inputCard}>
        <h3 style={styles.inputTitle}>Add/Remove Money</h3>

        <div style={styles.inputGrid}>
          <div style={styles.inputColumn}>
            <span style={styles.inputLabel}>🥇 Galleons</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputGalleons}
              onChange={(e) => setInputGalleons(e.target.value)}
              placeholder="0"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>

          <div style={styles.inputColumn}>
            <span style={styles.inputLabel}>🥈 Sickles</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputSickles}
              onChange={(e) => setInputSickles(e.target.value)}
              placeholder="0"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>

          <div style={styles.inputColumn}>
            <span style={styles.inputLabel}>🥉 Knuts</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputKnuts}
              onChange={(e) => setInputKnuts(e.target.value)}
              placeholder="0"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = theme.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={addMoney}
            disabled={!hasInput}
            style={{
              ...styles.button,
              ...(hasInput ? styles.addButton : styles.addButtonDisabled),
            }}
          >
            <Plus size={18} />
            Add
          </button>

          <button
            onClick={subtractMoney}
            disabled={!hasInput}
            style={{
              ...styles.button,
              ...(hasInput ? styles.removeButton : styles.removeButtonDisabled),
            }}
          >
            <Minus size={18} />
            Remove
          </button>
        </div>
      </div>

      <div style={styles.referenceCard}>
        <div style={styles.referenceTitle}>Exchange Rates</div>
        <div style={styles.referenceText}>
          1 Galleon = 17 Sickles = 493 Knuts
        </div>
        <div style={styles.referenceText}>1 Sickle = 29 Knuts</div>
      </div>
    </div>
  );
};

export default Bank;
