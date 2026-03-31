import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import "./EventCard.css";

export interface EventCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  prize: string;
  fee: string;
  venue: string;
  teamSize: string;
  date: string;
  rulesLink?: string;
}

export function EventCard({
  icon,
  title,
  description,
  prize,
  fee,
  venue,
  teamSize,
  date,
  rulesLink,
}: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, rotateY: -10 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
      );
    }
  }, []);

  return (
    <div className="event-flip-card" ref={cardRef} tabIndex={0}>
      <div className="event-flip-inner">
        {/* Front Side */}
        <div className="event-flip-front">
          <div className="event-flip-icon">{icon}</div>
          <div className="event-flip-title">{title}</div>
          <div className="event-flip-desc">{description}</div>
        </div>
        {/* Back Side */}
        <div className="event-flip-back">
          <ul className="event-flip-list">
            <li>
              <span>💰</span>Prize Pool: {prize}
            </li>
            <li>
              <span>💵</span>Entry Fee: {fee}
            </li>
            <li>
              <span>📍</span>Venue: {venue}
            </li>
            <li>
              <span>👥</span>Team Size: {teamSize}
            </li>
            <li>
              <span>📅</span>Date: {date}
            </li>
          </ul>
          {rulesLink && (
            <a
              href={rulesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="event-flip-rules"
            >
              Rules &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
