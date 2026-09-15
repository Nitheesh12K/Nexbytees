import React from "react";
import Link from "next/link";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F5] flex flex-col items-center justify-center p-6 relative">
      <div className="max-w-lg text-center relative z-10">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex flex-col items-center cursor-pointer select-none mb-8 group">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#2F80FF] rounded-sm" />
            <div className="text-2xl font-black tracking-tight text-[#F5F5F5] uppercase">
              NEXBYTEES
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#70737A] uppercase mt-1">
            TECH MEDIA & INTELLIGENCE
          </span>
        </Link>

        {/* Large 404 text */}
        <div className="text-7xl sm:text-8xl font-black font-mono tracking-tighter text-[#202328] select-none leading-none">
          404
        </div>

        {/* Headline */}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F5F5F5] mt-4 font-mono uppercase">
          DISPATCH NOT FOUND
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A7A9AD] mt-2 max-w-sm mx-auto leading-relaxed font-sans">
          The requested technology story, report, or analysis has moved or does not exist in the live index.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Front Page</span>
          </Link>

          <Link
            href="/#trending"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2C3038] text-[#A7A9AD] hover:text-[#F5F5F5] font-medium text-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#2F80FF]" />
            <span>Trending Wire</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
