"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "./styles.css";

const ScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        x: "-300vw", // ✅ use x instead of translateX
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`, // ✅ FIXED
          scrub: true,
          pin: true,
          anticipatePin: 1,
          markers: true, // 👈 enable to debug
        },
      });
    });

    ScrollTrigger.refresh(); // ✅ ensure ScrollTrigger calculates positions

    return () => ctx.revert();
  }, []);

  return (
    <section className="scroll-section-outer">
      <div ref={sectionRef} className="scroll-section-inner">
        <div className="scroll-section">
          <h3>Section 1</h3>
        </div>
        <div className="scroll-section">
          <h3>Section 2</h3>
        </div>
        <div className="scroll-section">
          <h3>Section 3</h3>
        </div>
        <div className="scroll-section">
          <h3>Section 4</h3>
        </div>
      </div>
    </section>
  );
};

export default ScrollSection;
