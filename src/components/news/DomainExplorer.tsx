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
    <section id="domains" className="py-10 px-4 md:px-8 max-w-7xl mx-auto border-b border-[#202328]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#202328]">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-[#2F80FF] rounded-sm flex-shrink-0" />
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#2F80FF]" />
            <h2 className="text-base sm:text-lg font-black tracking-tight text-[#F5F5F5] uppercase">
              REPORTING DESKS · 25+ DOMAINS
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#70737A]">
            (SELECT A DESK TO FILTER THE LIVE WIRE)
          </span>
        </div>

        <button
          onClick={onOpenAllDomainsModal}
          className="flex items-center gap-1 text-xs font-mono text-[#2F80FF] hover:text-[#70A6FF] transition-colors"
        >
          <span>DIRECTORY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {DOMAINS_DISPLAY.map((dom) => {
          const Icon = dom.icon;
          const isSelected = selectedDomain === dom.name;

          return (
            <div
              key={dom.id}
              onClick={() =>
                onSelectDomain(selectedDomain === dom.name ? null : dom.name)
              }
              className={cn(
                "relative cursor-pointer select-none rounded-md p-3.5 flex flex-col items-center justify-between text-center transition-all duration-200 group",
                "min-h-[128px]",
                isSelected
                  ? "bg-[#15171B] border border-[#2F80FF] shadow-sm"
                  : "bg-[#111317] border border-[#202328] hover:bg-[#15171B] hover:border-[#2C3038]"
              )}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#2F80FF] rounded-t-md" />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-sm flex items-center justify-center transition-colors mt-1",
                  isSelected
                    ? "bg-[#2F80FF]/15 text-[#2F80FF]"
                    : "bg-[#1A1D23] text-[#A7A9AD] group-hover:text-[#2F80FF] group-hover:bg-[#20242C]"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <div className="mt-2.5">
                <div className={cn(
                  "text-xs font-bold transition-colors leading-tight",
                  isSelected ? "text-[#F5F5F5]" : "text-[#A7A9AD] group-hover:text-[#F5F5F5]"
                )}>
                  {dom.label}
                </div>
                <div className="text-[10px] text-[#70737A] font-mono mt-0.5 leading-tight">
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
            "cursor-pointer select-none rounded-md p-3.5 flex flex-col items-center justify-between text-center transition-all duration-200 group",
            "bg-[#111317] border border-[#202328] hover:bg-[#15171B] hover:border-[#2F80FF] min-h-[128px]"
          )}
        >
          <div className="w-10 h-10 rounded-sm flex items-center justify-center text-[#70737A] bg-[#1A1D23] group-hover:text-[#2F80FF] group-hover:bg-[#20242C] transition-colors mt-1">
            <LayoutGrid className="w-5 h-5" />
          </div>

          <div className="mt-2.5">
            <div className="text-xs font-bold text-[#A7A9AD] group-hover:text-[#F5F5F5] transition-colors leading-tight">
              All Desks
            </div>
            <div className="text-[10px] text-[#70737A] font-mono mt-0.5 leading-tight">
              +18 More
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
