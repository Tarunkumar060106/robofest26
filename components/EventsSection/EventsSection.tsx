"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./EventsSection.css";

const EVENTS = [
  {
    number: "01",
    title: "Robo War",
    tag: "Combat",
    description:
      "Arena combat robotics. Build your bot, outmaneuver opponents, and survive the final clash.",
    prize: "₹1,25,000",
    fee: "₹2,000",
    venue: "Sports Hanger",
    team: "4 members",
    color: "#b83224",
    backgroundImage: "/images/events/war.jpg",
  },
  {
    number: "02",
    title: "Robo Soccer 1v1",
    tag: "Battle",
    description:
      "One robot, one opponent, one goal. Head-to-head robotic football with pure control and aggression.",
    prize: "₹30,000",
    fee: "₹500",
    venue: "Tech Arena",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/soccer.jpg",
  },
  {
    number: "03",
    title: "Robo Soccer 2v2",
    tag: "Battle",
    description:
      "Team strategy meets machine control. Coordinate two bots and dominate the robotic pitch.",
    prize: "₹40,000",
    fee: "₹800",
    venue: "Main Hall",
    team: "4 members",
    color: "#c4410c",
  },
  {
    number: "04",
    title: "Robo Sumo",
    tag: "Combat",
    description:
      "Push or be pushed. Enter the ring and force your rival out to claim victory.",
    prize: "₹25,000",
    fee: "₹600",
    venue: "Lab 2",
    team: "2 members",
    color: "#2a2018",
    backgroundImage: "/images/events/sumo.png",
  },
  {
    number: "05",
    title: "OBS Race",
    tag: "Speed",
    description:
      "Race through obstacles at full throttle. Precision handling and speed decide the winner.",
    prize: "₹50,000",
    fee: "₹1,000",
    venue: "Expo Hall",
    team: "2 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
  },
  {
    number: "06",
    title: "Drone Race",
    tag: "Speed",
    description:
      "High-speed aerial racing through technical gates. Reflexes, stability, and control are everything.",
    prize: "₹20,000",
    fee: "₹400",
    venue: "Race Track",
    team: "2 members",
    color: "#1a1612",
    backgroundImage: "/images/events/drone.jpg",
  },
  {
    number: "07",
    title: "LFR",
    tag: "Precision",
    description:
      "Line Follower Robot challenge. Build the fastest bot that can track the path without error.",
    prize: "₹15,000",
    fee: "₹300",
    venue: "Lab 1",
    team: "2 members",
    color: "#c4410c",
    backgroundImage: "/images/events/lfr.jpg",
  },
  {
    number: "08",
    title: "Project Expo",
    tag: "Open",
    description:
      "Showcase your engineering ideas and prototypes to judges, peers, and industry visitors.",
    prize: "₹50,000",
    fee: "₹1,000",
    venue: "Expo Hall",
    team: "5 members",
    color: "#2a2018",
  },
  {
    number: "09",
    title: "Boat Race",
    tag: "Speed",
    description:
      "Design and build a high-performance water bot that can race through the course with speed and stability.",
    prize: "₹25,000",
    fee: "₹500",
    venue: "Water Arena",
    team: "3 members",
    color: "#b83224",
    backgroundImage: "/images/events/obs.png",
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
export default function EventsSection({ state = "live" }: EventsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isLive = state === "live";

  // ── GSAP entrance ──
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const eyebrow = eyebrowRef.current;
    if (!section || !heading || !eyebrow) return;
    const shouldReduceMotion = window.matchMedia(
      "(max-width: 1024px), (prefers-reduced-motion: reduce)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger, SplitText);
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

      if (shouldReduceMotion) {
        gsap.fromTo(
          heading,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 74%" },
          },
        );
      } else {
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
      }

      const panels = section.querySelectorAll(".acc-panel, .ev-cs-panel");
      gsap.fromTo(
        panels,
        { autoAlpha: 0, y: 28, scaleY: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          duration: shouldReduceMotion ? 0.35 : 0.55,
          ease: "power3.out",
          stagger: shouldReduceMotion ? 0 : 0.055,
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
            Choose your
            <br />
            <em>challenge.</em>
          </h2>
        </div>
        <div className="events-header-right">
          <p className="events-sub">
            {/* Nine arenas. One campus. */}
            <br />
            {isLive ? "Click any panel to explore." : "Lineup dropping soon."}
          </p>
          <div className="events-total-prize">
            <span className="events-prize-label">Total Prize Pool</span>
            <span className="events-prize-amount">
              {isLive ? (
                <>
                  ₹7,00,000<span>+</span>
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
                style={
                  {
                    "--acc-color": ev.color,
                    "--acc-bg-image": ev.backgroundImage
                      ? `url("${ev.backgroundImage}")`
                      : "none",
                    "--acc-overlay-opacity": ev.backgroundImage ? 0.34 : 0,
                  } as React.CSSProperties
                }
                onClick={() => handlePanelClick(i)}
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

                    <a
                      href="https://registration.isdlabsrm.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acc-register-btn"
                    >
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
}
