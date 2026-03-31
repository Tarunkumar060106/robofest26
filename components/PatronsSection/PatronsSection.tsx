"use client";

import { useEffect, useRef, useState } from "react";
const ADVISORY_COMMITTEE = [
  "Dr. Advisory One",
  "Dr. Advisory Two",
  "Dr. Advisory Three",
  "Dr. Advisory Four",
];

const KEY_ORGANISERS = [
  "Mr. Organiser Alpha",
  "Ms. Organiser Beta",
  "Mr. Organiser Gamma",
  "Ms. Organiser Delta",
];
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./PatronsSection.module.css";

const TIERS = [
  {
    label: "Title",
    tier: "01",
    patrons: ["SRM Institute of Science and Technology"],
    isBig: true,
  },
  {
    label: "Gold",
    tier: "02",
    patrons: ["Patron Alpha", "Patron Beta", "Patron Gamma"],
    isBig: false,
  },
  {
    label: "Silver",
    tier: "03",
    patrons: ["Silver One", "Silver Two", "Silver Three", "Silver Four"],
    isBig: false,
  },
  {
    label: "Associate",
    tier: "04",
    patrons: [
      "Assoc. One",
      "Assoc. Two",
      "Assoc. Three",
      "Assoc. Four",
      "Assoc. Five",
    ],
    isBig: false,
  },
];

import { forwardRef } from "react";

