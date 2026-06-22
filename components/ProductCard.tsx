"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ProductCardProps = {
  title: string;
  category: string;
  description: string;
  image: string;
};

const TITLE_HOVER_Y = -10;
const TITLE_HOVER_SCALE_FACTOR = 1.01;
const META_HOVER_Y = -8;
const HOVER_DURATION = 0.35;
const MEDIA_SCALE = 1.05;
const MEDIA_DURATION = 0.45;
const ROTATE_X_STRENGTH = -12;
const ROTATE_Y_STRENGTH = 14;
const SHIFT_X_FACTOR = 0.05;
const SHIFT_Y_FACTOR = 0.04;

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
      .to(
        titleNode,
        { y: TITLE_HOVER_Y, letterSpacing: "0.14em", scale: TITLE_HOVER_SCALE_FACTOR, duration: HOVER_DURATION, ease: "power3.out" },
        0,
      )
      .to(metaNode, { y: META_HOVER_Y, opacity: 0.95, duration: HOVER_DURATION, ease: "power3.out" }, 0)
      .to(media, { scale: MEDIA_SCALE, duration: MEDIA_DURATION, ease: "power3.out" }, 0);

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
      const rotateAmountX = ((y - rect.height / 2) / rect.height) * ROTATE_X_STRENGTH;
      const rotateAmountY = ((x - rect.width / 2) / rect.width) * ROTATE_Y_STRENGTH;

      rotateX(rotateAmountX);
      rotateY(rotateAmountY);
      shiftX((x - rect.width / 2) * SHIFT_X_FACTOR);
      shiftY((y - rect.height / 2) * SHIFT_Y_FACTOR);
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
      gsap.set([titleNode, metaNode, media], { clearProps: "all" });
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
