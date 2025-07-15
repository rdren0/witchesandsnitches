import React from "react";

const BetaBanner = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--warning-bg, #fef3c7)",
        color: "var(--warning-text, #92400e)",
        border: "1px solid var(--warning-border, #fbbf24)",
        padding: "12px 20px",
        textAlign: "center",
        borderRadius: "var(--border-radius, 6px)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--primary-bg, #3b82f6)",
            color: "var(--primary-text, white)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Beta
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "300px",
            lineHeight: "1.4",
          }}
        >
          This website is currently in <strong>beta</strong>. <br /> Please
          report any <strong>bugs or technical issues</strong> you encounter in{" "}
          <strong>#website</strong>, but note that content may still be
          incomplete. <br /> Thank you for your patience as I work to improve
          the experience!
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div:first-child > div {
            flex-direction: column !important;
            text-align: center !important;
          }

          div:first-child > div > div:nth-child(2) {
            min-width: auto !important;
          }

          div:first-child {
            padding: 10px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BetaBanner;
