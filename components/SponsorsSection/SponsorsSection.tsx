"use client";

import { useRef, useEffect, useState } from "react";
import { DEFAULT_CMS_CONTENT, type SponsorsContent } from "@/lib/cmsContent";
import "./SponsorsSection.css";

type SponsorsSectionState = "live" | "coming-soon";
interface SponsorsSectionProps {
  state?: SponsorsSectionState;
}

const DEFAULT_SPONSORS = DEFAULT_CMS_CONTENT.sponsors;

function SponsorLogo({ name }: { name: string }) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shapes = [
    <polygon
      key="hex"
      points="24,4 44,14 44,34 24,44 4,34 4,14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />,
    <>
      <circle
        key="ci"
        cx="24"
        cy="24"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polygon
        key="tri"
        points="24,12 36,32 12,32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>,
    <polygon
      key="dia"
      points="24,4 44,24 24,44 4,24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />,
    <>
      <circle
        key="ci2"
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        key="vl"
        x1="24"
        y1="6"
        x2="24"
        y2="42"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        key="hl"
        x1="6"
        y1="24"
        x2="42"
        y2="24"
        stroke="currentColor"
        strokeWidth="2"
      />
    </>,
    <polygon
      key="star"
      points="24,4 28,18 44,18 32,28 36,44 24,34 12,44 16,28 4,18 20,18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />,
  ];
  return (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      xmlns="http://www.w3.org/2000/svg"
    >
      {shapes[hash % shapes.length]}
    </svg>
  );
}

function SponsorCard({ name }: { name: string }) {
  return (
    <div className="sponsor-card">
      <div className="sponsor-card-logo">
        <SponsorLogo name={name} />
      </div>
      <p className="sponsor-card-name">{name}</p>
    </div>
  );
}

function MarqueeRow({
  sponsors,
  direction = "left",
  speed = 36,
}: {
  sponsors: { name: string }[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const doubled = [...sponsors, ...sponsors];
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const UNIT = (220 + 16) * sponsors.length;

  useEffect(() => {
    const dir = direction === "left" ? -1 : 1;
    const tick = (ts: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      if (!paused) {
        posRef.current += dir * speed * dt;
        if (posRef.current <= -UNIT) posRef.current += UNIT;
        if (posRef.current >= 0) posRef.current -= UNIT;
        if (trackRef.current)
          trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [paused, direction, speed, UNIT]);

  return (
    <div
      className="sponsors-marquee-row"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="sponsors-marquee-track">
        {doubled.map((s, i) => (
          <SponsorCard key={i} name={s.name} />
        ))}
      </div>
    </div>
  );
}

function ComingSoonIdle({ ctaText, ctaUrl }: { ctaText: string; ctaUrl: string }) {
  return (
    <div className="sponsors-idle-wrap">
      {/* Blurred ghost grid behind */}
      <div className="sponsors-idle-rows" aria-hidden>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="sponsors-idle-ghost-row">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="sponsors-idle-ghost-card" />
            ))}
          </div>
        ))}
      </div>

      {/* Frosted glass overlay card */}
      <div className="sponsors-idle-overlay">
        <div className="sponsors-idle-badge">
          <span className="sponsors-idle-dot" />
          Announcements incoming
        </div>
        <h3 className="sponsors-idle-heading">
          Sponsors <em>coming soon.</em>
        </h3>
        <p className="sponsors-idle-sub">
          We&apos;re finalising our partner lineup.
          <br />
          Check back closer to the event.
        </p>
        <a href={ctaUrl} className="sponsors-cta-btn">
          {ctaText} <span className="sponsors-cta-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

export default function SponsorsSection({
  state = "live",
}: SponsorsSectionProps) {
  const [content, setContent] = useState<SponsorsContent>(DEFAULT_SPONSORS);
  const [cmsState, setCmsState] = useState<SponsorsSectionState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSponsors = async () => {
      try {
        const response = await fetch("/api/cms", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();

        if (isMounted && payload?.content?.sponsors) {
          setContent(payload.content.sponsors as SponsorsContent);
        }

        if (
          isMounted &&
          (payload?.content?.siteSettings?.sponsorsState === "live" ||
            payload?.content?.siteSettings?.sponsorsState === "coming-soon")
        ) {
          setCmsState(payload.content.siteSettings.sponsorsState);
        }
      } catch {
        // Keep defaults when API is unavailable.
      }
    };

    loadSponsors();
    return () => {
      isMounted = false;
    };
  }, []);

  const isLive = (cmsState ?? state) === "live";
  const sponsorsRow1 = content.row1.map((name) => ({ name }));
  const sponsorsRow2 = content.row2.map((name) => ({ name }));

  return (
    <section className="sponsors-section">
      <div className="sponsors-grid-bg" />

      <div className="sponsors-header">
        <p className="sponsors-eyebrow">{content.eyebrow}</p>
        <h2 className="sponsors-heading">
          {content.headingPrefix} <em>{content.headingEmphasis}</em>
        </h2>
        <p className="sponsors-subtext">{content.subtext}</p>
      </div>

      {isLive && (
        <>
          <div className="sponsors-band">
            <MarqueeRow sponsors={sponsorsRow1} direction="left" speed={40} />
            <MarqueeRow sponsors={sponsorsRow2} direction="right" speed={32} />
          </div>
          <div className="sponsors-fade" />
          <div className="sponsors-cta-wrap">
            <a href={content.ctaUrl} className="sponsors-cta-btn">
              {content.ctaText} <span className="sponsors-cta-arrow">→</span>
            </a>
            <a
              href={content.brochureUrl}
              className="sponsors-cta-btn sponsors-cta-btn--secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.brochureText} <span className="sponsors-cta-arrow">↗</span>
            </a>
            <a
              href={`mailto:${content.contactEmail}`}
              className="sponsors-contact-link"
            >
              {content.contactEmail}
            </a>
          </div>
        </>
      )}

      {!isLive && <ComingSoonIdle ctaText={content.ctaText} ctaUrl={content.ctaUrl} />}
    </section>
  );
}
