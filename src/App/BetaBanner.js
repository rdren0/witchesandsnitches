import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const BetaBanner = () => {
  const { theme } = useTheme();

  return (
    <div
      className="beta-banner"
      style={{
        backgroundColor: theme.surface,
        border: `3px solid ${theme.primary}`,
        borderLeft: `8px solid ${theme.primary}`,
        padding: "24px 32px",
        borderRadius: "8px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: theme.text,
            fontSize: "17px",
            lineHeight: "1.8",
            marginBottom: "12px",
          }}
        >
          This website is now <strong>stable</strong> and will not receive
          regular updates. This is a <strong>free service</strong> created and
          maintained as a gift to the community—built in my spare time and
          funded personally.
        </div>

        <div
          style={{
            fontSize: "14px",
            color: theme.textSecondary,
            fontStyle: "italic",
          }}
        >
          - r8chael
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .beta-banner {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BetaBanner;
