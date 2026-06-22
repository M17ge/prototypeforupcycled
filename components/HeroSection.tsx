"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import LogoSVG from "./LogoSVG";

gsap.registerPlugin(ScrollTrigger, Flip);

const BG_SCALE_TARGET = 1.22;
const CURSOR_SIZE = 220;
const CURSOR_HALF = CURSOR_SIZE / 2;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lockBadgeRef = useRef<HTMLButtonElement>(null);
  const logoLeftRef = useRef<HTMLDivElement>(null);
  const logoRightRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleLockToggle = () => {
    const badge = lockBadgeRef.current;
    if (!badge) {
      setIsLocked((v) => !v);
      return;
    }
    const state = Flip.getState(badge);
    setIsLocked((v) => !v);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.45, ease: "power3.inOut" });
    });
  };

  // Fade-in entry
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(
      logoWrapRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
    );
  }, [visible]);

  // Scroll animations
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const logoLeft = logoLeftRef.current;
    const logoRight = logoRightRef.current;
    if (!section || !bg || !logoLeft || !logoRight) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // ── Lando Norris split: left half goes left, right half goes right ──
      tl.to(logoLeft,  { x: "-55vw", opacity: 0, ease: "none" }, 0)
        .to(logoRight, { x:  "55vw", opacity: 0, ease: "none" }, 0)
        .to(bg, { scale: BG_SCALE_TARGET, filter: "brightness(1.2) contrast(1.08)", ease: "none" }, 0);
    }, section);

    // Custom cursor blob
    const cursor = cursorRef.current;
    const quickX = cursor ? gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power4.out" }) : null;
    const quickY = cursor ? gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power4.out" }) : null;

    const onMove = (e: MouseEvent) => {
      if (!section || !quickX || !quickY) return;
      const rect = section.getBoundingClientRect();
      section.style.setProperty("--pointer-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      section.style.setProperty("--pointer-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      quickX(e.clientX - CURSOR_HALF);
      quickY(e.clientY - CURSOR_HALF);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", isLocked);
    return () => document.body.classList.remove("scroll-locked");
  }, [isLocked]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen overflow-hidden border-b border-zinc-800/80 bg-black"
      style={{
        backgroundImage:
          "radial-gradient(circle at var(--pointer-x,50%) var(--pointer-y,50%), rgba(255,255,255,0.18), rgba(0,0,0,0.97) 44%)",
      }}
    >
      {/* Background photo */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.72)_100%)]" />

      {/* Custom cursor blob */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 h-56 w-56 rounded-full bg-white/10 opacity-60 mix-blend-screen blur-3xl"
      />

      {/* UI layer */}
      <div className="relative z-20 flex h-full flex-col justify-between px-6 py-10 md:px-12">
        {/* Navbar row */}
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-200">upcycl3d</p>
          <button
            ref={lockBadgeRef}
            type="button"
            onClick={handleLockToggle}
            aria-pressed={isLocked}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
              isLocked
                ? "border-zinc-100 bg-zinc-100 text-black shadow-[0_0_0_1px_rgba(255,255,255,0.24)]"
                : "border-zinc-400/70 bg-black/45 text-zinc-100 hover:border-zinc-100 hover:bg-black/65"
            }`}
          >
            {isLocked ? "Back to Scroll" : "Tap to Lock"}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {isLocked ? "Scroll lock enabled" : "Scroll lock disabled"}
        </p>

        {/* ── LOGO (SVG split) ─────────────────────────────────────────── */}
        <div
          ref={logoWrapRef}
          className="flex items-center justify-center"
          style={{ opacity: 0 }}
          aria-label="upcycl3d logo"
        >
          {/*
           * We render the SAME SVG twice, each clipped to one half.
           * They sit on top of each other via absolute positioning within
           * a relative container, so GSAP can slide them independently.
           */}
          <div className="relative w-full max-w-2xl">
            {/* Left half */}
            <div
              ref={logoLeftRef}
              className="w-full"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              <LogoSVG animate className="w-full text-white mix-blend-screen" />
            </div>
            {/* Right half — absolutely overlaid so they share space */}
            <div
              ref={logoRightRef}
              className="absolute inset-0 w-full"
              style={{ clipPath: "inset(0 0 0 50%)" }}
            >
              <LogoSVG className="w-full text-white mix-blend-screen" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="max-w-lg text-sm uppercase tracking-[0.12em] text-zinc-300">
          Customized denim architecture. Footwear interventions. Curated lifestyle hardware.
        </p>
      </div>
    </section>
  );
}
