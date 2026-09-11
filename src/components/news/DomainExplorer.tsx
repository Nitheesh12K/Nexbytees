"use client";

import React, { useState } from "react";
import {
  Brain,
  Bot,
  Atom,
  ShieldCheck,
  Rocket,
  Cpu,
  Cloud,
  LayoutGrid,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainExplorerProps {
  selectedDomain: string | null;
  onSelectDomain: (domain: string | null) => void;
  onOpenAllDomainsModal: () => void;
}

export const DomainExplorer: React.FC<DomainExplorerProps> = ({
  selectedDomain,
  onSelectDomain,
  onOpenAllDomainsModal,
}) => {
  const DOMAINS_DISPLAY = [
    {
      id: "ai",
      name: "Artificial Intelligence",
      label: "AI",
      subtitle: "Everything Intelligent",
      icon: Brain,
    },
    {
      id: "robotics",
      name: "Robotics",
      label: "Robotics",
      subtitle: "A Human Future",
      icon: Bot,
    },
    {
      id: "quantum",
      name: "Quantum Computing",
      label: "Quantum",
      subtitle: "Beyond Limits",
      icon: Atom,
      defaultActive: true,
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      label: "Cybersecurity",
      subtitle: "A Safer World",
      icon: ShieldCheck,
    },
    {
      id: "space",
      name: "Space Technology",
      label: "Space",
      subtitle: "Explore Further",
      icon: Rocket,
    },
    {
      id: "semiconductors",
      name: "Semiconductors",
      label: "Semiconductors",
      subtitle: "Powering Progress",
      icon: Cpu,
    },
    {
      id: "cloud",
      name: "Cloud Computing",
      label: "Cloud",
      subtitle: "Infinite Scale",
      icon: Cloud,
    },
  ];

  return (
    <section id="domains" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-3">
            {/* Brand accent line */}
            <div className="w-1 h-6 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)] flex-shrink-0" />
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-sky-400" />
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Explore Technology
              </h2>
            </div>
          </div>
          <p className="text-xs md:text-sm text-white/35 mt-1.5 ml-4">
            Dive into the domains shaping our future.
          </p>
        </div>

        <button
          onClick={onOpenAllDomainsModal}
          className="flex items-center gap-1 text-xs font-semibold text-sky-400/80 hover:text-sky-300 transition-colors"
        >
          <span>View All Domains</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {DOMAINS_DISPLAY.map((dom) => {
          const Icon = dom.icon;
          const isSelected =
            selectedDomain === dom.name || (!selectedDomain && dom.defaultActive);

          return (
            <div
              key={dom.id}
              onClick={() =>
                onSelectDomain(selectedDomain === dom.name ? null : dom.name)
              }
              className={cn(
                "cursor-pointer select-none rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all duration-300 group",
                "bg-gradient-to-b from-[#08101f]/95 via-[#050b18]/95 to-[#020710]",
                "min-h-[145px]",
                "hover:scale-[1.02]",
                isSelected
                  ? "border border-sky-400/60 shadow-[0_0_0_1px_rgba(56,189,248,0.3),0_8px_32px_rgba(56,189,248,0.12)]"
                  : "border border-white/6 hover:border-white/12 hover:shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
              )}
            >
              {/* Icon with disc background */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mt-1",
                  isSelected
                    ? "bg-sky-500/12 text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                    : "bg-white/4 text-sky-400/70 group-hover:text-sky-300 group-hover:bg-sky-500/10"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Label */}
              <div className="mt-3">
                <div className="text-xs sm:text-sm font-bold text-white/85 group-hover:text-white transition-colors">
                  {dom.label}
                </div>
                <div className="text-[10px] text-white/30 font-normal mt-0.5 leading-tight">
                  {dom.subtitle}
                </div>
              </div>
            </div>
          );
        })}

        {/* MORE DOMAINS CARD */}
        <div
          onClick={onOpenAllDomainsModal}
          className={cn(
            "cursor-pointer select-none rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all duration-300 group",
            "bg-gradient-to-b from-[#08101f]/95 via-[#050b18]/95 to-[#020710]",
            "border border-white/6 hover:border-sky-400/30 min-h-[145px] hover:scale-[1.02]",
            "hover:shadow-[0_8px_24px_rgba(0,0,0,0.7),0_0_0_1px_rgba(56,189,248,0.1)]"
          )}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sky-400/60 bg-white/4 group-hover:text-sky-300 group-hover:bg-sky-500/10 transition-all duration-300 mt-1">
            <LayoutGrid className="w-6 h-6" />
          </div>

          <div className="mt-3">
            <div className="text-xs sm:text-sm font-bold text-white/85 group-hover:text-white transition-colors">
              More
            </div>
            <div className="text-[10px] text-white/30 font-normal mt-0.5 leading-tight">
              Domains
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
