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
        initial={{ opacity: 0, scale: 0.98, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        className="relative w-full max-w-2xl bg-[#111317] border border-[#202328] rounded-md shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-[#F5F5F5]"
      >
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#202328] bg-[#0B0D10]">
          <Search className="w-4 h-4 text-[#2F80FF] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dispatches, domains, research topics, or sources..."
            className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#70737A] focus:outline-none font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#70737A] hover:text-[#F5F5F5] mr-2 text-xs font-mono"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#15171B] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggested Tags */}
        {!query && (
          <div className="p-4 border-b border-[#202328] bg-[#0B0D10]/50">
            <div className="text-[10px] font-mono text-[#70737A] uppercase tracking-wider mb-2">
              Popular Search Filters
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Agentic AI", "Humanoid", "Quantum", "Semiconductors", "M4 Ultra", "Superconductor"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-[#15171B] border border-[#202328] text-[#A7A9AD] hover:text-[#2F80FF] hover:border-[#2F80FF] transition-colors"
                  >
                    <Hash className="w-3 h-3 text-[#2F80FF]" />
                    <span>{term}</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {isSearchingBackend && results.length === 0 && (
            <div className="py-12 text-center text-[#70737A] text-xs font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F80FF] animate-ping" />
              <span>Querying live intelligence database...</span>
            </div>
          )}

          {!isSearchingBackend && query && results.length === 0 && (
            <div className="py-12 text-center text-[#70737A] text-xs font-mono">
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
              className="group p-3 rounded-md border border-[#202328] bg-[#0B0D10] hover:bg-[#15171B] hover:border-[#2C3038] transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-12 h-12 rounded-sm object-cover shrink-0 border border-[#202328]"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2F80FF]">
                      {story.domain}
                    </span>
                    <span className="text-[#70737A] text-xs">•</span>
                    <span className="text-[10px] font-mono text-[#70737A]">
                      {story.source}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors truncate">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-[#70737A] truncate mt-0.5">
                    {story.summary}
                  </p>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-[#70737A] group-hover:text-[#2F80FF] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0B0D10] border-t border-[#202328] flex items-center justify-between text-[11px] font-mono text-[#70737A]">
          <span>Live filter across headlines, tags &amp; domains</span>
          <span>{results.length > 0 ? `${results.length} dispatches found` : "Type to filter"}</span>
        </div>
      </motion.div>
    </div>
  );
};
