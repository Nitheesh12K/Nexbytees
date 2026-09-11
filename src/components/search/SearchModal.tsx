"use client";

import React, { useState, useEffect, useRef } from "react";
import { NewsItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, Flame, Clock, Hash } from "lucide-react";
import { TrendingBadge } from "../ui/Badge";
import { cn } from "@/lib/utils";

import { getNewsApi, mapBackendArticleToNewsItem } from "@/lib/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: NewsItem[];
  onOpenArticle: (news: NewsItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stories,
  onOpenArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [backendResults, setBackendResults] = useState<NewsItem[]>([]);
  const [isSearchingBackend, setIsSearchingBackend] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
      setBackendResults([]);
    }
  }, [isOpen]);

  const query = searchTerm.toLowerCase().trim();

  // Debounced backend search - always called unconditionally
  useEffect(() => {
    if (!isOpen || !query || query.length < 2) {
      setBackendResults([]);
      setIsSearchingBackend(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingBackend(true);
      try {
        const res = await getNewsApi({ search: query, limit: 10 });
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBackendArticleToNewsItem);
          setBackendResults(mapped);
        }
      } catch {
        // Fallback to local
      } finally {
        setIsSearchingBackend(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Return early ONLY after all hooks have been declared and called
  if (!isOpen) return null;

  // Combine local and backend results, deduplicated by ID
  const localResults = query
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.summary.toLowerCase().includes(query) ||
          s.domain.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query)) ||
          s.source.toLowerCase().includes(query)
      )
    : [];

  const combinedMap = new Map<string, NewsItem>();
  localResults.forEach((s) => combinedMap.set(s.id, s));
  backendResults.forEach((s) => combinedMap.set(s.id, s));
  const results = Array.from(combinedMap.values());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Search Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl bg-[#091124] border border-slate-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-10 text-slate-100"
      >
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-sky-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search headlines, domains, tags, or sources..."
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-slate-400 hover:text-white mr-2 text-xs font-mono"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggested Tags */}
        {!query && (
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/30">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2.5">
              Popular Search Filters
            </div>
            <div className="flex flex-wrap gap-2">
              {["Agentic AI", "Humanoid", "Quantum", "Semiconductors", "M4 Ultra", "Superconductor"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-300 hover:border-sky-500/40 transition-colors"
                  >
                    <Hash className="w-3 h-3 text-sky-400" />
                    <span>{term}</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2.5">
          {isSearchingBackend && results.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Querying live intelligence database...</span>
            </div>
          )}

          {!isSearchingBackend && query && results.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No matching coverage found for &ldquo;{searchTerm}&rdquo;. Try another technical keyword.
            </div>
          )}

          {results.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                onOpenArticle(story);
                onClose();
              }}
              className="group p-3.5 rounded-xl border border-slate-800/80 bg-[#0c1630]/60 hover:bg-slate-900 hover:border-sky-500/40 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-800"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                      {story.domain}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {story.source}
                    </span>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {story.summary}
                  </p>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Live filter across headlines, tags & domains</span>
          <span>{results.length > 0 ? `${results.length} results found` : "Type to filter"}</span>
        </div>
      </motion.div>
    </div>
  );
};
