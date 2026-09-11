"use client";

import React, { useState, useRef } from "react";
import { DomainMeta } from "@/types";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainCard3DProps {
  domain: DomainMeta;
  isSelected: boolean;
  onClick: () => void;
}

export const DomainCard3D: React.FC<DomainCard3DProps> = ({
  domain,
  isSelected,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic Lucide Icon resolver
  const IconComponent =
    ((LucideIcons as unknown) as Record<string, React.ElementType>)[domain.iconName] ||
    LucideIcons.Cpu;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // tilt max 12deg
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: "1000px",
      }}
      className="cursor-pointer select-none group"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-xl p-5 border transition-all duration-300",
          "bg-gradient-to-b from-[#0e172e]/80 via-[#070d1e]/90 to-[#030712]/95",
          "backdrop-blur-md",
          isSelected
            ? "border-sky-400/80 shadow-[0_0_24px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/50"
            : "border-slate-800/80 hover:border-slate-600/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Dynamic Glare Reflection */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 180px at ${glarePosition.x}% ${glarePosition.y}%, rgba(56, 189, 248, 0.25), transparent 70%)`,
            }}
          />
        )}

        {/* Ambient background glow accent */}
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-45"
          style={{ backgroundColor: domain.highlightColor }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300",
                  isSelected
                    ? "bg-sky-500/20 border-sky-400/70 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 group-hover:border-sky-500/40 group-hover:text-sky-400"
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-400 border border-slate-800">
                {domain.shortCode}
              </span>
            </div>

            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors tracking-tight">
              {domain.name}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {domain.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono">
              {domain.articleCount} Stories
            </span>
            <span className="text-sky-400/90 font-medium group-hover:underline flex items-center gap-1">
              Explore &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
