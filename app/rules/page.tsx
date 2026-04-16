"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { FileText, Download } from "lucide-react";
import { DEFAULT_CMS_CONTENT, type RulesContent } from "@/lib/cmsContent";
import type { EventItem } from "@/lib/eventsData";

type EventRulebook = {
  id: string;
  event: string;
  category: string;
  pdfUrl: string;
};

const mapEventsToRulebooks = (events: EventItem[]): EventRulebook[] =>
  events.map((event) => ({
    id: event.number,
    event: event.title,
    category: event.tag,
    pdfUrl: "#",
  }));

const DEFAULT_EVENT_RULEBOOKS = mapEventsToRulebooks(DEFAULT_CMS_CONTENT.events);

const CATEGORY_COLORS: Record<string, { pill: string; dot: string }> = {
  Combat: { pill: "rgba(175,0,0,0.08)", dot: "#b83224" },
  Battle: { pill: "rgba(26,22,18,0.08)", dot: "#1a1612" },
  Speed: { pill: "rgba(5,150,105,0.1)", dot: "#059669" },
  Precision: { pill: "rgba(37,99,235,0.1)", dot: "#2563eb" },
  Open: { pill: "rgba(124,58,237,0.1)", dot: "#7c3aed" },
};

/* ─────────────────────────────────────────────
   Inline styles that mirror the patrons section
───────────────────────────────────────────────*/
const styles: Record<string, React.CSSProperties> = {
  /* Shell */
  section: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    padding: "8rem 6rem",
    background: "#f5f0e8",
    overflow: "hidden",
    color: "#1a1612",
    boxSizing: "border-box",
  },

  /* Grain overlay */
  grain: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.45,
  },

  /* Red radial glow */
  glow: {
    position: "absolute",
    top: "-200px",
    left: "-200px",
    width: "700px",
    height: "700px",
    background:
      "radial-gradient(circle, rgba(175,0,0,0.14) 0%, transparent 70%)",
    pointerEvents: "none",
    borderRadius: "50%",
    zIndex: 0,
  },

  /* Second glow (bottom-right accent) */
  glowRight: {
    position: "absolute",
    bottom: "-180px",
    right: "-180px",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(175,0,0,0.09) 0%, transparent 70%)",
    pointerEvents: "none",
    borderRadius: "50%",
    zIndex: 0,
  },

  /* Header block */
  headerRow: {
    position: "relative",
    zIndex: 1,
    maxWidth: "700px",
    marginBottom: "5rem",
  },

  eyebrow: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "rgba(26,22,18,0.65)",
    marginBottom: "1.2rem",
  },

  heading: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(42px, 5vw, 68px)",
    fontWeight: 300,
    letterSpacing: "-2.5px",
    lineHeight: 1.05,
    color: "#1a1612",
    marginBottom: "1.4rem",
  },

  headingEm: {
    fontStyle: "italic",
    color: "#b83224",
  },

  sub: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "rgba(26,22,18,0.65)",
    maxWidth: "440px",
  },

  /* Content wrapper */
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "5rem",
  },

  /* Section block */
  block: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2.5rem",
  },

  /* Block header row (index + label + rule) */
  blockHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
  },

  blockIndex: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    color: "rgba(175,0,0,0.8)",
    whiteSpace: "nowrap" as const,
  },

  blockLabel: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "rgba(26,22,18,0.72)",
    whiteSpace: "nowrap" as const,
  },

  blockRule: {
    flex: 1,
    height: "1px",
    background: "rgba(26,22,18,0.15)",
  },

  /* General rules grid */
  ruleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
  },

  ruleCard: {
    background: "rgba(255,255,255,0.46)",
    border: "1px solid rgba(26,22,18,0.16)",
    backdropFilter: "blur(10px) saturate(120%)",
    WebkitBackdropFilter: "blur(10px) saturate(120%)",
    borderRadius: "12px",
    padding: "2rem 1.8rem",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s ease, background 0.3s ease",
  },

  ruleCardBadge: {
    display: "inline-block",
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "rgba(175,0,0,0.85)",
    background: "rgba(175,0,0,0.08)",
    border: "1px solid rgba(175,0,0,0.22)",
    borderRadius: "2em",
    padding: "0.2em 0.75em",
    marginBottom: "0.8rem",
  },

  ruleCardTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "18px",
    fontWeight: 400,
    color: "#14110f",
    marginBottom: "0.6rem",
    lineHeight: 1.3,
  },

  ruleCardBody: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "13px",
    lineHeight: 1.75,
    color: "rgba(20,17,15,0.72)",
  },

  /* ── Event rulebook grid ── */
  ebGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.25rem",
  },

  ebCard: {
    background: "rgba(255,255,255,0.46)",
    border: "1px solid rgba(26,22,18,0.14)",
    backdropFilter: "blur(10px) saturate(120%)",
    WebkitBackdropFilter: "blur(10px) saturate(120%)",
    borderRadius: "12px",
    padding: "1.6rem 1.4rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.9rem",
    boxSizing: "border-box" as const,
    transition: "border-color 0.25s ease, background 0.25s ease, transform 0.2s ease",
    cursor: "default",
  },

  ebIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "rgba(175,0,0,0.08)",
    border: "1px solid rgba(175,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  ebEventName: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#14110f",
    lineHeight: 1.25,
    flex: 1,
  },

  ebCategoryPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    borderRadius: "2em",
    padding: "0.2em 0.65em",
    alignSelf: "flex-start" as const,
  },

  ebCategoryDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  ebDownloadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#b83224",
    textDecoration: "none",
    marginTop: "auto",
    paddingTop: "0.6rem",
    borderTop: "1px solid rgba(26,22,18,0.1)",
    transition: "opacity 0.2s ease",
  },

  ebComingSoon: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.56), rgba(255,255,255,0.38))",
    border: "1px solid rgba(26,22,18,0.14)",
    backdropFilter: "blur(10px) saturate(120%)",
    WebkitBackdropFilter: "blur(10px) saturate(120%)",
    borderRadius: "16px",
    padding: "2.2rem",
    display: "grid",
    gap: "0.9rem",
    alignItems: "start",
  },

  ebComingSoonBadge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "rgba(175,0,0,0.9)",
    background: "rgba(175,0,0,0.08)",
    border: "1px solid rgba(175,0,0,0.2)",
    borderRadius: "2em",
    padding: "0.25rem 0.75rem",
  },

  ebComingSoonTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(24px, 3vw, 34px)",
    fontWeight: 400,
    color: "#14110f",
    lineHeight: 1.15,
  },

  ebComingSoonText: {
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "rgba(20,17,15,0.72)",
    maxWidth: "56ch",
  },
};

