"use client";

import { useEffect, useRef } from "react";
import { forwardRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./PatronsSection.module.css";

// ── Data ─────────────────────────────────────────────────────────────────────

const PATRON_LEAD = {
  name: "Shri T.R. Paarivendhar",
  position: "Founder Chancellor, SRMIST",
  img: "/images/committee/founder-chancellor.jpg",
};

const PATRONS_ROW = [
  {
    name: "Dr. P. Ravi Pachamuthoo",
    position: "Pro Chancellor (Admin), SRMIST",
    img: "/images/committee/pro-chancellor-admin-sir.webp",
  },
  {
    name: "Dr. P. Sathyanarayanan",
    position: "Pro Chancellor (Academics), SRMIST",
    img: "/images/committee/pro-chancellor-acad-sir.webp",
  },
  {
    name: "Dr. R. Shivakumar",
    position: "Chairman, SRMIST",
    img: "/images/committee/chairman-sir.webp",
  },
];

const ADVISORY = [
  {
    name: "Dr. C. Muthamizhchelvan",
    position: "Vice Chancellor, SRMIST",
    img: "/images/committee/vice-chancellor.webp",
  },
  {
    name: "Dr. S. Ponnusamy",
    position: "Registrar, SRMIST",
    img: "/images/committee/registrar-sir.webp",
  },
  {
    name: "Dr. Bernaurdshaw Neppolian",
    position: "Dean (Research), SRMIST",
    img: "/images/committee/dean-research.jpg",
  },
  {
    name: "Dr. Leenus Jesu Martin M",
    position: "Dean, Faculty of Engineering & Technology",
    img: "/images/committee/leenus-sir.webp",
  },
  {
    name: "Dr. S S Sridhar",
    position: "Professor & Associate Dean (Academics - CET)",
    img: "/images/committee/sridhar-sir.webp",
  },
  {
    name: "Dr. Revathi Venkatraman",
    position: "Professor & Chair Person, SRMIST",
    img: "/images/committee/revathi-mam.webp",
  },
  {
    name: "Dr. M Pushpalatha",
    position: "Professor & Associate Chair Person, SRMIST",
    img: "/images/committee/pushpalatha-mam.webp",
  },
  {
    name: "Dr. G. Niranjana",
    position: "Professor & HOD, CTech, SRMIST",
    img: "/images/committee/hod-mam.png",
  },
];

const CONVENERS = [
  {
    title: "Convener",
    name: "Dr. Poovammal E",
    position: "Professor and Director (Hostels)",
    img: "/images/committee/poovammal-mam.webp",
  },
  {
    title: "Convener",
    name: "Dr. R. Mohana Krishnan",
    position: "Director of Sports, SRMIST",
    img: "/images/committee/directorsports.jpeg",
  },
];

const KEY_ORGANISERS = [
  {
    title: "Co-Convener",
    name: "Dr. Sowmiya B",
    position: "Assistant Professor, SRMIST",
    img: "/images/committee/sowmiya-mam.jpg",
  },
  {
    title: "Co-Convener",
    name: "Dr. Ida Seraphim",
    position: "Assistant Professor, SRMIST",
    img: "/images/committee/ida-mam.jpeg",
  },
  {
    title: "Organizing Secretary",
    name: "Dr. Aswathy K Cherian",
    position: "Assistant Professor, SRMIST",
    img: "/images/committee/aswathy-mam.jpg",
  },
  {
    title: "Organizing Secretary",
    name: "Dr. Vidhyalakshmi M K",
    position: "Assistant Professor, SRMIST",
    img: "/images/committee/vidhyalakshmi-mam.png",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PersonCard({
  name,
  position,
  img,
  title,
  size = "md",
  highlight = false,
}: {
  name: string;
  position: string;
  img: string;
  title?: string;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}) {
  const imgSize = size === "lg" ? 120 : size === "md" ? 96 : 80;

  return (
    <div
      className={`${styles.personCard} ${styles[`card--${size}`]} ${highlight ? styles.paarivendharGlow : ""}`}
    >
      <div className={styles.personImgWrap}>
        <Image
          src={img}
          alt={name}
          width={imgSize}
          height={imgSize}
          className={styles.personImg}
        />
      </div>
      {title && <span className={styles.cardTitle}>{title}</span>}
      <p className={styles.personName}>{name}</p>
      <p className={styles.personPosition}>{position}</p>
    </div>
  );
}

function SectionBlock({
  label,
  index,
  children,
}: {
  label: string;
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <span className={styles.blockIndex}>{index}</span>
        <h3 className={styles.blockLabel}>{label}</h3>
        <div className={styles.blockRule} />
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

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

      const blocks = el.querySelectorAll<HTMLElement>(`.${styles.block}`);
      blocks.forEach((block) => {
        gsap.from(block, {
          autoAlpha: 0,
          y: 40,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 88%" },
        });
      });

      const cardGroups = el.querySelectorAll<HTMLElement>(
        `.${styles.cardGrid}`,
      );
      cardGroups.forEach((grid) => {
        const cards = grid.querySelectorAll<HTMLElement>(
          `.${styles.personCard}`,
        );
        gsap.from(cards, {
          autoAlpha: 0,
          y: 28,
          scale: 0.95,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 88%" },
        });
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

  return (
    <section ref={combinedRef} className={styles.section}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.glow} aria-hidden />

      {/* Header */}
      <div className={styles.headerRow}>
        <p className={styles.eyebrow}>Committee</p>
        <h2 className={styles.heading}>
          Leadership &amp;
          <br />
          <em>Institutional Support</em>
        </h2>
        <p className={styles.sub}>
          Robofest 2.0 is shaped by the vision of SRMIST leadership and driven
          by the hands-on dedication of the ISD Lab.
        </p>
      </div>

      <div className={styles.content}>
        {/* ── 01 Patrons ── */}
        <SectionBlock label="Patrons" index="01">
          {/* Lead patron — centered on top */}
          <div className={styles.leadRow}>
            <PersonCard {...PATRON_LEAD} size="lg" highlight />
          </div>
          {/* Remaining 3 underneath */}
          <div className={`${styles.cardGrid} ${styles.grid3}`}>
            {PATRONS_ROW.map((p) => (
              <PersonCard key={p.name} {...p} size="md" />
            ))}
          </div>
        </SectionBlock>

        {/* ── 02 Advisory Committee ── */}
        <SectionBlock label="Advisory Committee" index="02">
          <div className={`${styles.cardGrid} ${styles.grid3}`}>
            {ADVISORY.map((p) => (
              <PersonCard key={p.name} {...p} size="md" />
            ))}
          </div>
        </SectionBlock>

        {/* ── 03 Key Organisers ── */}
        <SectionBlock label="Key Organisers" index="03">
          <div className={styles.leadRow}>
            {CONVENERS.map((person) => (
              <PersonCard key={person.name} {...person} size="lg" />
            ))}
          </div>
          <div className={`${styles.cardGrid} ${styles.grid3}`}>
            {KEY_ORGANISERS.map((p) => (
              <PersonCard key={p.name} {...p} size="md" />
            ))}
          </div>
        </SectionBlock>
      </div>
    </section>
  );
});

PatronsSection.displayName = "PatronsSection";
export default PatronsSection;
