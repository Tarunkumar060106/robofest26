"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./ContactSection.module.css";

const INFO = [
  { icon: "📍", label: "Location", value: "SRMIST, Kattankulathur, Chennai" },
  { icon: "✉️", label: "Email", value: "isdlab@srmist.edu.in" },
  // { icon: "📞", label: "Phone", value: "+91 44 2745 2270" },
  { icon: "📅", label: "Event Date", value: "August 19, 2026" },
];

import { forwardRef } from "react";

const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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
          y: 70,
          rotateX: 22,
          duration: 1,
          stagger: 0.12,
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
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sub, start: "top 88%" },
        });
      }

      const cards = el.querySelectorAll<HTMLElement>(`.${styles.infoCard}`);
      gsap.from(cards, {
        autoAlpha: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.querySelector(`.${styles.infoCards}`),
          start: "top 85%",
        },
      });

      const fields = el.querySelectorAll<HTMLElement>(
        `.${styles.field}, .${styles.row}`,
      );
      gsap.from(fields, {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.querySelector(`.${styles.form}`),
          start: "top 85%",
        },
      });

      const btn = el.querySelector<HTMLElement>(`.${styles.submitBtn}`);
      if (btn) {
        gsap.from(btn, {
          autoAlpha: 0,
          y: 20,
          scale: 0.92,
          duration: 0.6,
          delay: 0.4,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: btn, start: "top 90%" },
        });
      }

      const glow = el.querySelector<HTMLElement>(`.${styles.glow}`);
      if (glow) {
        gsap.to(glow, {
          yPercent: -30,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section ref={combinedRef} className={styles.section}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.layout}>
        {/* Left */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>Contact</p>
          <h2 className={styles.heading}>
            Let&apos;s
            <br />
            <em>talk.</em>
          </h2>
          <p className={styles.sub}>
            Have questions about events, registration, or sponsorships?
            We&apos;re here to help.
          </p>

          <div className={styles.infoCards}>
            {INFO.map((item) => (
              <a key={item.label} href="#" className={styles.infoCard}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div>
                  <p className={styles.infoLabel}>{item.label}</p>
                  <p className={styles.infoValue}>{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className={styles.formWrap}>
          {submitted ? (
            <div className={`${styles.success} ${styles.successVisible}`}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Message sent!</h3>
              <p className={styles.successSub}>
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>First name</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="John"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last name</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subject</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Event registration query"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea
                  className={styles.textarea}
                  rows={5}
                  placeholder="Tell us what you'd like to know..."
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send message"}
                {!loading && <span className={styles.arrow}>→</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});
ContactSection.displayName = "ContactSection";
export default ContactSection;
