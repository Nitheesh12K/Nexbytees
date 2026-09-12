"use client";

import React from "react";
import { Youtube, Instagram, Linkedin } from "lucide-react";

// Simple Twitter/X Icon
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenUpload }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#01040d] text-slate-400 pt-12 pb-24 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start select-none">
          <div className="text-lg font-black tracking-wider text-white uppercase flex items-center">
            NE<span className="text-sky-400">X</span>BYTEES
          </div>
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase -mt-0.5">
            AI • TECHNOLOGY • FUTURE
          </span>
        </div>

        {/* Center: Nav Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-sans">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("trending")}
            className="hover:text-white transition-colors"
          >
            Trending
          </button>
          <button
            onClick={() => onNavigate("domains")}
            className="hover:text-white transition-colors"
          >
            Domains
          </button>
          <button
            onClick={() => onNavigate("latest")}
            className="hover:text-white transition-colors"
          >
            Latest
          </button>
          <button
            onClick={onOpenUpload}
            className="hover:text-sky-400 transition-colors"
          >
            Community
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-white transition-colors"
          >
            About
          </button>
        </nav>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="#x"
            aria-label="X Twitter"
            className="hover:text-white transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </a>
          <a
            href="#youtube"
            aria-label="YouTube"
            className="hover:text-white transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="#instagram"
            aria-label="Instagram"
            className="hover:text-white transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#linkedin"
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Subtext */}
        <div className="text-center md:text-right font-sans text-xs text-slate-500 leading-tight">
          <div>Technology moves fast.</div>
          <div className="text-slate-400">Stay ahead.</div>
        </div>
      </div>
    </footer>
  );
};
