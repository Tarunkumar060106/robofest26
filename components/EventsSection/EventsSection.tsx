"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./EventsSection.css";

const EVENTS = [
  {
    number: "01",
    title: "Robo Wars",
    tag: "Combat",
    description:
      "Ultimate combat robotics. Build your destroyer and enter the arena. Engineer the perfect killing machine and watch it dominate.",
    prize: "₹1,25,000",
    fee: "₹2,000",
    venue: "Sports Hanger",
    team: "4 members",
    color: "#b83224",
  },
  {
    number: "02",
    title: "Line Follower",
    tag: "Autonomous",
    description:
      "Precision autonomous navigation. Your bot, your algorithm, one line. The fastest and most accurate bot takes it all.",
    prize: "₹30,000",
    fee: "₹500",
    venue: "Tech Arena",
    team: "3 members",
    color: "#1a1612",
  },
  {
    number: "03",
    title: "Sumo Bot",
    tag: "Combat",
    description:
      "Push or be pushed. The ring is small. The fight is everything. Last bot standing wins.",
    prize: "₹40,000",
    fee: "₹800",
    venue: "Main Hall",
    team: "2 members",
    color: "#c4410c",
  },
  {
    number: "04",
    title: "Maze Solver",
    tag: "Autonomous",
    description:
      "Navigate the unknown. Code that thinks. Robots that find the way through every twist and dead end.",
    prize: "₹25,000",
    fee: "₹600",
    venue: "Lab 2",
    team: "3 members",
    color: "#2a2018",
  },
  {
    number: "05",
    title: "Innovation",
    tag: "Open",
    description:
      "No rulebook. Pure ingenuity. Show the world what you've built from scratch with nothing but your imagination.",
    prize: "₹50,000",
    fee: "₹1,000",
    venue: "Expo Hall",
    team: "5 members",
    color: "#b83224",
  },
  {
    number: "06",
    title: "Robo Race",
    tag: "Speed",
    description:
      "Fastest robot wins. Tune it, push it, break the track record. Speed is the only metric that matters here.",
    prize: "₹20,000",
    fee: "₹400",
    venue: "Race Track",
    team: "2 members",
    color: "#1a1612",
  },
  {
    number: "07",
    title: "Pick & Place",
    tag: "Precision",
    description:
      "Surgical accuracy. Robotic arms that move with intention and place with millimetre perfection.",
    prize: "₹15,000",
    fee: "₹300",
    venue: "Lab 1",
    team: "2 members",
    color: "#c4410c",
  },
  {
    number: "08",
    title: "Workshop",
    tag: "Learn",
    description:
      "Hands-on sessions with industry experts. Build, break, learn. Walk out knowing more than you walked in with.",
    prize: "Certificate",
    fee: "₹200",
    venue: "Workshop Room",
    team: "Solo",
    color: "#2a2018",
  },
  {
    number: "09",
    title: "Workshop",
    tag: "Learn",
    description:
      "Hands-on sessions with industry experts. Build, break, learn. Walk out knowing more than you walked in with.",
    prize: "Certificate",
    fee: "₹200",
    venue: "Workshop Room",
    team: "Solo",
    color: "#b83224",
  },
];

type EventsSectionState = "live" | "coming-soon";

interface EventsSectionProps {
  state?: EventsSectionState;
}

