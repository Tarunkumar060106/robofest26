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

  const eventTitle = "Robofest 2026";
  const eventLocation = "SRM Institute of Science and Technology, Kattankulathur";
  const eventDescription =
    "Robofest 2026 at SRMIST. Visit the official website for event details and registration.";

  const buildCalendarUrl = () => {
    const base = "https://calendar.google.com/calendar/render";

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "ROBOFEST 2.0",
      dates: "20260819T090000Z/20260821T180000Z",
      details: "Robofest 2.0 at SRMIST. Join us!",
      location: "SRM Institute of Science and Technology",
    });

    return `${base}?${params.toString()}`;
  };

  const handleAddToCalendar = () => {
    window.open(buildCalendarUrl(), "_blank", "noopener,noreferrer");
  };

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

      <button className="calendarCta" type="button" onClick={handleAddToCalendar}>
        <span className="googleIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
            <path
              fill="#4285F4"
              d="M23.64 12.2045c0-.8182-.0736-1.6045-.2109-2.3591H12v4.4636h6.5455c-.2818 1.5227-1.1409 2.8136-2.4318 3.6772v3.0545h3.9409c2.3045-2.1227 3.5854-5.2454 3.5854-8.8362z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.9563-1.0727 7.9418-2.9091l-3.9409-3.0545c-1.0727.7181-2.4454 1.1454-4.0009 1.1454-3.0727 0-5.6772-2.0727-6.6045-4.8636H1.3272v3.15C3.3018 21.3954 7.3109 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.3954 14.3182C5.159 13.6 5.0227 12.8363 5.0227 12c0-.8363.1363-1.6.3727-2.3182V6.5318H1.3272C.4909 8.1909 0 10.0454 0 12s.4909 3.8091 1.3272 5.4682l4.0682-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.7727c1.7636 0 3.3409.6091 4.5863 1.8045l3.4363-3.4363C17.9509 1.1909 15.24 0 12 0 7.3109 0 3.3018 2.6045 1.3272 6.5318l4.0682 3.15c.9273-2.7909 3.5318-4.9091 6.6045-4.9091z"
            />
          </svg>
        </span>
        <span>Add to Calendar</span>
      </button>

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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.1rem;
        }

        .numberCell {
          font-size: clamp(2.5rem, 12vw, 8rem);
          line-height: 1;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          background: rgba(0, 0, 0, 0.35);
          border-radius: 16px;
          padding: 0.15em 0.25em;
          min-width: 1.8em;
          text-align: center;
        }

        .colonCell {
          font-size: clamp(2rem, 10vw, 6rem);
          line-height: 1;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          padding: 0 0.05em;
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
          display: none;
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
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
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

        .googleIcon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.1rem;
          height: 1.1rem;
          flex: 0 0 auto;
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
          .countdown {
            height: auto;
            min-height: 50vh;
            padding: 3rem 0.5rem 3.5rem;
          }

          .heading {
            top: 1rem;
            font-size: 0.6rem;
            letter-spacing: 0.12em;
          }

          .timerGrid {
            gap: 0.1rem;
          }

          .numberCell {
            font-size: clamp(2rem, 11vw, 3.5rem);
            min-width: 1.6em;
            padding: 0.12em 0.2em;
          }

          .colonCell {
            font-size: clamp(1.8rem, 9vw, 3rem);
          }

          .calendarCta {
            position: relative;
            bottom: auto;
            margin-top: 1.5rem;
            padding: 0.65rem 1.3rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .countdown {
            height: auto;
            min-height: 45vh;
            padding: 2.5rem 0.5rem 3rem;
          }

          .heading {
            top: 0.75rem;
            font-size: 0.52rem;
            letter-spacing: 0.14em;
          }

          .timerGrid {
            gap: 0.05rem;
          }

          .numberCell {
            font-size: clamp(1.4rem, 9vw, 2.2rem);
            min-width: 1.4em;
            border-radius: 10px;
            padding: 0.1em 0.15em;
          }

          .colonCell {
            font-size: clamp(1.2rem, 7vw, 1.8rem);
          }

          .colon {
            opacity: 0.6;
          }

          .labelCell {
            display: none;
          }

          .calendarCta {
            margin-top: 1.2rem;
            padding: 0.55rem 1.1rem;
            font-size: 0.8rem;
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
