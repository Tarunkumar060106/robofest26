"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "robofest.discountModal.seen";

interface DiscountModalProps {
  registrationUrl: string;
}

export default function DiscountModal({ registrationUrl }: DiscountModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="discount-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-modal-title"
    >
      <div
        className="discount-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="discount-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="discount-modal-emoji">🎉</div>

        <h2 id="discount-modal-title" className="discount-modal-title">
          Limited-Time Offer
        </h2>
        <p className="discount-modal-subtitle">
          Save 10% on Event Registration!
        </p>

        <p className="discount-modal-body">
          Register now and secure your spot at a discounted rate.
        </p>

        <div className="discount-modal-pricing">
          <span className="discount-modal-original">Original Fee</span>
          <span className="discount-modal-arrow">→</span>
          <span className="discount-modal-discounted">Discounted Fee</span>
        </div>

        <p className="discount-modal-note">
          This offer is available for a limited time only.
        </p>

        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="discount-modal-cta"
          onClick={handleClose}
        >
          Register Now &amp; Save 10%
        </a>
      </div>
    </div>
  );
}