// ── Coming soon ghost panels ──────────────────────────────
function ComingSoonState() {
  return (
    <div className="ev-cs-wrap">
      {/* Ghost accordion behind */}
      <div className="ev-cs-track" aria-hidden>
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className="ev-cs-panel"
            style={{ "--acc-color": ev.color } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Frosted overlay */}
      <div className="ev-cs-overlay">
        <div className="ev-cs-badge">
          <span className="ev-cs-dot" />
          Lineup dropping soon
        </div>
        <h3 className="ev-cs-heading">
          Events <em>coming soon.</em>
        </h3>
        <p className="ev-cs-sub">
          Nine arenas. One campus.
          <br />
          The full lineup will be announced closer to the event.
        </p>
        <a href="#" className="ev-cs-btn">
          Get Notified <span>→</span>
        </a>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────
const EventsSection = forwardRef<HTMLElement, EventsSectionProps>(
  ({ state = "live" }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const sectionRef = (ref as React.RefObject<HTMLElement>) || internalRef;
    const headingRef = useRef<HTMLHeadingElement>(null);
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const isLive = state === "live";

  // ── GSAP entrance ──
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const eyebrow = eyebrowRef.current;
    if (!section || !heading || !eyebrow) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        eyebrow,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        },
      );

      const split = new SplitText(heading, { type: "lines,words" });
      gsap.set(split.words, { autoAlpha: 0, yPercent: 100 });
      gsap.to(split.words, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.055,
        scrollTrigger: { trigger: section, start: "top 72%" },
      });

      const panels = section.querySelectorAll(".acc-panel, .ev-cs-panel");
      gsap.fromTo(
        panels,
        { autoAlpha: 0, y: 28, scaleY: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.055,
          scrollTrigger: { trigger: section, start: "top 62%" },
        },
      );

      if (!isLive) {
        const overlay = section.querySelector(".ev-cs-overlay");
        gsap.fromTo(
          overlay,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.4,
            scrollTrigger: { trigger: section, start: "top 62%" },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isLive]);

  // ── Panel hover micro-interaction via GSAP ──
  const handlePanelEnter = (i: number, el: HTMLElement) => {
    if (activeIndex === i) return;
    setHoveredIndex(i);
    gsap.to(el, { y: -4, duration: 0.3, ease: "power2.out" });
    // subtle glow via box-shadow
    el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.28)";
  };

  const handlePanelLeave = (i: number, el: HTMLElement) => {
    setHoveredIndex(null);
    gsap.to(el, { y: 0, duration: 0.35, ease: "power2.out" });
    el.style.boxShadow = "";
  };

  // ── Panel open — number count-up ──
  const handlePanelClick = (i: number) => {
    const next = activeIndex === i ? null : i;
    setActiveIndex(next);

    if (next !== null) {
      // animate the expanded number ticking up
      const numEl = document.querySelector(`.acc-num-expanded-${i}`);
      if (numEl) {
        const target = parseInt(EVENTS[i].number);
        let current = 0;
        const tick = setInterval(() => {
          current++;
          numEl.textContent = String(current).padStart(2, "0");
          if (current >= target) clearInterval(tick);
        }, 60);
      }
    }
  };

  return (
    <section ref={sectionRef} className="events-section">
      <div className="events-grain" aria-hidden />

      {/* Header */}
      <div className="events-header-row">
        <div className="events-header-left">
          <span ref={eyebrowRef} className="events-eyebrow">
            Robofest 2.0 — Events
          </span>
          <h2 ref={headingRef} className="events-heading">
            Pick your
            <br />
            <em>arena.</em>
          </h2>
        </div>
        <div className="events-header-right">
          <p className="events-sub">
            Nine arenas. One campus.
            <br />
            {isLive ? "Click any panel to explore." : "Lineup dropping soon."}
          </p>
          <div className="events-total-prize">
            <span className="events-prize-label">Total Prize Pool</span>
            <span className="events-prize-amount">
              {isLive ? (
                <>
                  ₹3,25,000<span>+</span>
                </>
              ) : (
                <span>Coming Soon</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Live accordion */}
      {isLive && (
        <div className="acc-track">
          {EVENTS.map((ev, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={ev.number}
                className={`acc-panel ${isActive ? "is-active" : ""}`}
                style={{ "--acc-color": ev.color } as React.CSSProperties}
                onClick={() => handlePanelClick(i)}
                onMouseEnter={(e) => handlePanelEnter(i, e.currentTarget)}
                onMouseLeave={(e) => handlePanelLeave(i, e.currentTarget)}
              >
                {/* Collapsed label */}
                <div className="acc-label">
                  <span className="acc-num">{ev.number}</span>
                  <span className="acc-title-vert">{ev.title}</span>
                  <span className="acc-tag-vert">{ev.tag}</span>
                </div>

                {/* Expanded content */}
                <div className="acc-content">
                  <div className="acc-content-inner">
                    <div className="acc-top">
                      <div className="acc-top-left">
                        <span
                          className={`acc-num-expanded acc-num-expanded-${i}`}
                        >
                          {ev.number}
                        </span>
                        <span className="acc-tag-expanded acc-tag-pill">
                          {ev.tag}
                        </span>
                      </div>
                      <button
                        className="acc-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(null);
                        }}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <h3 className="acc-title-big">{ev.title}</h3>
                    <p className="acc-desc">{ev.description}</p>

                    <div className="acc-details">
                      {[
                        ["Prize Pool", ev.prize],
                        ["Entry Fee", ev.fee],
                        ["Venue", ev.venue],
                        ["Team Size", ev.team],
                      ].map(([k, v]) => (
                        <div key={k} className="acc-detail-row">
                          <span className="acc-detail-key">{k}</span>
                          <span className="acc-detail-val">{v}</span>
                        </div>
                      ))}
                    </div>

                    <a href="#" className="acc-register-btn">
                      Register Now →
                    </a>
                  </div>
                </div>

                {/* Hover shimmer layer */}
                <div className="acc-shimmer" aria-hidden />
              </div>
            );
          })}
        </div>
      )}

      {/* Coming soon */}
      {!isLive && <ComingSoonState />}
    </section>
  );
});

export default EventsSection;