export default function RulesPage() {
  const [rules, setRules] = useState<RulesContent>(DEFAULT_CMS_CONTENT.rules);
  const [eventRulebooks, setEventRulebooks] = useState<EventRulebook[]>(DEFAULT_EVENT_RULEBOOKS);

  useEffect(() => {
    let isMounted = true;
    const loadRules = async () => {
      try {
        const response = await fetch("/api/cms", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (isMounted && payload?.content?.rules) {
          setRules(payload.content.rules as RulesContent);
        }
        if (isMounted && Array.isArray(payload?.content?.events)) {
          setEventRulebooks(mapEventsToRulebooks(payload.content.events as EventItem[]));
        }
      } catch {
        // Keep defaults when API is unavailable.
      }
    };
    loadRules();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main style={styles.section}>
        {/* Atmosphere */}
        <div style={styles.grain} aria-hidden />
        <div style={styles.glow} aria-hidden />
        <div style={styles.glowRight} aria-hidden />

        {/* Page header */}
        <div style={styles.headerRow}>
          <p style={styles.eyebrow}>Event Guidelines</p>
          <h1 style={styles.heading}>
            {/* Split title: last word in italic red — adjust as needed */}
            {rules.pageTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <em style={styles.headingEm}>
              {rules.pageTitle.split(" ").slice(-1)[0]}
            </em>
          </h1>
          <p style={styles.sub}>
            Please read all guidelines carefully before registering.
          </p>
        </div>

        <div style={styles.content}>
          {/* ── 01 General Rules ── */}
          <div style={styles.block}>
            <div style={styles.blockHeader}>
              <span style={styles.blockIndex}>01</span>
              <span style={styles.blockLabel}>{rules.sectionTitle}</span>
              <div style={styles.blockRule} />
            </div>

            <div style={styles.ruleGrid}>
              {rules.generalRules.map((rule, i) => (
                <article
                  key={`${rule.title}-${i}`}
                  style={styles.ruleCard}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(175,0,0,0.45)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.64)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(26,22,18,0.16)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.46)";
                  }}
                >
                  <span style={styles.ruleCardBadge}>Rule {String(i + 1).padStart(2, "0")}</span>
                  <h3 style={styles.ruleCardTitle}>{rule.title}</h3>
                  <p style={styles.ruleCardBody}>{rule.content}</p>
                </article>
              ))}
            </div>
          </div>

          {/* ── 02 Event Rulebooks ── */}
          <div style={styles.block}>
            <div style={styles.blockHeader}>
              <span style={styles.blockIndex}>02</span>
              <span style={styles.blockLabel}>Event Rulebooks</span>
              <div style={styles.blockRule} />
            </div>

            {rules.eventRulebooksState === "coming-soon" ? (
              <div style={styles.ebComingSoon}>
                <span style={styles.ebComingSoonBadge}>Coming Soon</span>
                <h3 style={styles.ebComingSoonTitle}>Rulebooks are being prepared.</h3>
                <p style={styles.ebComingSoonText}>
                  Event details are already available, but the downloadable rulebooks are still
                  being finalized. Check back soon for the full set of manuals and PDF links.
                </p>
              </div>
            ) : (
              <div style={styles.ebGrid}>
                {eventRulebooks.map((eb) => {
                  const colors = CATEGORY_COLORS[eb.category] ?? CATEGORY_COLORS.Combat;
                  return (
                    <div
                      key={eb.id}
                      style={styles.ebCard}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(175,0,0,0.4)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.64)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,22,18,0.14)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.46)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      <div style={styles.ebIconWrap}>
                        <FileText size={18} color="#b83224" strokeWidth={1.6} />
                      </div>

                      <p style={styles.ebEventName}>{eb.event}</p>

                      <span
                        style={{
                          ...styles.ebCategoryPill,
                          background: colors.pill,
                          color: colors.dot,
                        }}
                      >
                        <span style={{ ...styles.ebCategoryDot, background: colors.dot }} />
                        {eb.category}
                      </span>

                      <a
                        href={eb.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.ebDownloadBtn}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.65")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                      >
                        <Download size={12} strokeWidth={2} />
                        Download PDF
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}