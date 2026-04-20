"use client";

import { forwardRef } from "react";
import styles from "./Footer.module.css";

const Footer = forwardRef<HTMLElement>((props, ref) => {
    const handleBackToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <footer ref={ref} className={styles.footer}>
        <div className={styles.grain} aria-hidden />
        <div className={styles.glowOrb} data-footer-glow aria-hidden />

        <div className={styles.inner}>
          <div className={styles.topRow}>
            <p className={styles.kicker}>Stay Connected</p>
            <button
              type="button"
              className={styles.topButton}
              data-footer-top
              onClick={handleBackToTop}
            >
              Back to top ↑
            </button>
          </div>

          <h2 className={styles.heading}>
            <span data-footer-heading-part>Build.</span>
            <span data-footer-heading-part>Compete.</span>
            <span data-footer-heading-part>Belong.</span>
          </h2>

          <div className={styles.cols}>
            <div className={styles.col} data-footer-col>
              <p className={styles.colTitle}>Contact</p>
              <a
                href="mailto:isdlab@srmist.edu.in"
                className={styles.link}
                data-footer-link
              >
                robofest@srmist.edu.in
              </a>
              {/* <a href="tel:+914427452270" className={styles.link} data-footer-link>
                +91 44 2745 2270
              </a> */}
              <p className={styles.meta}>SRMIST, Kattankulathur, Chennai</p>
            </div>

            <div className={styles.col} data-footer-col>
              <p className={styles.colTitle}>Explore</p>
              <a href="#events" className={styles.link} data-footer-link>
                Events
              </a>
              <a href="#sponsors" className={styles.link} data-footer-link>
                Sponsors
              </a>
              <a href="#gallery" className={styles.link} data-footer-link>
                Gallery
              </a>
              <a href="#contact" className={styles.link} data-footer-link>
                Contact Us
              </a>
            </div>
          </div>

          <div className={styles.bottom}>
            <p
              className={`${styles.bottomText} ${styles.bottomCopyright}`}
              data-footer-bottom
            >
              © {new Date().getFullYear()} Robofest. All rights reserved.
            </p>
            <p
              className={`${styles.bottomText} ${styles.bottomTagline}`}
              data-footer-bottom
            >
              Crafted for the next generation of robotics builders.
            </p>
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = "Footer";

export default Footer;
