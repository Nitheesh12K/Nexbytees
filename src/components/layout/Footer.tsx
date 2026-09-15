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
    <footer className="border-t border-[#202328] bg-[#08090B] text-[#70737A] pt-12 pb-24 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start select-none">
          <div className="text-lg font-black tracking-tight text-[#F5F5F5] uppercase flex items-center">
            NEXBYTEES
          </div>
          <span className="text-[9px] font-mono tracking-widest text-[#70737A] uppercase mt-0.5">
            GLOBAL TECH MEDIA &amp; INTELLIGENCE
          </span>
        </div>

        {/* Center: Nav Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A7A9AD] font-mono uppercase tracking-wider">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("trending")}
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Trending
          </button>
          <button
            onClick={() => onNavigate("domains")}
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Desks
          </button>
          <button
            onClick={() => onNavigate("latest")}
            className="hover:text-[#F5F5F5] transition-colors"
          >
            Latest
          </button>
          <button
            onClick={onOpenUpload}
            className="hover:text-[#2F80FF] transition-colors"
          >
            Dispatch Wire
          </button>
        </nav>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-[#70737A]">
          <a
            href="#x"
            aria-label="X Twitter"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </a>
          <a
            href="#youtube"
            aria-label="YouTube"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="#instagram"
            aria-label="Instagram"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#linkedin"
            aria-label="LinkedIn"
            className="hover:text-[#F5F5F5] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Subtext */}
        <div className="text-center md:text-right font-mono text-xs text-[#70737A] leading-tight">
          <div>Technology moves fast.</div>
          <div className="text-[#A7A9AD]">Stay ahead.</div>
        </div>
      </div>
    </footer>
  );
};
