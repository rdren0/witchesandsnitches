import { useState } from "react";
import {
  Download,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { gatherUserData } from "../../services/exportService";
import { buildExportZip, triggerDownload } from "./buildExportZip";

const DataExport = ({ user, discordUserId, onSignIn }) => {
  const { theme } = useTheme();
  const [status, setStatus] = useState("idle"); // idle | working | done | error
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleExport = async () => {
    setStatus("working");
    setError("");
    setProgress(0);
    setMessage("Starting…");
    try {
      const data = await gatherUserData({
        user,
        discordUserId,
        onProgress: (msg, frac) => {
          setMessage(msg);
          if (typeof frac === "number") setProgress(frac);
        },
      });

      if (!data.characters.length) {
        setStatus("error");
        setError(
          "We couldn't find any characters on this account. If that seems wrong, make sure you're signed in with the same Discord account you play on.",
        );
        return;
      }

      // Active characters and archived (active === false) characters get their
      // own separate zip so they download as two distinct files.
      const activeBundles = data.characters.filter(
        (b) => b.character.active !== false,
      );
      const archivedBundles = data.characters.filter(
        (b) => b.character.active === false,
      );
      const stamp = new Date().toISOString().slice(0, 10);

      const buildAndDownload = async (label, bundles) => {
        if (!bundles.length) return 0;
        const blob = await buildExportZip(
          { ...data, characters: bundles },
          (msg, frac) => {
            setMessage(`${label} characters — ${msg}`);
            if (typeof frac === "number") setProgress(frac);
          },
        );
        triggerDownload(blob, `witches-and-snitches-${label}-${stamp}.zip`);
        return bundles.length;
      };

      const nActive = await buildAndDownload("active", activeBundles);
      // Brief pause so browsers reliably allow the second download.
      if (nActive && archivedBundles.length) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      const nArchived = await buildAndDownload("archived", archivedBundles);

      const parts = [];
      if (nActive) parts.push(`${nActive} active`);
      if (nArchived) parts.push(`${nArchived} archived`);
      const zipCount = (nActive ? 1 : 0) + (nArchived ? 1 : 0);
      setStatus("done");
      setMessage(
        `Downloaded ${parts.join(" and ")} character${
          nActive + nArchived === 1 ? "" : "s"
        } in ${zipCount} zip file${zipCount === 1 ? "" : "s"}.`,
      );
    } catch (err) {
      console.error("Export failed:", err);
      setStatus("error");
      setError(err?.message || "Something went wrong building your backup.");
    }
  };

  const card = {
    maxWidth: 640,
    margin: "40px auto",
    padding: "32px",
    backgroundColor: theme.surface,
    border: `2px solid ${theme.border}`,
    borderRadius: 16,
    color: theme.text,
    fontFamily: '"Cinzel", "Times New Roman", serif',
    textAlign: "center",
  };

  const primaryButton = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 28px",
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
    backgroundColor: theme.primary,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 8,
  };

  const helpBlurb = (
    <p
      style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: `1px solid ${theme.border}`,
        fontSize: 14,
        color: theme.textSecondary,
        lineHeight: 1.6,
      }}
    >
      <MessageCircle
        size={15}
        style={{ verticalAlign: "-2px", marginRight: 6 }}
      />
      Need help or have questions about your download? Message{" "}
      <a
        href="https://discord.com/users/921467748729622599"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: theme.primary,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        r8chael on Discord
      </a>
      .
    </p>
  );

  if (!user) {
    return (
      <div style={card}>
        <ShieldAlert size={42} color={theme.primary} />
        <h1 style={{ marginTop: 12 }}>Download your characters</h1>
        <p style={{ color: theme.textSecondary, lineHeight: 1.6 }}>
          Witches &amp; Snitches is being retired. Before it goes offline, you
          can download a complete copy of all of your characters to keep
          forever. Sign in with the Discord account you play on to get your
          backup.
        </p>
        <button style={primaryButton} onClick={onSignIn}>
          Sign in with Discord
        </button>
        {helpBlurb}
      </div>
    );
  }

  return (
    <div style={card}>
      <Download size={42} color={theme.primary} />
      <h1 style={{ marginTop: 12 }}>Download your characters</h1>
      <p style={{ color: theme.textSecondary, lineHeight: 1.6 }}>
        Witches &amp; Snitches is being retired and will no longer be
        accessible. So you don&apos;t lose anything, this page packages{" "}
        <strong style={{ color: theme.primary }}>
          every character on your account
        </strong>{" "}
        — sheets, inventory, spells, downtime, notes, money, and character art.
        You&apos;ll get{" "}
        <strong style={{ color: theme.primary }}>two zip files</strong>: one for
        your active characters and one for your archived (inactive) ones.
      </p>
      <p style={{ color: theme.textSecondary, lineHeight: 1.6, fontSize: 14 }}>
        Inside you&apos;ll find an easy-to-read{" "}
        <strong>Excel spreadsheet</strong> and a printable <strong>PDF</strong>{" "}
        for each character (plus a raw data file for safekeeping). A README in
        the zip explains everything — no technical knowledge needed.
      </p>

      {status === "working" && (
        <div style={{ margin: "24px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: theme.text,
            }}
          >
            <Loader2
              size={18}
              style={{ animation: "spin 1s linear infinite" }}
            />
            {message}
          </div>
          <div
            style={{
              marginTop: 12,
              height: 10,
              borderRadius: 6,
              backgroundColor: theme.border,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: theme.primary,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {status === "done" && (
        <div
          style={{
            margin: "20px 0",
            color: theme.success || "#2e7d32",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={20} />
          {message}
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            margin: "20px 0",
            padding: 12,
            borderRadius: 8,
            backgroundColor: `${theme.error || "#c62828"}20`,
            color: theme.error || "#c62828",
          }}
        >
          {error}
        </div>
      )}

      <button
        style={{
          ...primaryButton,
          opacity: status === "working" ? 0.6 : 1,
          cursor: status === "working" ? "not-allowed" : "pointer",
        }}
        onClick={handleExport}
        disabled={status === "working"}
      >
        <Download size={18} />
        {status === "done"
          ? "Download again"
          : status === "working"
            ? "Preparing…"
            : "Download my character(s)"}
      </button>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: theme.textSecondary,
          opacity: 0.8,
        }}
      >
        Having trouble? Make sure you&apos;re signed in with the same Discord
        account you play on. The download includes both active and archived
        characters.
      </p>

      {helpBlurb}

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DataExport;
