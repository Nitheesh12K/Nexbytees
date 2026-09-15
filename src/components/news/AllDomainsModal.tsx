"use client";

import React, { useState } from "react";
import { TECHNOLOGY_DOMAINS } from "@/data/domains";
import { DomainMeta } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, LayoutGrid, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface AllDomainsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDomain: (domain: string) => void;
  selectedDomain: string | null;
}

export const AllDomainsModal: React.FC<AllDomainsModalProps> = ({
  isOpen,
  onClose,
  onSelectDomain,
  selectedDomain,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = TECHNOLOGY_DOMAINS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-4xl bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10 overflow-hidden text-[#F5F5F5] max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#202328] flex items-center justify-between bg-[#0E1013]">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 bg-[#2F80FF] rounded-sm" />
            <h2 className="text-base font-bold text-[#F5F5F5] uppercase tracking-tight font-mono">
              ALL 25 REPORTING DESKS & DOMAINS
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3.5 border-b border-[#202328] bg-[#0B0D10]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#70737A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reporting desks (e.g. AI, Quantum, Robotics, Space)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] placeholder-[#70737A] focus:outline-none focus:border-[#2F80FF] font-sans"
            />
          </div>
        </div>

        {/* Domains Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((dom) => {
            const Icon =
              ((LucideIcons as unknown) as Record<string, React.ElementType>)[
                dom.iconName
              ] || LucideIcons.Cpu;
            const isSelected = selectedDomain === dom.name;

            return (
              <div
                key={dom.name}
                onClick={() => {
                  onSelectDomain(dom.name);
                  onClose();
                }}
                className={cn(
                  "p-4 rounded-md border transition-colors cursor-pointer flex flex-col justify-between group",
                  isSelected
                    ? "bg-[#15171B] border-[#2F80FF]"
                    : "bg-[#111317] border-[#202328] hover:border-[#2C3038] hover:bg-[#15171B]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-md bg-[#0E1013] border border-[#202328] flex items-center justify-center text-[#2F80FF]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0E1013] border border-[#202328] text-[#70737A]">
                      {dom.shortCode}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] uppercase transition-colors">
                    {dom.name}
                  </h3>

                  <p className="text-[11px] text-[#A7A9AD] mt-1 line-clamp-2 leading-relaxed font-sans">
                    {dom.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#202328] flex items-center justify-between text-[10px] font-mono text-[#70737A]">
                  <span>{dom.articleCount} Dispatches</span>
                  <span className="text-[#2F80FF] group-hover:underline flex items-center gap-0.5">
                    Filter &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
