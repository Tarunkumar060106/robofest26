"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
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
    textLight: true,
  },
];

export default function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

      const panels = section.querySelectorAll(".acc-panel");
      gsap.fromTo(
        panels,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 60%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section ref={sectionRef} className="events-section">
      <div className="events-grain" aria-hidden />

      {/* Header */}
      <div className="events-header">
        <span ref={eyebrowRef} className="events-eyebrow">
          Robofest 2.0 — Events
        </span>
        <h2 ref={headingRef} className="events-heading">
          Pick your
          <br />
          <em>arena.</em>
        </h2>
        <p className="events-sub">Eight events. Click one to open it up.</p>
      </div>

      {/* Accordion */}
      <div className="acc-track">
        {EVENTS.map((ev, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={ev.number}
              className={`acc-panel ${isActive ? "is-active" : ""}`}
              style={{ "--acc-color": ev.color } as React.CSSProperties}
              onClick={() => handleClick(i)}
            >
              {/* Collapsed label — always visible */}
              <div className="acc-label">
                <span className="acc-num">{ev.number}</span>
                <span className="acc-title-vert">{ev.title}</span>
                <span className="acc-tag-vert">{ev.tag}</span>
              </div>

              {/* Expanded content */}
              <div className="acc-content">
                <div className="acc-content-inner">
                  <div className="acc-top">
                    <span className="acc-tag-expanded">{ev.tag}</span>
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
                    <div className="acc-detail-row">
                      <span className="acc-detail-key">Prize Pool</span>
                      <span className="acc-detail-val">{ev.prize}</span>
                    </div>
                    <div className="acc-detail-row">
                      <span className="acc-detail-key">Entry Fee</span>
                      <span className="acc-detail-val">{ev.fee}</span>
                    </div>
                    <div className="acc-detail-row">
                      <span className="acc-detail-key">Venue</span>
                      <span className="acc-detail-val">{ev.venue}</span>
                    </div>
                    <div className="acc-detail-row">
                      <span className="acc-detail-key">Team Size</span>
                      <span className="acc-detail-val">{ev.team}</span>
                    </div>
                  </div>

                  <a href="#" className="acc-register-btn">
                    Register Now →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
