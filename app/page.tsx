"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";

const rackProducts = [
  {
    title: "Distressed Selvedge Shell",
    category: "Customized Denim",
    description: "Raw indigo paneling with reconstructed seams.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Reframed Street Sole",
    category: "Footwear",
    description: "Rebuilt upper wrapped in heavyweight denim scraps.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Cutline Impact Case",
    category: "Lifestyle Hardware",
    description: "Matte black shell with stitched edge texture mapping.",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.1,
    });

    let rafId: number | null = null;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-zinc-950 text-zinc-100">
      <HeroSection />

      <section className="relative border-t border-zinc-800 px-6 py-24 md:px-12" id="on-the-rack">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-black uppercase tracking-[0.14em]">On The Rack</h2>
          <p className="max-w-md text-sm uppercase tracking-[0.1em] text-zinc-400">
            High-velocity drop layer built for denim, footwear and hardware pieces.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rackProducts.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-zinc-800 bg-zinc-900 px-6 py-28 md:px-12" id="off-the-grid">
        <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.12),transparent_32%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-[0.14em]">Off The Grid</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">
              A darker editorial lane focused on raw process: distressing, wash treatments, stitch recovery,
              and lifecycle transparency from discarded textile to final wearable artifact.
            </p>
          </div>
          <div className="space-y-6 text-sm uppercase tracking-[0.1em] text-zinc-300">
            <div className="border border-zinc-700/80 bg-black/30 p-6">01 · Material Collection & Inspection</div>
            <div className="border border-zinc-700/80 bg-black/30 p-6">02 · Pattern Deconstruction & Rebuild</div>
            <div className="border border-zinc-700/80 bg-black/30 p-6">03 · Limited Release / Long-life Ownership</div>
          </div>
        </div>
      </section>
    </main>
  );
}
