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

// Discord accounts not eligible for self-service export.
// Configured via REACT_APP_EXPORT_BLOCKED_IDS (comma-separated Discord user IDs).
const BLOCKED_EXPORT_IDS = (process.env.REACT_APP_EXPORT_BLOCKED_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const DataExport = ({ user, discordUserId, onSignIn }) => {
  const { theme } = useTheme();
  const isBlocked =
    discordUserId && BLOCKED_EXPORT_IDS.includes(String(discordUserId));
  const [status, setStatus] = useState("idle"); // idle | working | done | error
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleExport = async () => {
    if (isBlocked) return;
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

      // Active and archived (active === false) characters go into separate
      // "Active" / "Inactive" folders inside a single downloaded zip.
      const activeBundles = data.characters.filter(
        (b) => b.character.active !== false,
      );
      const archivedBundles = data.characters.filter(
        (b) => b.character.active === false,
      );
      const stamp = new Date().toISOString().slice(0, 10);

      const groups = [
        { folder: "Active", bundles: activeBundles },
        { folder: "Inactive", bundles: archivedBundles },
      ].filter((g) => g.bundles.length);

      const blob = await buildExportZip({ ...data, groups }, (msg, frac) => {
        setMessage(msg);
        if (typeof frac === "number") setProgress(frac);
      });
      triggerDownload(blob, `witches-and-snitches-characters-${stamp}.zip`);

      const nActive = activeBundles.length;
      const nArchived = archivedBundles.length;
      const parts = [];
      if (nActive) parts.push(`${nActive} active`);
      if (nArchived) parts.push(`${nArchived} archived`);
      setStatus("done");
      setMessage(
        `Downloaded ${parts.join(" and ")} character${
          nActive + nArchived === 1 ? "" : "s"
        } in one zip file (Active / Inactive folders inside).`,
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

  // Body copy reads better left-aligned; the card only centers the icon,
  // heading, button, and status text.
  const bodyText = {
    color: theme.textSecondary,
    lineHeight: 1.6,
    textAlign: "left",
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
        textAlign: "left",
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
        <p style={bodyText}>
          <strong style={{ color: theme.primary }}>
            Heads up — this may be unexpected.
          </strong>{" "}
          The original character site has been taken down — this page is all
          that&apos;s left, so you can still download a complete copy of
          everything you made. I took it down because the game&apos;s DM had
          another person copy this project&apos;s code to build a new site
          without me, using work I made — the copy already circulating had my
          license and credit removed — and I was removed from the community
          Discord with no notice or reason. Sign in with the Discord account you
          play on to download a complete copy of all your characters to keep.
        </p>
        <button style={primaryButton} onClick={onSignIn}>
          Sign in with Discord
        </button>
        {helpBlurb}
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div style={card}>
        <ShieldAlert size={42} color={theme.primary} />
        <h1 style={{ marginTop: 12 }}>Export unavailable for this account</h1>
        <p style={bodyText}>
          Self-service character export isn&apos;t available for this account.
          If you believe this is a mistake, reach out using the contact below.
        </p>
        {helpBlurb}
      </div>
    );
  }

  return (
    <div style={card}>
      <Download size={42} color={theme.primary} />
      <h1 style={{ marginTop: 12 }}>Download your characters</h1>
      <p style={bodyText}>
        <strong style={{ color: theme.primary }}>Welp...</strong> <br />
        The original site is gone now, and this downloader is all that&apos;s
        left — I want to make sure you keep everything you made here. To be
        honest about why I took it down: the game&apos;s DM had another person
        copy this project&apos;s code to build a new site without me, using work
        I made — the copy already circulating had my license and credit stripped
        out — and I was removed from the community Discord with no notice or
        reason.{" "}
        <strong style={{ color: theme.primary }}>
          All of this happened despite my promise to keep this website up and
          running for you players.
        </strong>{" "}
        Rather than leave your characters on something I no longer control,
        I&apos;m giving everyone a clean copy of their own data. <br />
        <br />
        This page packages{" "}
        <strong style={{ color: theme.primary }}>
          every character on your account
        </strong>{" "}
        — sheets, inventory, spells, downtime, notes, and money. You&apos;ll get{" "}
        <strong style={{ color: theme.primary }}>one zip file</strong> with an{" "}
        <strong>Active</strong> and an <strong>Inactive</strong> folder inside —
        active characters in one, archived (inactive) ones in the other.
      </p>

      <p style={{ ...bodyText, fontSize: 14 }}>
        Inside you&apos;ll find an <strong>Excel spreadsheet</strong> for each
        character. A README in the zip explains everything — no technical
        knowledge needed.
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
          textAlign: "left",
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