const PatronsSection = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const combinedRef = (node: HTMLElement | null) => {
    sectionRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      const eyebrow = el.querySelector<HTMLElement>(`.${styles.eyebrow}`);
      if (eyebrow) {
        gsap.from(eyebrow, {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: eyebrow, start: "top 88%" },
        });
      }

      const heading = el.querySelector<HTMLElement>(`.${styles.heading}`);
      if (heading) {
        const split = new SplitText(heading, { type: "lines" });
        gsap.from(split.lines, {
          autoAlpha: 0,
          y: 60,
          rotateX: 20,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 85%" },
          onComplete: () => split.revert(),
        });
      }

      const sub = el.querySelector<HTMLElement>(`.${styles.sub}`);
      if (sub) {
        gsap.from(sub, {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sub, start: "top 88%" },
        });
      }

      const tiers = el.querySelectorAll<HTMLElement>(`.${styles.tier}`);
      tiers.forEach((tier, i) => {
        gsap.from(tier, {
          autoAlpha: 0,
          x: -40,
          duration: 0.7,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: tier, start: "top 90%" },
        });
      });

      const cards = el.querySelectorAll<HTMLElement>(`.${styles.patronCard}`);
      gsap.from(cards, {
        autoAlpha: 0,
        y: 24,
        scale: 0.94,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.querySelector(`.${styles.tiers}`),
          start: "top 85%",
        },
      });

      const glow = el.querySelector<HTMLElement>(`.${styles.glow}`);
      if (glow) {
        gsap.to(glow, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <section ref={combinedRef} className={styles.section}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Committee</p>
          <h2 className={styles.heading}>Leadership & Institutional Support</h2>
        </div>
        <p className={styles.sub}>
          Robofest 2.0 is made possible by the support of SRMIST and the ISD
          Lab.
        </p>
      </div>

      {/* About SRM Card */}
      <div
        style={{
          maxWidth: 700,
          margin: "2rem auto 1.5rem auto",
          background: "#18181a",
          borderRadius: 18,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          padding: "2rem 2.5rem",
          color: "#e3e3db",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: 8 }}>About SRMIST</h3>
        <p style={{ fontSize: "1.08rem", lineHeight: 1.7 }}>
          SRM Institute of Science and Technology (SRMIST) is one of India's top
          universities, renowned for its excellence in education, research, and
          innovation.
        </p>
      </div>

      {/* About ISD Lab Card */}
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto 2.5rem auto",
          background: "#18181a",
          borderRadius: 18,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          padding: "2rem 2.5rem",
          color: "#e3e3db",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: 8 }}>About ISD Lab</h3>
        <p style={{ fontSize: "1.08rem", lineHeight: 1.7 }}>
          The Innovation and Systems Design (ISD) Lab at SRMIST fosters
          creativity, hands-on learning, and interdisciplinary research in
          robotics and automation.
        </p>
      </div>

      {/* Chancellor Card */}
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto 2.5rem auto",
          background: "#232327",
          borderRadius: 18,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
          padding: "2rem 2.5rem",
          color: "#f1f2f4",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="https://via.placeholder.com/110x110.png?text=Photo"
          alt="Chancellor"
          style={{
            borderRadius: "50%",
            width: 110,
            height: 110,
            marginBottom: 18,
            objectFit: "cover",
            border: "3px solid #dc493a",
          }}
        />
        <h4 style={{ fontSize: "1.25rem", margin: 0 }}>
          Shri T.R. Paarivendhar
        </h4>
        <p
          style={{ fontSize: "1.05rem", margin: "6px 0 0 0", color: "#dc493a" }}
        >
          Founder Chancellor, SRMIST
        </p>
      </div>

      {/* Three more cards under Chancellor */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          flexWrap: "wrap",
          margin: "0 auto 2.5rem auto",
          maxWidth: 1100,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#232327",
              borderRadius: 16,
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
              padding: "1.5rem 2rem",
              color: "#f1f2f4",
              textAlign: "center",
              width: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={`https://via.placeholder.com/90x90.png?text=Photo+${i}`}
              alt={`Committee Member ${i}`}
              style={{
                borderRadius: "50%",
                width: 90,
                height: 90,
                marginBottom: 14,
                objectFit: "cover",
                border: "2px solid #dc493a",
              }}
            />
            <h5
              style={{ fontSize: "1.12rem", margin: 0 }}
            >{`Dr. Committee Member ${i}`}</h5>
            <p
              style={{
                fontSize: "0.98rem",
                margin: "5px 0 0 0",
                color: "#dc493a",
              }}
            >
              Committee Role {i}
            </p>
          </div>
        ))}
      </div>

      {/* Accordions for committees */}
      <div style={{ maxWidth: 800, margin: "2.5rem auto 0 auto" }}>
        {/* Advisory Committee */}
        <div
          style={{
            marginBottom: "1.25rem",
            borderRadius: 12,
            background: "#18181a",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          }}
        >
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: "1.1rem 1.5rem",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              color: "#f1f2f4",
              outline: "none",
              borderBottom:
                openAccordion === "advisory"
                  ? "1px solid #dc493a"
                  : "1px solid #232327",
              borderRadius: 12,
              transition: "border-color 0.2s",
            }}
            aria-expanded={openAccordion === "advisory"}
            onClick={() => handleAccordion("advisory")}
          >
            Advisory Committee
          </button>
          {openAccordion === "advisory" && (
            <ul
              style={{
                padding: "0.8rem 2rem 1.2rem 2rem",
                margin: 0,
                color: "#e3e3db",
                listStyle: "disc inside",
              }}
            >
              {ADVISORY_COMMITTEE.map((name) => (
                <li key={name} style={{ marginBottom: 6 }}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Key Organisers */}
        <div
          style={{
            borderRadius: 12,
            background: "#18181a",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          }}
        >
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: "1.1rem 1.5rem",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              color: "#f1f2f4",
              outline: "none",
              borderBottom:
                openAccordion === "organisers"
                  ? "1px solid #dc493a"
                  : "1px solid #232327",
              borderRadius: 12,
              transition: "border-color 0.2s",
            }}
            aria-expanded={openAccordion === "organisers"}
            onClick={() => handleAccordion("organisers")}
          >
            Key Organisers
          </button>
          {openAccordion === "organisers" && (
            <ul
              style={{
                padding: "0.8rem 2rem 1.2rem 2rem",
                margin: 0,
                color: "#e3e3db",
                listStyle: "disc inside",
              }}
            >
              {KEY_ORGANISERS.map((name) => (
                <li key={name} style={{ marginBottom: 6 }}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
});
PatronsSection.displayName = "PatronsSection";
export default PatronsSection;
