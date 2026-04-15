"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import "../coming-soon/ComingSoon.css";
import Navbar from "@/components/Navbar/Navbar";

const SPONSOR_REVEAL_DATE = new Date("2026-08-19T00:00:00+05:30");
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/robofest.srm",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/isd-lab-srm",
  },
];

function getTimeLeft() {
  const now = new Date();
  const diff = Math.max(0, SPONSOR_REVEAL_DATE.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function SponsorsComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [time, setTime] = useState(getTimeLeft());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLE_COUNT = 72;
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    };

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.012,
      }),
    );

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(220,73,58,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,73,58,${a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".cs-eyebrow",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        0.3,
      );

      if (headingRef.current) {
        const split = new SplitText(headingRef.current, {
          type: "lines,words",
        });
        gsap.set(split.words, { autoAlpha: 0, yPercent: 110, rotateX: 20 });
        tl.to(
          split.words,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.07,
          },
          0.5,
        );
      }

      tl.fromTo(
        subRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        1.0,
      );

      tl.fromTo(
        ".cs-tile",
        { autoAlpha: 0, y: 32, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
        1.1,
      );

      tl.fromTo(
        ".cs-form-wrap",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        1.4,
      );

      tl.fromTo(
        ".cs-bottom",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        1.6,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const TILES = [
    { label: "Days", value: pad(time.days) },
    { label: "Hours", value: pad(time.hours) },
    { label: "Minutes", value: pad(time.minutes) },
    { label: "Seconds", value: pad(time.seconds) },
  ];

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="cs-root">
        <canvas ref={canvasRef} className="cs-canvas" aria-hidden />
        <div className="cs-glow" aria-hidden />
        <div className="cs-grid" aria-hidden />

        <div className="cs-content">
          <div className="cs-topbar"></div>

          <div className="cs-hero">
            <span className="cs-eyebrow">Sponsorship Opportunities</span>

            <h1 ref={headingRef} className="cs-heading">
              Sponsors
              <br />
              <em>lineup</em>
              <br />
              drops soon.
            </h1>

            <p ref={subRef} className="cs-sub">
              We are curating sponsor partnerships for Robofest 2.0.
              <br />
              Brand visibility, campus reach, and national robotics talent all
              in one stage.
            </p>
          </div>

          <div className="cs-countdown">
            {TILES.map((t, i) => (
              <div key={t.label} className="cs-tile">
                <span className="cs-tile-val">{t.value}</span>
                <span className="cs-tile-label">{t.label}</span>
                {i < TILES.length - 1 && <span className="cs-tile-sep">:</span>}
              </div>
            ))}
          </div>

          <div className="cs-form-wrap">
            {!submitted ? (
              <form className="cs-form" onSubmit={handleSubmit}>
                <input
                  className="cs-input"
                  type="email"
                  placeholder="brand@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="cs-submit" type="submit">
                  <span>Partner With Us</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <div className="cs-success">
                <span className="cs-success-dot" />
                Thanks. Our sponsorship team will reach out.
              </div>
            )}
            <p className="cs-form-note">
              Get the sponsorship deck and priority partner updates.
            </p>
          </div>

          <div className="cs-bottom">
            <span className="cs-bottom-text">
              © 2026 Robofest. All rights reserved.
            </span>
            <div className="cs-socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="cs-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-watermark" aria-hidden>
          SP
        </div>
      </div>
    </>
  );
}
