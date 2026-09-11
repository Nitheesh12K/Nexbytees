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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#091124] border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden text-slate-100 max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              All 25 Technology Domains
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-[#070d1e]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search domains (e.g. AI, Quantum, Robotics, Space)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>
        </div>

        {/* Domains Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  "p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group",
                  isSelected
                    ? "bg-sky-500/15 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    : "bg-[#0c1630]/70 border-slate-800 hover:border-sky-500/40 hover:bg-[#0c1630]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {dom.shortCode}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-sky-300">
                    {dom.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dom.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{dom.articleCount} Stories</span>
                  <span className="text-sky-400 group-hover:underline flex items-center gap-0.5">
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
