"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const HERO_SCALE_TARGET = 5.2;
const HERO_OPACITY_TARGET = 0.28;
const CURSOR_SIZE = 240;
const CURSOR_HALF = CURSOR_SIZE / 2;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lockBadgeRef = useRef<HTMLButtonElement>(null);
  const [isLocked, setIsLocked] = useState(false);

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
        .to(logo, { scale: HERO_SCALE_TARGET, opacity: HERO_OPACITY_TARGET, ease: "none" }, 0)
        .to(bg, { scale: 1.18, filter: "brightness(1.15)", ease: "none" }, 0);
    }, section);

    const cursor = cursorRef.current;
    const quickX = cursor ? gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" }) : null;
    const quickY = cursor ? gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" }) : null;

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
    if (!lockBadgeRef.current) return;
    const state = Flip.getState(lockBadgeRef.current);
    Flip.from(state, {
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, [isLocked]);

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", isLocked);
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [isLocked]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-b border-zinc-800 bg-black"
      style={{
        backgroundImage:
          "radial-gradient(circle at var(--pointer-x,50%) var(--pointer-y,50%), rgba(255,255,255,0.22), rgba(0,0,0,0.96) 42%)",
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
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-40 h-60 w-60 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative z-20 flex h-full flex-col justify-between px-6 py-10 md:px-12">
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-200">upcycl3d</p>
          <button
            ref={lockBadgeRef}
            type="button"
            onClick={() => setIsLocked((value) => !value)}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
              isLocked
                ? "border-zinc-100 bg-zinc-100 text-black"
                : "border-zinc-400/70 bg-black/35 text-zinc-100 hover:border-zinc-100"
            }`}
          >
            {isLocked ? "Back to Scroll" : "Tap to Lock"}
          </button>
        </div>

        <h1
          ref={logoRef}
          className="origin-center text-[18vw] font-black uppercase leading-[0.85] tracking-[0.08em] text-white mix-blend-screen md:text-[15vw]"
        >
          upcycl3d
        </h1>

        <p className="max-w-lg text-sm uppercase tracking-[0.12em] text-zinc-200">
          Customized denim architecture. Footwear interventions. Curated lifestyle hardware.
        </p>
      </div>
    </section>
  );
}
