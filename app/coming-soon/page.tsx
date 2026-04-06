"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import "./ComingSoon.css";
import Navbar from "@/components/Navbar/Navbar";
const EVENT_DATE = new Date("2026-08-19T00:10:00+05:30");
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
  const diff = Math.max(0, EVENT_DATE.getTime() - now.getTime());
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

export default function ComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [time, setTime] = useState(getTimeLeft());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Particle field
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

      // Connection lines
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

      // Dots
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

  // GSAP entrance
  useEffect(() => {
    gsap.registerPlugin(SplitText);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Eyebrow
      tl.fromTo(
        ".cs-eyebrow",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        0.3,
      );

      // Heading words
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

      // Sub
      tl.fromTo(
        subRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        1.0,
      );

      // Countdown tiles
      tl.fromTo(
        ".cs-tile",
        { autoAlpha: 0, y: 32, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
        1.1,
      );

      // Form
      tl.fromTo(
        ".cs-form-wrap",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        1.4,
      );

      // Bottom row
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
        {/* Particle canvas */}
        <canvas ref={canvasRef} className="cs-canvas" aria-hidden />

        {/* Radial glow */}
        <div className="cs-glow" aria-hidden />

        {/* Grid texture */}
        <div className="cs-grid" aria-hidden />

        {/* Content */}
        <div className="cs-content">
          {/* Top bar */}
          <div className="cs-topbar"></div>

          {/* Hero text */}
          <div className="cs-hero">
            {/* <span className="cs-eyebrow">SRMIST's Flagship Robotics Event</span> */}

            <h1 ref={headingRef} className="cs-heading">
              Something
              <br />
              <em>massive</em>
              <br />
              is coming.
            </h1>

            <p ref={subRef} className="cs-sub">
              Robofest 2.0 is loading. The biggest student robotics
              <br />
              event in South India returns — bigger, bolder, louder.
            </p>
          </div>

          {/* Countdown */}
          <div className="cs-countdown">
            {TILES.map((t, i) => (
              <div key={t.label} className="cs-tile">
                <span className="cs-tile-val">{t.value}</span>
                <span className="cs-tile-label">{t.label}</span>
                {i < TILES.length - 1 && <span className="cs-tile-sep">:</span>}
              </div>
            ))}
          </div>

          {/* Notify form */}
          <div className="cs-form-wrap">
            {!submitted ? (
              <form className="cs-form" onSubmit={handleSubmit}>
                <input
                  className="cs-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="cs-submit" type="submit">
                  Notify Me →
                </button>
              </form>
            ) : (
              <div className="cs-success">
                <span className="cs-success-dot" />
                You're on the list. We'll be in touch.
              </div>
            )}
            <p className="cs-form-note">
              Be the first to know when registration opens.
            </p>
          </div>

          {/* Bottom row */}
          <div className="cs-bottom">
            <span className="cs-bottom-text">
              © 2026 SRMIST Robofest. All rights reserved.
            </span>
            <div className="cs-socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="cs-social-link"
                  target={social.href === "#" ? undefined : "_blank"}
                  rel={social.href === "#" ? undefined : "noopener noreferrer"}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Big watermark */}
        <div className="cs-watermark" aria-hidden>
          2.0
        </div>
      </div>
    </>
  );
}
