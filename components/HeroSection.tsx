"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const HERO_SCALE_TARGET = 4.9;
const HERO_OPACITY_TARGET = 0.24;
const BG_SCALE_TARGET = 1.22;
const CURSOR_SIZE = 220;
const CURSOR_HALF = CURSOR_SIZE / 2;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lockBadgeRef = useRef<HTMLButtonElement>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleLockToggle = () => {
    const badge = lockBadgeRef.current;
    if (!badge) {
      setIsLocked((value) => !value);
      return;
    }
    const state = Flip.getState(badge);
    setIsLocked((value) => !value);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.45,
        ease: "power3.inOut",
      });
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const logo = logoRef.current;
    const bg = bgRef.current;
    if (!section || !logo || !bg) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        })
        .to(logo, { scale: HERO_SCALE_TARGET, opacity: HERO_OPACITY_TARGET, yPercent: -6, letterSpacing: "0.18em", ease: "none" }, 0)
        .to(bg, { scale: BG_SCALE_TARGET, filter: "brightness(1.2) contrast(1.08) saturate(1.1)", ease: "none" }, 0);
    }, section);

    const cursor = cursorRef.current;
    const quickX = cursor ? gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power4.out" }) : null;
    const quickY = cursor ? gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power4.out" }) : null;

    const onMove = (event: MouseEvent) => {
      if (!section || !quickX || !quickY) return;
      const rect = section.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      section.style.setProperty("--pointer-x", `${(localX / rect.width) * 100}%`);
      section.style.setProperty("--pointer-y", `${(localY / rect.height) * 100}%`);
      quickX(event.clientX - CURSOR_HALF);
      quickY(event.clientY - CURSOR_HALF);
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
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [isLocked]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-b border-zinc-800/80 bg-black"
      style={{
        backgroundImage:
          "radial-gradient(circle at var(--pointer-x,50%) var(--pointer-y,50%), rgba(255,255,255,0.2), rgba(0,0,0,0.97) 44%)",
      }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.72)_100%)]" />

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 h-56 w-56 rounded-full bg-white/12 opacity-70 mix-blend-screen blur-3xl"
      />

      <div className="relative z-20 flex h-full flex-col justify-between px-6 py-10 md:px-12">
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

        <h1
          ref={logoRef}
          className="origin-center text-[18vw] font-black uppercase leading-[0.84] tracking-[0.1em] text-white mix-blend-screen md:text-[15vw]"
        >
          upcycl3d
        </h1>

        <p className="max-w-lg text-sm uppercase tracking-[0.12em] text-zinc-300">
          Customized denim architecture. Footwear interventions. Curated lifestyle hardware.
        </p>
      </div>
    </section>
  );
}
