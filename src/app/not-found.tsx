import React from "react";
import Link from "next/link";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Volumetric Glow & Grid */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none -z-10" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40 -z-10"
      />

      <div className="max-w-lg text-center relative z-10">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex flex-col items-center cursor-pointer select-none mb-8">
          <div className="text-2xl font-black tracking-wider text-white uppercase flex items-center">
            NE<span className="text-sky-400">X</span>BYTEES
          </div>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
            AI • TECHNOLOGY • FUTURE
          </span>
        </Link>

        {/* Large 404 text */}
        <div className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-sky-400 via-sky-600 to-transparent leading-none drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
          404
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-4 font-mono uppercase">
          THIS STORY DOESN’T EXIST.
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          The page you’re looking for may have moved or no longer exists in our live technology index.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back Home</span>
          </Link>

          <Link
            href="/#trending"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#091124] border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white font-medium text-xs transition-all"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Explore Trending</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
