"use client";

import React from "react";
import { HeroGlobe3D } from "../3d/HeroGlobe3D";
import { ArrowRight, LayoutGrid, Compass } from "lucide-react";

interface HeroSectionProps {
  onExploreTrending: () => void;
  onExploreDomains: () => void;
  onSelectDomain: (domain: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreTrending,
  onExploreDomains,
  onSelectDomain,
}) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#010409]">
      {/* ── Cinematic multi-layer background ── */}

      {/* 1. Global deep matte black base (above bg color for layering) */}
      <div className="absolute inset-0 bg-[#010409] pointer-events-none" />

      {/* 2. Subtle right-side nebula bloom behind the globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 75% 48%, rgba(14,100,210,0.07) 0%, transparent 70%)",
        }}
      />

      {/* 3. Very faint editorial masthead bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(56,189,248,0.25) 30%, rgba(56,189,248,0.5) 50%, rgba(56,189,248,0.25) 70%, transparent 100%)",
        }}
      />

      {/* 4. Bottom fade to page body */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#010409] pointer-events-none" />

      {/* ── Content grid ── */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left column — Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left z-10">

            {/* Editorial kicker label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-sky-400" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-sky-400 font-medium uppercase">
                AI &nbsp;·&nbsp; TECHNOLOGY &nbsp;·&nbsp; FUTURE
              </span>
            </div>

            {/* NEXBYTEES wordmark */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase leading-none">
              NE<span className="text-sky-400">X</span>BYTEES
            </h1>

            {/* Secondary headline — cinematic weight */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white/85 mt-4 leading-tight uppercase">
              THE FUTURE IS BEING{" "}
              <span className="text-sky-400">BUILT RIGHT NOW.</span>
            </h2>

            {/* Lead description */}
            <p className="text-sm md:text-base text-white/45 max-w-lg mt-5 leading-relaxed font-normal">
              Breaking technology news, AI breakthroughs, robotics, cybersecurity, space, computing
              and the ideas shaping tomorrow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-9">
              <button
                onClick={onExploreTrending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs md:text-sm shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-[1.02] tracking-wide"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Trending</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDomains}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-xs md:text-sm backdrop-blur-md transition-all duration-300 tracking-wide"
              >
                <LayoutGrid className="w-4 h-4 text-sky-400" />
                <span>Browse Domains</span>
              </button>
            </div>

            {/* Metric stats row */}
            <div className="flex items-center gap-8 sm:gap-14 mt-12 pt-8 border-t border-white/8">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono leading-none">
                  25<span className="text-sky-400">+</span>
                </div>
                <div className="text-[11px] text-white/35 font-mono mt-1.5 tracking-wider uppercase">
                  Tech Domains
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">
                  10K<span className="text-sky-400">+</span>
                </div>
                <div className="text-[11px] text-white/35 font-mono mt-1.5 tracking-wider uppercase">
                  Stories Covered
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">
                  <span className="text-sky-400">∞</span>
                </div>
                <div className="text-[11px] text-white/35 font-mono mt-1.5 tracking-wider uppercase">
                  Global Reach
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Realistic Earth Globe */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <HeroGlobe3D onSelectDomain={onSelectDomain} />

            {/* Far-right vertical editorial labels */}
            <div className="hidden xl:flex flex-col justify-between h-[460px] absolute -right-12 top-6 text-right select-none pointer-events-none">
              <div className="space-y-1.5 font-mono text-[9px] tracking-widest uppercase text-white/25">
                <div className="flex items-center justify-end gap-1.5 text-sky-400/70 font-bold">
                  <span>TECH</span>
                  <span className="w-1 h-1 rounded-full bg-sky-400/60" />
                </div>
                <div>NEWS</div>
                <div>IDEAS</div>
                <div>PEOPLE</div>
                <div>IMPACT</div>
              </div>

              <div className="font-mono text-[9px] tracking-widest uppercase text-white/20 leading-relaxed">
                <div>TECHNOLOGY</div>
                <div>MOVES FAST.</div>
                <div className="text-white/40">STAY AHEAD.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
