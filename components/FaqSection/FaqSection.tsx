"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./FaqSection.module.css";

const FAQS = [
  {
    q: "What is Robofest?",
    a: "Robofest is SRMIST's flagship annual robotics competition and festival — bringing together students, engineers, and innovators to compete, build, and push the limits of autonomous machines.",
  },
  {
    q: "Who can participate?",
    a: "Anyone passionate about robotics — from school students to college teams. Teams of up to 4 members can register across multiple event categories.",
  },
  {
    q: "What events are part of Robofest 2.0?",
    a: "Robofest 2.0 features multiple events including line following, maze solving, sumo bots, freestyle robotics, and more. Full event details will be announced soon.",
  },
  {
    q: "How do I register?",
    a: "Registration will open shortly. Click the 'Register Now' button in the CTA bar or keep an eye on our official announcements for the registration link.",
  },
  {
    q: "What is the prize pool?",
    a: "Robofest 2.0 has a total prize pool of ₹2L+ across 15+ categories. Individual event prize breakdowns will be announced with the event schedule.",
  },
  {
    q: "Where is Robofest held?",
    a: "Robofest takes place at the SRM Institute of Science and Technology, Kattankulathur, Chennai. The event spans multiple arenas within the campus.",
  },
  {
    q: "Is accommodation provided?",
    a: "Outstation participants may avail campus accommodation at a nominal fee. Details will be shared upon registration confirmation.",
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    FAQS.forEach((_, i) => {
      const el = answerRefs.current[i];
      if (!el) return;
      const inner = el.querySelector<HTMLElement>(`.${styles.answerInner}`);
      if (!inner) return;
      if (i === openIdx) {
        gsap.to(el, {
          height: inner.scrollHeight,
          duration: 0.5,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, { height: 0, duration: 0.4, ease: "power3.inOut" });
      }
    });
  }, [openIdx]);

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

      const badge = el.querySelector<HTMLElement>(`.${styles.countBadge}`);
      if (badge) {
        gsap.from(badge, {
          autoAlpha: 0,
          scale: 0.88,
          duration: 0.55,
          delay: 0.3,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: badge, start: "top 88%" },
        });
      }

      const items = el.querySelectorAll<HTMLElement>(`.${styles.item}`);
      gsap.from(items, {
        autoAlpha: 0,
        x: 40,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.querySelector(`.${styles.list}`),
          start: "top 85%",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.grain} aria-hidden />

      <div className={styles.layout}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>FAQ</p>
          <h2 className={styles.heading}>
            Got
            <br />
            <em>questions?</em>
          </h2>
          <p className={styles.sub}>
            Everything you need to know before you show up and compete.
          </p>
          <div className={styles.countBadge}>
            <span className={styles.countNum}>{FAQS.length}</span>
            <span className={styles.countLabel}>
              questions
              <br />
              answered
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`${styles.item}${openIdx === i ? ` ${styles.itemOpen}` : ""}`}
            >
              <button
                className={styles.question}
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
              >
                <span className={styles.qText}>{faq.q}</span>
                <span className={styles.icon} aria-hidden />
              </button>
              <div
                className={styles.answer}
                ref={(el) => {
                  answerRefs.current[i] = el;
                }}
              >
                <div className={styles.answerInner}>
                  <p className={styles.aText}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
