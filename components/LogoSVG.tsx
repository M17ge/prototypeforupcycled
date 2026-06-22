"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type LogoSVGProps = {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
};

export default function LogoSVG({ className = "", animate = false, style }: LogoSVGProps) {
  const arrowsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!animate || !arrowsRef.current) return;
    const arrows = arrowsRef.current.querySelectorAll(".arrow-el");

    // Staggered upward pulse on arrows
    const tl = gsap.timeline({ repeat: -1, yoyo: false });
    tl.fromTo(
      arrows,
      { y: 0, opacity: 0.7 },
      {
        y: -8,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.12,
      }
    ).to(arrows, {
      y: 0,
      opacity: 0.7,
      duration: 0.45,
      ease: "power2.in",
      stagger: 0.1,
    });

    return () => {
      tl.kill();
    };
  }, [animate]);

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 520 320"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="upcycl3d logo"
      role="img"
    >
      {/* ── UPWARD ARROWS (above the logo, animated) ─────────────────────── */}
      <g ref={arrowsRef}>
        {/* Arrow 1 – above "U" */}
        <g className="arrow-el" transform="translate(72, 14)">
          <polygon points="0,22 14,0 28,22 20,22 20,44 8,44 8,22" fill="currentColor" />
        </g>
        {/* Arrow 2 – above "P" */}
        <g className="arrow-el" transform="translate(162, 4)">
          <polygon points="0,22 14,0 28,22 20,22 20,44 8,44 8,22" fill="currentColor" />
        </g>
        {/* Arrow 3 – small, between rows */}
        <g className="arrow-el" transform="translate(248, 18)">
          <polygon points="0,16 10,0 20,16 14,16 14,32 6,32 6,16" fill="currentColor" opacity="0.6" />
        </g>
      </g>

      {/* ── TOP ROW: "UP" ─────────────────────────────────────────────────── */}
      <g transform="translate(0, 60)">
        {/* U */}
        <path
          d="M40,0 L40,90 Q40,130 90,130 Q140,130 140,90 L140,0 L110,0 L110,90 Q110,105 90,105 Q70,105 70,90 L70,0 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* P */}
        <path
          d="M155,0 L155,130 L185,130 L185,80 L220,80 Q260,80 260,40 Q260,0 220,0 Z
             M185,25 L215,25 Q232,25 232,40 Q232,55 215,55 L185,55 Z"
          fill="currentColor"
        />
      </g>

      {/* ── BOTTOM ROW: "CYCL3D" ──────────────────────────────────────────── */}
      <g transform="translate(0, 185)">
        {/* C */}
        <path
          d="M20,65 Q20,0 75,0 L120,0 L120,28 L78,28 Q48,28 48,65 Q48,102 78,102 L120,102 L120,130 L75,130 Q20,130 20,65 Z"
          fill="currentColor"
        />
        {/* Y */}
        <path
          d="M125,0 L158,55 L190,0 L218,0 L175,72 L175,130 L145,130 L145,72 L100,0 Z"
          fill="currentColor"
        />
        {/* C */}
        <path
          d="M222,65 Q222,0 277,0 L318,0 L318,28 L280,28 Q250,28 250,65 Q250,102 280,102 L318,102 L318,130 L277,130 Q222,130 222,65 Z"
          fill="currentColor"
        />
        {/* L */}
        <path
          d="M325,0 L355,0 L355,102 L420,102 L420,130 L325,130 Z"
          fill="currentColor"
        />
        {/* 3 */}
        <path
          d="M428,0 L490,0 L490,28 L458,28 L480,55 L458,82 L490,82 L490,130 L428,130 L428,102 L455,102 L430,70 L455,58 L430,28 L428,28 Z"
          fill="currentColor"
        />
        {/* D */}
        <path
          d="M498,0 L498,130 L536,130 Q580,130 580,65 Q580,0 536,0 Z
             M526,28 L536,28 Q552,28 552,65 Q552,102 536,102 L526,102 Z"
          fill="currentColor"
        />
      </g>

      {/* ── OUTLINE LAYER (brand contour) ──────────────────────────────────── */}
      <rect x="15" y="58" width="570" height="264" rx="6" ry="6"
        fill="none" stroke="currentColor" strokeWidth="3" opacity="0.18" />
    </svg>
  );
}
