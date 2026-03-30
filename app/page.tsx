"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountdownTimer from "@/components/CountdownTimer";
import Navbar from "@/components/Navbar/Navbar";
import Lenis from "lenis";
import Script from "next/script";
import HScrollSection from "@/components/HScrollSection/HScrollSection";
import ScrollSection from "@/components/HScrollSection/HScrollSection";

const EVENT_DATE = new Date("2026-08-19T00:10:00+05:30");
const PRELOADER_FRAMES = [
  "camo.png",
  "leather.png",
  "redtech.png",
  "reptile.png",
  "final.png",
];
const PRELOADER_MIN_DURATION_MS = 4200;
const PRELOADER_TICK_MS = 90;
const PRELOADER_EXIT_DELAY_MS = 360;

function getDaysLeft() {
  const now = new Date();
  const diffMs = EVENT_DATE.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

function getLoadingText(progress: number) {
  if (progress < 100) {
    return "Loading Robofest 2.0";
  }

  return "Launch ready";
}

export default function Home() {
  const [daysLeft, setDaysLeft] = useState<number>(getDaysLeft());
  const [scrollThumbHeight, setScrollThumbHeight] = useState(80);
  const [scrollThumbTop, setScrollThumbTop] = useState(0);
  const [preloaderFrame, setPreloaderFrame] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(1);
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ctaBarRef = useRef<HTMLDivElement | null>(null);
  const ctaInnerRef = useRef<HTMLDivElement | null>(null);
  const ctaAnimateRef = useRef<(compact: boolean) => void>(() => undefined);
  const ctaSetHiddenRef = useRef<(hidden: boolean) => void>(() => undefined);
  const menuOpenRef = useRef(false);
  const isCtaCompactRef = useRef(false);
  const isCtaHiddenRef = useRef(false);
  const ctaExpandedWidthRef = useRef(0);
  const isScrollSectionPinnedRef = useRef(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const sectionFourRef = useRef<HTMLElement | null>(null);
  const scrollSectionRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDaysLeft(getDaysLeft());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
    });

    // 🔥 IMPORTANT: Sync Lenis with GSAP ticker
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 🔥 CRITICAL: Tell ScrollTrigger how to read scroll
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        } else {
          return window.scrollY;
        }
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // keep ScrollTrigger in sync
    lenis.on("scroll", ScrollTrigger.update);

    // 🔥 VERY IMPORTANT: refresh AFTER everything is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let isCancelled = false;
    let completedTasks = 0;
    const totalTasks = PRELOADER_FRAMES.length + 1;
    let currentSequenceRatio = 0;
    let assetsReady = false;
    let sequenceDone = false;
    let finishTimeoutId: number | null = null;

    const preloadedImages: HTMLImageElement[] = [];

    const updateProgress = () => {
      const assetRatio = completedTasks / totalTasks;
      const blendedRatio = assetRatio * 0.7 + currentSequenceRatio * 0.3;
      const nextProgress = Math.min(99, Math.floor(blendedRatio * 100));

      setLoadingProgress((previousProgress) =>
        Math.max(previousProgress, nextProgress),
      );
    };

    const tryFinishPreloader = () => {
      if (!assetsReady || !sequenceDone || isCancelled) {
        return;
      }

      setLoadingProgress(100);
      finishTimeoutId = window.setTimeout(() => {
        setIsPreloaderDone(true);
      }, PRELOADER_EXIT_DELAY_MS);
    };

    const markTaskComplete = () => {
      if (isCancelled) {
        return;
      }

      completedTasks = Math.min(totalTasks, completedTasks + 1);
      updateProgress();

      if (completedTasks >= totalTasks) {
        assetsReady = true;
        tryFinishPreloader();
      }
    };

    PRELOADER_FRAMES.forEach((frameName) => {
      const image = new Image();
      const handleImageSettled = () => {
        image.removeEventListener("load", handleImageSettled);
        image.removeEventListener("error", handleImageSettled);
        markTaskComplete();
      };

      image.addEventListener("load", handleImageSettled);
      image.addEventListener("error", handleImageSettled);
      image.src = `/images/preloader/${frameName}`;
      preloadedImages.push(image);
    });

    const handleWindowLoaded = () => {
      markTaskComplete();
    };

    if (document.readyState === "complete") {
      handleWindowLoaded();
    } else {
      window.addEventListener("load", handleWindowLoaded, { once: true });
    }

    const sequenceStartTime = performance.now();
    const sequenceIntervalId = window.setInterval(() => {
      const elapsedTime = performance.now() - sequenceStartTime;
      currentSequenceRatio = Math.min(
        elapsedTime / PRELOADER_MIN_DURATION_MS,
        1,
      );

      const frameIndex = Math.min(
        Math.floor(currentSequenceRatio * PRELOADER_FRAMES.length),
        PRELOADER_FRAMES.length - 1,
      );

      setPreloaderFrame(frameIndex);
      updateProgress();

      if (currentSequenceRatio >= 1) {
        window.clearInterval(sequenceIntervalId);
        sequenceDone = true;
        tryFinishPreloader();
      }
    }, PRELOADER_TICK_MS);

    return () => {
      isCancelled = true;
      document.body.style.overflow = previousOverflow;

      window.clearInterval(sequenceIntervalId);
      if (finishTimeoutId !== null) {
        window.clearTimeout(finishTimeoutId);
      }

      window.removeEventListener("load", handleWindowLoaded);

      preloadedImages.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  useEffect(() => {
    if (!isPreloaderDone) {
      return;
    }

    document.body.style.overflow = "";
    const revealTimeout = window.setTimeout(() => {
      setIsHeroRevealed(true);
    }, 50);

    return () => window.clearTimeout(revealTimeout);
  }, [isPreloaderDone]);

  useEffect(() => {
    const isProbeInsideSection = (
      sectionEl: HTMLElement | null,
      probeY: number,
    ) => {
      // Data for horizontal slides
      const robofestSlides = [
        {
          title: "👣 Footfall",
          stat: "Over 5,000+ attendees",
          desc: "Robofest 2025 saw record-breaking participation and energy from students, mentors, and visitors.",
          img: "/images/hero-svgs/footfall.svg",
          imgAlt: "Footfall",
        },
        {
          title: "🤖 Teams",
          stat: "120+ teams from 30+ schools",
          desc: "Young innovators from across the region competed in a variety of robotics challenges.",
          img: "/images/hero-svgs/teams.svg",
          imgAlt: "Teams",
        },
        {
          title: "🏆 Awards",
          stat: "15+ categories recognized",
          desc: "Celebrating creativity, teamwork, and technical excellence in robotics and automation.",
          img: "/images/hero-svgs/awards.svg",
          imgAlt: "Awards",
        },
      ];

      menuOpenRef.current = false;
    };
  }, []);

  useEffect(() => {
    const ctaBarEl = ctaBarRef.current;
    const ctaInnerEl = ctaInnerRef.current;
    if (!ctaBarEl || !ctaInnerEl) {
      return;
    }

    const ctaContentEls = Array.from(
      ctaInnerEl.querySelectorAll<HTMLElement>("[data-cta-content]"),
    );
    const expandedWidth = ctaInnerEl.getBoundingClientRect().width;
    ctaExpandedWidthRef.current = expandedWidth;

    gsap.set(ctaInnerEl, { width: expandedWidth, overflow: "hidden" });
    gsap.set(ctaContentEls, { autoAlpha: 1, x: 0, y: 0 });

    ctaSetHiddenRef.current = (hidden: boolean) => {
      if (hidden === isCtaHiddenRef.current) {
        return;
      }

      isCtaHiddenRef.current = hidden;
      ctaBarEl.classList.toggle("is-hidden", hidden);
    };

    ctaAnimateRef.current = (compact: boolean) => {
      if (compact === isCtaCompactRef.current) {
        return;
      }

      isCtaCompactRef.current = compact;
      const targetWidth = compact ? 86 : ctaExpandedWidthRef.current;

      gsap.killTweensOf(ctaInnerEl);
      gsap.killTweensOf(ctaContentEls);

      if (compact) {
        gsap.to(ctaInnerEl, {
          width: targetWidth,
          duration: 0.42,
          ease: "power2.inOut",
        });

        // Keep content visible through most of collapse, then fade near the end.
        gsap.to(ctaContentEls, {
          autoAlpha: 0,
          duration: 0.24,
          delay: 0.38,
          ease: "power1.out",
          // stagger: 0.015,
        });

        return;
      }

      const openTl = gsap.timeline();

      openTl.to(ctaInnerEl, {
        width: targetWidth,
        duration: 0.64,
        ease: "power3.out",
      });

      openTl.fromTo(
        ctaContentEls,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power3.out",
          stagger: 0.025,
          clearProps: "y",
        },
        "-=0.2",
      );
    };

    const syncExpandedWidth = () => {
      if (isCtaCompactRef.current) {
        return;
      }

      ctaExpandedWidthRef.current = ctaInnerEl.scrollWidth;
      gsap.set(ctaInnerEl, { width: ctaExpandedWidthRef.current });
    };

    const heroBottom =
      heroSectionRef.current?.offsetHeight ?? window.innerHeight;
    ctaAnimateRef.current(window.scrollY >= heroBottom);

    const initialProbeY = window.scrollY + window.innerHeight * 0.5;
    ctaSetHiddenRef.current(
      initialProbeY >=
        (footerRef.current?.offsetTop ?? Number.POSITIVE_INFINITY),
    );

    window.addEventListener("resize", syncExpandedWidth);

    return () => {
      ctaAnimateRef.current = () => undefined;
      ctaSetHiddenRef.current = () => undefined;
      window.removeEventListener("resize", syncExpandedWidth);
      gsap.killTweensOf(ctaInnerEl);
      gsap.killTweensOf(ctaContentEls);
    };
  }, []);

  useEffect(() => {
    const isProbeInsideSection = (
      sectionEl: HTMLElement | null,
      probeY: number,
    ) => {
      if (!sectionEl) return false;
      const sectionTop = sectionEl.offsetTop;
      const sectionBottom = sectionTop + sectionEl.offsetHeight;
      return probeY >= sectionTop && probeY < sectionBottom;
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const probeY = scrollTop + window.innerHeight * 0.5;

      // 👇 If scroll section is pinned, it controls the CTA — don't touch it
      if (!isScrollSectionPinnedRef.current) {
        const shouldCloseCta =
          menuOpenRef.current ||
          isProbeInsideSection(sectionFourRef.current, probeY);
        ctaAnimateRef.current(shouldCloseCta);

        const shouldHideCta = isProbeInsideSection(footerRef.current, probeY);
        ctaSetHiddenRef.current(shouldHideCta);
      }

      // Scrollbar thumb — always update regardless
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const trackHeight =
        trackRef.current?.clientHeight ?? window.innerHeight * 0.36;
      const thumbHeight = Math.min(56, trackHeight * 0.4);

      if (docHeight > 0) {
        const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        const thumbTop = progress * maxThumbTop;
        setScrollThumbHeight(thumbHeight);
        setScrollThumbTop(thumbTop);
      } else {
        setScrollThumbHeight(thumbHeight);
        setScrollThumbTop(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isPreloaderDone) {
      return;
    }

    const footerEl = footerRef.current;
    if (!footerEl) {
      return;
    }

    const headingParts = Array.from(
      footerEl.querySelectorAll<HTMLElement>("[data-footer-heading-part]"),
    );
    const columns = Array.from(
      footerEl.querySelectorAll<HTMLElement>("[data-footer-col]"),
    );
    const links = Array.from(
      footerEl.querySelectorAll<HTMLElement>("[data-footer-link]"),
    );
    const bottomRowItems = Array.from(
      footerEl.querySelectorAll<HTMLElement>("[data-footer-bottom]"),
    );
    const glowOrb = footerEl.querySelector<HTMLElement>("[data-footer-glow]");
    const topButton = footerEl.querySelector<HTMLElement>("[data-footer-top]");

    const ctx = gsap.context(() => {
      gsap.set(headingParts, { autoAlpha: 0, y: 80, rotateX: 35 });
      gsap.set(columns, { autoAlpha: 0, y: 50 });
      gsap.set(links, { autoAlpha: 0, x: -18 });
      gsap.set(bottomRowItems, { autoAlpha: 0, y: 24 });
      gsap.set(topButton, {
        autoAlpha: 0,
        y: 24,
        scale: 0.86,
        transformOrigin: "50% 50%",
      });

      if (glowOrb) {
        gsap.set(glowOrb, { autoAlpha: 0.45, scale: 0.9, xPercent: -5 });
      }

      const revealTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: footerEl,
          start: "top 80%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      revealTl
        .to(headingParts, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
        })
        .to(
          columns,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.12,
          },
          "-=0.65",
        )
        .to(
          links,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
          },
          "-=0.5",
        )
        .to(
          bottomRowItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .to(
          topButton,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            ease: "back.out(1.8)",
          },
          "-=0.4",
        );

      if (glowOrb) {
        gsap.to(glowOrb, {
          xPercent: 12,
          yPercent: -10,
          scale: 1.18,
          ease: "none",
          scrollTrigger: {
            trigger: footerEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (topButton) {
        const handleMouseEnter = () => {
          gsap.to(topButton, {
            y: -4,
            scale: 1.06,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(topButton, {
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        };

        topButton.addEventListener("mouseenter", handleMouseEnter);
        topButton.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          topButton.removeEventListener("mouseenter", handleMouseEnter);
          topButton.removeEventListener("mouseleave", handleMouseLeave);
        };
      }

      return undefined;
    }, footerEl);

    return () => {
      ctx.revert();
    };
  }, [isPreloaderDone]);

  const loadingText = getLoadingText(loadingProgress);

  useEffect(() => {
    if (!scrollSectionRef.current || !triggerRef.current) return;
    if (!isPreloaderDone) return; // 👈 add this guard

    // Small delay to let layout paint after preloader exits
    const timeout = setTimeout(() => {
      const scrollDistance =
        scrollSectionRef.current!.scrollWidth - window.innerWidth;

      const anim = gsap.to(scrollSectionRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            isScrollSectionPinnedRef.current = true;
            ctaAnimateRef.current(true); // 👈 collapse to compact pill
          },
          onLeave: () => {
            isScrollSectionPinnedRef.current = false;
            ctaAnimateRef.current(false); // 👈 expand back
          },
          onEnterBack: () => {
            isScrollSectionPinnedRef.current = true;
            ctaAnimateRef.current(true); // 👈 collapse again
          },
          onLeaveBack: () => {
            isScrollSectionPinnedRef.current = false;
            ctaAnimateRef.current(false); // 👈 expand back
          },
        },
      });

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    }, 200); // 👈 wait for paint

    return () => clearTimeout(timeout);
  }, [isPreloaderDone]);

  return (
    <>
      {isHeroRevealed ? (
        <Script
          id="hero-sample-animation"
          src="/scripts/hero.js"
          strategy="afterInteractive"
          type="module"
        />
      ) : null}

      <div
        className={`site-preloader ${isPreloaderDone ? "is-hidden" : ""}`}
        aria-hidden={isPreloaderDone}
      >
        <div className="site-preloader-content">
          <img
            src={`/images/preloader/${PRELOADER_FRAMES[preloaderFrame]}`}
            alt="Robofest preloader"
            className="site-preloader-image"
            draggable={false}
          />

          <div className="site-preloader-meta">
            <p className="site-preloader-text">{loadingText}</p>
            <p className="site-preloader-counter">{loadingProgress}%</p>
            <div className="site-preloader-progress-track" aria-hidden>
              <div
                className="site-preloader-progress-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Navbar />

      <div className={`site-shell ${isPreloaderDone ? "is-ready" : ""}`}>
        {/* CTA Bar */}
        <div ref={ctaBarRef} className="cta-bar">
          <div ref={ctaInnerRef} className="cta-bar-inner">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="n_logo"
            >
              <g transform="translate(4.2 4.2) scale(0.76)">
                <path
                  d="M15.7182 35.8708C15.6731 35.7998 15.5644 35.2766 15.4767 34.7081C15.1965 32.8919 15.1257 32.5405 15.0313 32.4952C14.9826 32.4719 14.7041 32.4086 14.4123 32.3545C13.6831 32.2193 12.6093 31.861 11.7331 31.4604C11.2308 31.2307 10.9773 31.1425 10.9299 31.1807C10.8918 31.2115 10.5855 31.589 10.2492 32.0195C9.36463 33.1519 9.08475 33.4737 8.9845 33.4737C8.93562 33.4737 8.32426 33.0667 7.62594 32.5694C6.92762 32.072 6.13965 31.5152 5.8749 31.3321C5.22156 30.8802 5.21057 30.8682 5.29202 30.6941C5.32873 30.6156 5.60805 30.1689 5.91273 29.7015C6.2174 29.2341 6.55439 28.696 6.66159 28.5058L6.85649 28.16L6.30185 27.4715C5.66801 26.6846 5.01185 25.7563 4.69061 25.1919C4.56945 24.979 4.44642 24.7905 4.41723 24.7729C4.38803 24.7553 3.93261 24.8811 3.40518 25.0524C2.87776 25.2238 2.25422 25.4167 2.01955 25.4812C1.61982 25.591 1.58553 25.5924 1.47667 25.5026C1.34419 25.3933 0.0437998 21.6913 0.0715217 21.5024C0.0925991 21.3587 0.306684 21.256 1.3389 20.8944C2.45315 20.5039 2.57807 20.4463 2.61712 20.3045C2.67026 20.1116 2.6564 16.114 2.6023 16.0309C2.57567 15.99 2.02566 15.7995 1.38007 15.6075C0.246132 15.2702 -4.83978e-05 15.1638 -4.83978e-05 15.0107C-4.83978e-05 14.9711 0.157177 14.439 0.349342 13.8282C0.541507 13.2174 0.813397 12.3457 0.953541 11.891C1.10651 11.3947 1.24764 11.0404 1.30665 11.0043C1.3808 10.9591 1.71396 11.026 2.66242 11.2764C3.35402 11.4591 3.96519 11.6205 4.02058 11.6351C4.09536 11.6549 4.1659 11.576 4.29473 11.3285C4.52844 10.8794 5.44191 9.51073 6.16487 8.52632C6.48955 8.08421 6.77485 7.69095 6.79887 7.6524C6.82289 7.61386 6.80173 7.50546 6.75186 7.41152C6.65226 7.22391 5.83129 6.1991 5.47264 5.81468C5.34808 5.68117 5.24617 5.53115 5.24617 5.4813C5.24617 5.37439 5.47536 5.16007 6.04195 4.73716C6.26889 4.56776 6.81267 4.14253 7.25035 3.7922C8.29861 2.95314 8.90485 2.49862 9.04166 2.44919C9.12641 2.41857 9.2157 2.4744 9.41551 2.68295C9.78814 3.07187 10.6526 4.03684 10.954 4.40027C11.0944 4.5696 11.2475 4.70813 11.2941 4.70813C11.3408 4.70813 11.6042 4.60442 11.8794 4.47766C12.7255 4.08796 14.2543 3.52968 14.7767 3.41967C14.8798 3.39795 14.9899 3.34954 15.0213 3.3121C15.0527 3.27466 15.1348 2.90813 15.2037 2.49761C15.5491 0.438477 15.6102 0.149525 15.7154 0.0745826C15.7965 0.0168 16.282 0 17.8706 0H19.9211L20.0039 0.129187C20.0494 0.200239 20.1984 0.852632 20.3349 1.57895C20.6895 3.46585 20.617 3.30337 21.155 3.41639C21.939 3.58108 23.0918 3.99385 24.1059 4.4729C24.3797 4.60228 24.6349 4.70813 24.6729 4.70813C24.7108 4.70813 25.1325 4.20431 25.6099 3.58852C26.571 2.34873 26.5738 2.34677 26.9719 2.63905C27.1809 2.79249 28.6985 3.87107 30.0256 4.80934C30.3053 5.0071 30.5341 5.20693 30.5341 5.25339C30.5341 5.29986 30.1901 5.84239 29.7695 6.45902C28.9464 7.66602 28.954 7.64521 29.2086 7.99937C29.3304 8.16876 29.322 8.38102 29.1931 8.38982C29.1364 8.39369 28.05 8.39312 26.779 8.38855L24.468 8.38024L24.0085 8.11508C22.1345 7.03367 19.9782 6.53613 17.5365 6.62176C14.1962 6.7389 11.7988 7.7237 9.66271 9.85617C8.16334 11.353 7.18473 13.0428 6.66277 15.0364C6.26669 16.5492 6.26915 18.9788 6.66836 20.5496C7.15484 22.4639 7.9473 24.0034 9.22772 25.5215C10.8945 27.4978 12.967 28.7432 15.4439 29.2568C17.4094 29.6643 19.4785 29.5508 21.3574 28.9323C21.7406 28.8061 22.1007 28.7174 22.1577 28.735C22.2538 28.7647 22.8299 29.7354 23.5458 31.0738C23.8378 31.6198 23.8414 31.6326 23.7258 31.7156C23.5932 31.8108 21.8517 32.2776 21.1362 32.4098C20.879 32.4572 20.6499 32.5255 20.6271 32.5614C20.6044 32.5973 20.4623 33.3654 20.3114 34.2683C20.1532 35.2147 20.0068 35.9286 19.9657 35.9541C19.9264 35.9784 18.9732 35.9986 17.8473 35.9991L15.8003 36L15.7182 35.8708ZM26.0099 30.8764C25.8184 30.6154 25.4889 30.1565 25.2778 29.8565C25.0666 29.5565 24.4852 28.7461 23.9856 28.0557C23.4861 27.3652 22.8785 26.5225 22.6353 26.1829C22.0119 25.3122 21.5606 24.6925 20.5102 23.265C19.1577 21.4271 18.4602 20.4752 18.0965 19.9713C16.9201 18.3415 16.3673 17.5448 16.3098 17.3966C16.1915 17.0912 16.2395 17.0817 17.8184 17.0987C18.6035 17.1072 19.4685 17.0881 19.7406 17.0562C20.9563 16.914 21.6959 16.2194 21.6991 15.2167C21.7011 14.6033 21.5661 14.2785 21.134 13.8574C20.8281 13.5592 20.7094 13.4855 20.371 13.3837C19.9944 13.2704 19.8385 13.2632 17.7733 13.2632C15.9928 13.2632 15.5636 13.278 15.5097 13.3412C15.4614 13.3979 15.4423 14.8766 15.4402 18.7399L15.4373 24.0605L15.1311 24.2527C14.9627 24.3584 14.5066 24.6325 14.1176 24.8617C13.7285 25.091 13.1633 25.4301 12.8615 25.6154C12.3308 25.9411 12.0758 26.0212 11.9916 25.8886C11.9694 25.8536 11.9385 22.3384 11.9228 18.0769C11.8959 10.7351 11.8999 10.3231 11.9983 10.2171C12.0994 10.1083 12.2112 10.1053 16.0572 10.1072C20.0719 10.1092 20.9374 10.1409 21.592 10.3104C22.4913 10.5432 23.5273 11.1983 24.1515 11.9288C24.715 12.5884 25.1651 13.6588 25.2562 14.5564C25.2796 14.7865 25.2682 15.1686 25.2296 15.4463C25.0135 17.0023 24.0208 18.3314 22.3124 19.3518C21.9734 19.5543 21.8101 19.6865 21.8101 19.7583C21.8101 19.8741 22.2557 20.5104 23.4335 22.0766C23.5997 22.2976 23.9857 22.8144 24.2911 23.2249C24.5966 23.6354 24.9183 24.0617 25.0062 24.1722C25.094 24.2828 25.476 24.7866 25.8551 25.2919C26.4226 26.0483 27.0126 26.8256 27.2491 27.1284C27.5585 27.5247 28.9532 29.3822 29.2543 29.799C30.0634 30.9192 30.1277 31.0225 30.1096 31.1734L30.092 31.3206L28.2251 31.3357L26.3582 31.3509L26.0099 30.8764ZM26.1279 20.0003C26.0874 19.9843 26.0542 19.9068 26.0542 19.828C26.0542 19.6964 27.2583 17.5384 27.6108 17.0383L27.7625 16.823H30.1137C32.1874 16.823 32.4741 16.8337 32.5424 16.9139C32.6087 16.9917 32.5204 17.1975 31.9326 18.335C31.5546 19.0665 31.1918 19.749 31.1264 19.8517L31.0074 20.0383L28.6045 20.0337C27.2829 20.0313 26.1684 20.0162 26.1279 20.0003ZM27.9024 13.6232C27.8329 13.6111 27.736 13.5575 27.6872 13.504C27.5528 13.3566 25.9953 10.4742 25.9953 10.3728C25.9953 10.3241 26.0203 10.2692 26.0509 10.2508C26.0815 10.2324 28.077 10.2182 30.4852 10.2194C34.2036 10.2211 34.8766 10.2338 34.9483 10.3036C35.0215 10.3749 35.0188 10.4224 34.9282 10.6618C34.8268 10.93 33.5098 13.4789 33.4288 13.564C33.3877 13.6072 28.1344 13.6634 27.9024 13.6232Z"
                  fill="white"
                />
              </g>
            </svg>
            {/* <p className="text-enterance">SRMIST&apos;s Flagship Robotics Event</p> */}
            <h2 className="italic" data-cta-content>
              ROBOFEST
            </h2>
            <p className="p_small" data-cta-content>
              in
            </p>
            <h2 className="count-number" data-cta-content>
              {daysLeft}
            </h2>
            <p className="p_small" data-cta-content>
              days.
            </p>
            <a href="_blank" className="n_button" data-cta-content></a>
          </div>
          {/* <div className="n_logo z-1"></div> */}
        </div>
        {/* Placeholder Sections */}
        <main className="w-full">
          <section
            ref={heroSectionRef}
            className={`hero-section ${isHeroRevealed ? "is-visible" : ""}`}
          >
            <div className="hero-header">
              <h1>ROBOFEST 2.0</h1>
              <p>In collaboration with</p>
              <h3>SRM Directorate of Sports</h3>
            </div>

            <div className="animated-icons">
              <div className="animated-icon icon-1">
                <img src="/images/hero-svgs/gear.svg" alt="Robot 1" />
              </div>
              <div className="animated-icon icon-2">
                <img src="/images/hero-svgs/robo.svg" alt="Robot 1" />
              </div>
              <div className="animated-icon icon-3">
                <img src="/images/hero-svgs/microchip.svg" alt="Robot 1" />
              </div>
              <div className="animated-icon icon-4">
                <img src="/images/hero-svgs/rocket.svg" alt="Robot 1" />
              </div>
              <div className="animated-icon icon-5">
                <img src="/images/hero-svgs/wrench.svg" alt="Robot 1" />
              </div>
            </div>

            <h1 className="animated-text">
              <div className="placeholder-icon"></div>
              <span className="text-segment">Build the future</span>

              <div className="placeholder-icon"></div>
              <span className="text-segment">compete with precision.</span>

              <span className="text-segment">Push your limits </span>

              <div className="placeholder-icon"></div>
              <span className="text-segment">in robotics</span>

              <div className="placeholder-icon"></div>
              <span className="text-segment">innovation and speed</span>

              <div className="placeholder-icon"></div>
              <span className="text-segment">at Robofest.</span>
            </h1>
          </section>

          <section ref={triggerRef} className="scroll-section-outer">
            <div ref={scrollSectionRef} className="scroll-section-inner">
              {/* ── SECTION 1 — Hero lookback text ── */}
              <div className="scroll-section lookback-slide">
                <div className="lookback-content">
                  <span className="lookback-eyebrow">Robofest 2025</span>
                  <h2 className="lookback-heading">
                    <em>A look back</em>
                    <br />
                    at Robofest
                    <br />
                    2025.
                  </h2>
                  <p className="lookback-sub">
                    One campus. Hundreds of builders.
                    <br />
                    Unforgettable machines.
                  </p>
                </div>
                <div className="lookback-deco">
                  <div className="lookback-ring lookback-ring--1" />
                  <div className="lookback-ring lookback-ring--2" />
                  <div className="lookback-year">2025</div>
                </div>
              </div>

              {/* ── SECTION 2 — Bento stats grid ── */}
              <div className="scroll-section bento-slide">
                <div className="bento-grid">
                  <div className="bento-card bento-dark bento-tall">
                    <span className="bento-label">Footfall</span>
                    <p className="bento-stat">
                      5,000<span className="bento-plus">+</span>
                    </p>
                    <p className="bento-sub">attendees in 2025</p>
                    <div className="bento-orb bento-orb--red" />
                  </div>

                  <div className="bento-card bento-accent-yellow">
                    <span className="bento-label">Teams</span>
                    <p className="bento-stat">
                      120<span className="bento-plus">+</span>
                    </p>
                    <p className="bento-sub">from 30+ schools</p>
                  </div>

                  <div className="bento-card bento-dark">
                    <span className="bento-label">Prize Pool</span>
                    <p className="bento-stat bento-stat--sm">
                      ₹2L<span className="bento-plus">+</span>
                    </p>
                    <p className="bento-sub">in cash & awards</p>
                    <div className="bento-orb bento-orb--orange" />
                  </div>

                  <div className="bento-card bento-accent-red bento-tall-right">
                    <span className="bento-label bento-label--light">Est.</span>
                    <p
                      className="bento-stat bento-stat--sm"
                      style={{ color: "#fff" }}
                    >
                      2024
                    </p>
                    <p
                      className="bento-sub"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      SRMIST's flagship robotics event
                    </p>
                    <p className="bento-tagline">
                      The biggest student robotics event in South India —
                      <em> back and bigger.</em>
                    </p>
                    <div className="bento-tag">ROBOFEST 2.0</div>
                  </div>

                  <div className="bento-card bento-accent-cream bento-wide">
                    <span className="bento-label">Awards</span>
                    <p className="bento-stat bento-stat--sm">
                      15<span className="bento-plus">+</span>
                    </p>
                    <p className="bento-sub">categories recognised</p>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3 — Photo gallery strip ── */}
              <div className="scroll-section gallery-slide">
                <div className="gallery-header">
                  <span className="lookback-eyebrow">Moments</span>
                  <h2 className="gallery-heading">
                    Captured
                    <br />
                    <em>in frame.</em>
                  </h2>
                </div>
                <div className="gallery-strip">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className={`gallery-item gallery-item--${n}`}>
                      <img
                        src={`/images/gallery/photo-${n}.jpg`}
                        alt={`Robofest 2025 moment ${n}`}
                        className="gallery-img"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 4 — Showreel ── */}
              <div className="scroll-section showreel-slide">
                <div className="showreel-text">
                  <span className="lookback-eyebrow">Showreel</span>
                  <h2 className="showreel-heading">
                    Watch the
                    <br />
                    <em>madness.</em>
                  </h2>
                </div>
                <div className="showreel-frame">
                  <video
                    className="showreel-video"
                    src="/video/rf-showreel.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="showreel-vignette" />
                </div>
              </div>
            </div>
          </section>

          {/* Countdown Timer Section */}
          <section className="w-full">
            <CountdownTimer targetDate={EVENT_DATE} />
          </section>

          <section
            ref={sectionFourRef}
            className="full-screen-section w-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100"
          >
            <div className="text-center">
              <h2 className="text-5xl font-bold text-green-900 mb-4">
                Patrons
              </h2>
              <p className="text-xl text-green-700">
                This is a dummy section for Patrons.
              </p>
            </div>
          </section>
          <section className="full-screen-section w-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-yellow-900 mb-4">
                Sponsors
              </h2>
              <p className="text-xl text-yellow-700">
                This is a dummy section for Sponsors.
              </p>
            </div>
          </section>

          {/* Events Section */}
          <section className="full-screen-section w-full flex flex-col items-center justify-center bg-blue-50">
            <h2 className="text-5xl font-bold mb-4 text-blue-900">Events</h2>
            <p className="text-xl text-blue-700 mb-8">
              All the exciting events at Robofest!
            </p>
            <ul className="list-disc pl-8 text-lg text-blue-800">
              <li>Line Follower Challenge</li>
              <li>Sumo Bot Battle</li>
              <li>Maze Solver</li>
              <li>Innovation Showcase</li>
              <li>Workshops & Demos</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="full-screen-section w-full flex flex-col items-center justify-center bg-purple-50">
            <h2 className="text-5xl font-bold mb-4 text-purple-900">FAQ</h2>
            <div className="w-full max-w-2xl text-left">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-800">
                  What is Robofest?
                </h3>
                <p className="text-purple-700">
                  Robofest is an annual robotics competition and festival for
                  students and enthusiasts.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-800">
                  Who can participate?
                </h3>
                <p className="text-purple-700">
                  Anyone interested in robotics, from school students to college
                  teams and hobbyists.
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-800">
                  How do I register?
                </h3>
                <p className="text-purple-700">
                  Registration details will be available on the official website
                  soon.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="full-screen-section w-full flex flex-col items-center justify-center bg-orange-50">
            <h2 className="text-5xl font-bold mb-4 text-orange-900">
              Contact Us
            </h2>
            <p className="text-xl text-orange-700 mb-8">
              We'd love to hear from you! Reach out with any questions or
              feedback.
            </p>
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
              <form className="flex flex-col gap-4">
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Your Name"
                  required
                />
                <input
                  className="border rounded px-3 py-2"
                  type="email"
                  placeholder="Your Email"
                  required
                />
                <textarea
                  className="border rounded px-3 py-2"
                  placeholder="Your Message"
                  rows={4}
                  required
                />
                <button
                  className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* Custom Scrollbar */}
        <div ref={trackRef} className="custom-scrollbar-track">
          <div
            className="custom-scrollbar-thumb"
            style={{
              height: `${scrollThumbHeight}px`,
              top: `${scrollThumbTop}px`,
            }}
          />
        </div>
      </div>
    </>
  );
}
