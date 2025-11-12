import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ExternalLink, BookOpen, Bug, Code, Lightbulb } from "lucide-react";

const HelpResources = () => {
  const { theme } = useTheme();

  const resources = [
    {
      title: "Rulebook",
      description: "Complete game rules and mechanics",
      url: "https://docs.google.com/document/d/1BY7U9mYLQD_p9O9e42AYLHG2Xr6ZCsR8Ye07MaGXfVw/edit?tab=t.0#heading=h.frfwms2htyde",
      icon: BookOpen,
      color: "#8b5cf6",
    },
    {
      title: "Classes & Spells",
      description: "Detailed information about classes and spells",
      url: "https://docs.google.com/document/d/1m-TbIj7gFzYUlA_ASa7pCrW8cbt5KOvV16r8CXF78NE/edit?tab=t.0#heading=h.camndhcqq8qn",
      icon: BookOpen,
      color: theme.secondary,
    },
    {
      title: "Report a Bug",
      description: "Found an issue? I'll fix it when I can!",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeneXyqmUHCqmQi9cmDh2wNOR1m62uBZCGFLc8eXmpYxmD0tQ/viewform?usp=header",
      icon: Bug,
      color: theme.error,
    },
    {
      title: "Feature Requests",
      description: "Have an idea? Share it here!",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdGSKv_9eoJW8cszuuF4az-Opm7XtOwievBlLQTQ-qh85Dgfg/viewform?usp=publish-editor",
      icon: Lightbulb,
      color: "#3b82f6",
    },
    {
      title: "Contributing Guidelines",
      description: "Want to contribute? Start here",
      url: "https://github.com/rdren0/witchesandsnitches/blob/main/CONTRIBUTING.md",
      icon: Code,
      color: theme.success,
    },
  ];

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: theme.background,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        <h1
          style={{
            color: theme.text,
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "12px",
          }}
        >
          Help & Resources
        </h1>
        <p
          style={{
            color: theme.textSecondary,
            fontSize: "18px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Everything you need to get the most out of Witches & Snitches
        </p>
      </div>

      <div
        className="help-resources-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                backgroundColor: theme.surface,
                border: `2px solid ${theme.border}`,
                borderRadius: "12px",
                padding: "24px 16px",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "12px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                gridColumn: index < 2 ? "span 3" : "span 2",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = resource.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: `${resource.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={30} color={resource.color} />
              </div>

              <div>
                <h3
                  style={{
                    color: theme.text,
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {resource.title}
                  <ExternalLink size={14} color={theme.textSecondary} />
                </h3>
                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {resource.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "64px",
          padding: "40px",
          backgroundColor: theme.surface,
          borderRadius: "12px",
          border: `2px solid ${theme.primary}`,
        }}
      >
        <h2
          style={{
            color: theme.text,
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          About This Website
        </h2>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            color: theme.text,
            fontSize: "17px",
            lineHeight: "1.8",
          }}
        >
          <p style={{ marginBottom: "16px" }}>
            I created this character management system as a personal project to
            enhance our Witches & Snitches campaigns. What started as a tool for
            myself grew into something I wanted to share with the entire
            community.
          </p>
          <p style={{ marginBottom: "16px" }}>
            I maintain and host this website independently, covering all
            development and server costs myself. <br /> It's a labor of love! I
            enjoy building tools that make our gaming sessions more fun and
            streamlined for everyone.
          </p>
          <p style={{ marginBottom: "24px", color: theme.textSecondary }}>
            If you encounter any issues or have suggestions for improvements,
            please use the bug report form above. <br />
            Since I work on this in my spare time, I'll address bugs and
            requests as I'm able to. <br />
            <br />I appreciate your patience and feedback!
          </p>
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              fontSize: "15px",
              color: theme.textSecondary,
            }}
          >
            Happy adventuring! <br />-{" "}
            <a
              href="https://discord.com/users/921467748729622599"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.primary,
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              r8chael
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .help-resources-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .help-resources-grid a {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 640px) {
          .help-resources-grid {
            grid-template-columns: 1fr !important;
          }
          .help-resources-grid a {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HelpResources;
