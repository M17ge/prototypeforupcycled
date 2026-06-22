"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ProductCardProps = {
  title: string;
  category: string;
  description: string;
  image: string;
};

export default function ProductCard({ title, category, description, image }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    const titleNode = titleRef.current;
    const metaNode = metaRef.current;
    const overlay = overlayRef.current;
    if (!card || !media || !titleNode || !metaNode || !overlay) return;

    const hoverTl = gsap.timeline({ paused: true });
    hoverTl
      .to(titleNode, { y: -10, letterSpacing: "0.14em", scale: 1.01, duration: 0.35, ease: "power3.out" }, 0)
      .to(metaNode, { y: -8, opacity: 0.95, duration: 0.35, ease: "power3.out" }, 0)
      .to(media, { scale: 1.05, duration: 0.45, ease: "power3.out" }, 0);

    const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power2.out" });
    const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power2.out" });
    const shiftX = gsap.quickTo(media, "x", { duration: 0.4, ease: "power2.out" });
    const shiftY = gsap.quickTo(media, "y", { duration: 0.4, ease: "power2.out" });

    const onEnter = () => hoverTl.play();
    const onLeave = () => {
      hoverTl.reverse();
      rotateX(0);
      rotateY(0);
      shiftX(0);
      shiftY(0);
      overlay.style.background = "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), rgba(0,0,0,0.72) 55%)";
    };

    const onMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      const rotateAmountX = ((y - rect.height / 2) / rect.height) * -12;
      const rotateAmountY = ((x - rect.width / 2) / rect.width) * 14;

      rotateX(rotateAmountX);
      rotateY(rotateAmountY);
      shiftX((x - rect.width / 2) * 0.05);
      shiftY((y - rect.height / 2) * 0.04);
      overlay.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.36), rgba(0,0,0,0.78) 56%)`;
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      hoverTl.kill();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="group relative overflow-hidden border border-zinc-700 bg-black perspective-distant"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={mediaRef}
        className="h-80 bg-cover bg-center transition-transform duration-500"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), rgba(0,0,0,0.72) 55%)" }}
      />
      <div className="relative z-10 border-t border-zinc-700 bg-black/70 p-5 backdrop-blur-sm">
        <p ref={metaRef} className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-300">
          {category}
        </p>
        <h3 ref={titleRef} className="mt-2 text-lg font-black uppercase tracking-[0.1em] text-zinc-100">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{description}</p>
      </div>
    </article>
  );
}
