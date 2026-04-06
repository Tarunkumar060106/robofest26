"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./styles.css";
import { splitTextIntoSpans } from "@/lib/utils";

export default function Navbar() {
  const [currentImage, setCurrentImage] = useState(0);

  const logos = [
    {
      src: "/images/srm-logo-white.svg",
      className: "nav-logo-image nav-logo-image-srm",
      href: "https://www.srmist.edu.in",
    },
    {
      src: "/images/srm-logo-sports.svg",
      className: "nav-logo-image nav-logo-image-sports",
      href: "https://www.srmist.edu.in/sports/",
    },
    {
      src: "/images/soc.svg",
      className: "nav-logo-image nav-logo-image-soc",
      href: "https://www.srmist.edu.in",
    },
    {
      src: "/images/ctech.svg",
      className: "nav-logo-image nav-logo-image-ctech",
      href: "https://www.srmist.edu.in",
    },
  ] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % logos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1",
    );

    const menuToggle = document.querySelector(".menu-toggle") as HTMLElement;
    const menu = document.querySelector(".menu") as HTMLElement;
    const links = document.querySelectorAll(".link");
    const socialLinks = document.querySelectorAll(".socials p, .socials a");
    let isAnimating = false;

    // Split text function
    splitTextIntoSpans(".header h1");

    gsap.fromTo(
      [".cta-btn", ".menu-toggle"],
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1,
        delay: 1,
        stagger: 0.1,
      },
    );

    const handleToggle = () => {
      if (isAnimating) return;
      if (!menuToggle) return;

      menuToggle.classList.toggle("active");
      const isMenuOpen = menuToggle.classList.contains("active");
      document.body.classList.toggle("menu-open", isMenuOpen);
      window.dispatchEvent(
        new CustomEvent("navbar-menu-state", {
          detail: { isOpen: isMenuOpen },
        }),
      );

      if (isMenuOpen) {
        menuToggle.classList.remove("closed");
        menuToggle.classList.add("opened");
        isAnimating = true;

        gsap.to(menu, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "hop",
          duration: 1.5,
          onStart: () => {
            menu.style.pointerEvents = "all";
            menu.style.zIndex = "50";
          },
          onComplete: () => {
            isAnimating = false;
          },
        });

        gsap.to(links, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          delay: 0.85,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(socialLinks, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          delay: 0.85,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(".video-wrapper", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "hop",
          duration: 1.5,
          delay: 0.5,
        });

        gsap.to(".header h1 span", {
          rotateY: 0,
          stagger: 0.05,
          delay: 0.75,
          duration: 1.5,
          ease: "power4.out",
        });

        gsap.to(".header h1 span", {
          y: 0,
          scale: 1,
          stagger: 0.05,
          delay: 0.5,
          duration: 1.5,
          ease: "power4.out",
        });
      } else {
        menuToggle.classList.remove("opened");
        menuToggle.classList.add("closed");
        isAnimating = true;

        gsap.to(menu, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          ease: "hop",
          duration: 1.5,
          onComplete: () => {
            menu.style.pointerEvents = "none";
            gsap.set(menu, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            });

            gsap.set(links, { y: 30, opacity: 0 });
            gsap.set(socialLinks, { y: 30, opacity: 0 });
            gsap.set(".video-wrapper", {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            gsap.set(".header h1 span", {
              y: 500,
              rotateY: 90,
              scale: 0.75,
            });

            isAnimating = false;
          },
        });
      }
    };

    menuToggle?.addEventListener("click", handleToggle);

    return () => {
      document.body.classList.remove("menu-open");
      window.dispatchEvent(
        new CustomEvent("navbar-menu-state", {
          detail: { isOpen: false },
        }),
      );
      menuToggle?.removeEventListener("click", handleToggle);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <a
          href={logos[currentImage].href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={logos[currentImage].src}
            alt=""
            width={150}
            height={50}
            className={logos[currentImage].className}
          />
        </a>
      </div>

      {/* Toggle button */}
      <div className="menu-toggle closed">
        <div className="menu-copy">
          <p>Menu</p>
        </div>
        <div className="menu-toggle-icon">
          <div className="hamburger">
            <div className="menu-bar" data-position="top"></div>
            <div className="menu-bar" data-position="bottom"></div>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <div className="menu">
        <div className="col col-1">
          <div className="links">
            <div className="link">
              <a href="/">Home</a>
            </div>
            <div className="link">
              <a href="/coming-soon">Events</a>
            </div>
            <div className="link">
              <a href="/coming-soon">Sponsors</a>
            </div>
            <div className="link">
              <a href="/coming-soon">Gallery</a>
            </div>
            <div className="link">
              <a href="/coming-soon">Contact</a>
            </div>
          </div>
          <div className="menu-register-cta-wrap">
            <a
              className="menu-register-cta"
              href="/coming-soon"
              aria-label="Register now for Robofest 2.0"
            >
              <span className="menu-register-cta-copy">
                <span className="menu-register-cta-title">Register Now</span>
                <span className="menu-register-cta-sub">Limited slots</span>
              </span>
              <span className="menu-register-cta-arrow" aria-hidden>
                {"→"}
              </span>
            </a>
          </div>
        </div>

        <div className="col col-2">
          <div className="video-wrapper video-wrapper-right">
            <video autoPlay muted loop playsInline controls>
              <source src="/video/rf-showreel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </nav>
  );
}
