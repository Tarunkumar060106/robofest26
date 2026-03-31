"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ⏱ Smart timer (only updates when needed)
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setDays("00");
        setHours("00");
        setMinutes("00");
        setSeconds("00");
        return;
      }

      const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0",
      );

      const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0",
      );

      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");

      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      // Only update if changed
      setSeconds((prev) => (prev !== s ? s : prev));
      setMinutes((prev) => (prev !== m ? m : prev));
      setHours((prev) => (prev !== h ? h : prev));
      setDays((prev) => (prev !== d ? d : prev));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // 🎨 Canvas Grid Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d")!;
    let offset = 0;
    const size = 40;

    const resize = () => {
      canvas.width = section.clientWidth;
      canvas.height = section.clientHeight;
    };

    const draw = () => {
      ctx.fillStyle = "#9f0000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.2)";

      for (let x = -size + (offset % size); x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = -size + (offset % size); y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      offset += 0.4;
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section ref={sectionRef} className="countdown">
      <canvas ref={canvasRef} className="bg" />

      <p className="heading">THE FESTIVAL STARTS IN</p>

      <div className="timerGrid">
        <div className="numberCell">
          <DigitGroup value={days} />
        </div>
        <div className="colonCell">
          <Colon />
        </div>
        <div className="numberCell">
          <DigitGroup value={hours} />
        </div>
        <div className="colonCell">
          <Colon />
        </div>
        <div className="numberCell">
          <DigitGroup value={minutes} />
        </div>
        <div className="colonCell">
          <Colon />
        </div>
        <div className="numberCell">
          <DigitGroup value={seconds} />
        </div>

        <span className="labelCell labelDays">Days</span>
        <span className="labelCell labelHours">Hours</span>
        <span className="labelCell labelMinutes">Minutes</span>
        <span className="labelCell labelSeconds">Seconds</span>
      </div>

      <button className="calendarCta">Add to Calendar →</button>

      <style jsx>{`
        .countdown {
          position: relative;
          height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .heading {
          position: absolute;
          top: 2rem;
          z-index: 1;
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .timerGrid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: max-content max-content max-content max-content max-content max-content max-content;
          grid-template-rows: auto auto;
          align-items: end;
          justify-items: center;
          justify-content: center;
          column-gap: 0.06em;
          row-gap: 0.9rem;
        }

        .numberCell {
          font-size: clamp(4rem, 16vw, 20rem);
          line-height: 1;
          font-weight: 800;
          color: white;
          letter-spacing: -0.05em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .colonCell {
          font-size: clamp(4rem, 16vw, 20rem);
          line-height: 1;
          font-weight: 800;
          color: white;
          letter-spacing: -0.05em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .numbers {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.06em;
          font-size: clamp(4rem, 16vw, 20rem);
          line-height: 1;
          font-weight: 800;
          color: white;
          letter-spacing: -0.05em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .group {
          display: flex;
          gap: 0.02em;
        }

        .digit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 0.62em;
          height: 1em;
          overflow: hidden;
          text-align: center;
        }

        .digitInner {
          display: inline-block;
          will-change: transform, opacity, filter;
        }

        .colon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 0.28em;
          opacity: 0.8;
        }

        .labelCell {
          font-size: clamp(0.72rem, 1.1vw, 1rem);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          color: white;
        }

        .labelDays {
          grid-row: 2;
          grid-column: 1;
        }

        .labelHours {
          grid-row: 2;
          grid-column: 3;
        }

        .labelMinutes {
          grid-row: 2;
          grid-column: 5;
        }

        .labelSeconds {
          grid-row: 2;
          grid-column: 7;
        }

        .calendarCta {
          position: absolute;
          bottom: 1.5rem;
          z-index: 1;
          padding: 0.7rem 1.25rem;
          min-height: 44px;
          border-radius: 999px;
          border: 2px solid #111;
          background: #fff;
          color: #111;
          letter-spacing: 0.02em;
          font-weight: 600;
          font-size: 0.92rem;
          cursor: var(--cursor-pointer);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease;
        }

        .calendarCta:hover {
          transform: translateY(-1px);
          background: #111;
          color: #fff;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .calendarCta:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .calendarCta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .calendarCta {
            bottom: 1rem;
            padding: 0.62rem 1.05rem;
            font-size: 0.86rem;
          }
        }
      `}</style>
    </section>
  );
}

function DigitGroup({ value }: { value: string }) {
  return (
    <div className="group">
      {value.split("").map((d, i) => (
        <Digit key={i} digit={d} />
      ))}
    </div>
  );
}

function Digit({ digit }: { digit: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { yPercent: -115, opacity: 0, filter: "blur(8px)" },
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power3.out",
      },
    );
  }, [digit]);

  return (
    <span className="digit">
      <span ref={ref} className="digitInner">
        {digit}
      </span>
    </span>
  );
}

function Colon() {
  return <span className="colon">:</span>;
}
