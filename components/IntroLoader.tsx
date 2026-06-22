"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LogoSVG from "./LogoSVG";

type IntroLoaderProps = {
  onComplete: () => void;
};

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bar = progressBarRef.current;
    const logoEl = logoRef.current;
    if (!overlay || !bar || !logoEl) return;

    // Animate count from 0 → 100
    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.value)),
    });

    // Animate progress bar width
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.2, ease: "power2.inOut", transformOrigin: "left" }
    );

    // Logo fade-in
    gsap.fromTo(
      logoEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
    );

    // Exit animation after progress completes
    const exitTimer = setTimeout(() => {
      const tl = gsap.timeline({ onComplete });
      tl.to(logoEl, { opacity: 0, y: -30, duration: 0.5, ease: "power3.in" })
        .to(overlay, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "-=0.15");
    }, 2600);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      {/* Logo */}
      <div ref={logoRef} className="opacity-0 w-64 md:w-80 text-white mb-12">
        <LogoSVG animate={false} />
      </div>

      {/* Progress area */}
      <div className="w-64 md:w-80 space-y-3">
        <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.3em] text-zinc-500">
          <span>Loading</span>
          <span ref={progressTextRef}>{count}%</span>
        </div>
        {/* Track */}
        <div className="h-px w-full bg-zinc-800">
          {/* Bar */}
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Brand tagline */}
      <p className="mt-8 text-[0.55rem] uppercase tracking-[0.4em] text-zinc-600">
        Customized Denim · Footwear · Lifestyle Hardware
      </p>
    </div>
  );
}
