"use client";

import React from "react";
import { NewsItem, FilterMode } from "@/types";
import { NewsCard } from "./NewsCard";
import { Newspaper, Sparkles, FilterX } from "lucide-react";

interface NewsGridProps {
  stories: NewsItem[];
  bookmarkedIds: string[];
  selectedDomain: string | null;
  filterMode: FilterMode;
  searchQuery: string;
  onToggleBookmark: (id: string) => void;
  onOpenArticle: (news: NewsItem) => void;
  onShare: (news: NewsItem) => void;
  onResetFilters: () => void;
  onSelectDomain?: (domain: string) => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  stories,
  bookmarkedIds,
  selectedDomain,
  filterMode,
  searchQuery,
  onToggleBookmark,
  onOpenArticle,
  onShare,
  onResetFilters,
  onSelectDomain,
}) => {
  // Apply filtering logic
  let filtered = [...stories];

  // Domain filter
  if (selectedDomain) {
    filtered = filtered.filter((s) => s.domain.toLowerCase() === selectedDomain.toLowerCase());
  }

  // Filter mode
  if (filterMode === "trending") {
    filtered = filtered.sort((a, b) => b.trendingScore - a.trendingScore);
  } else if (filterMode === "latest") {
    // mock chronological sort based on ID or index
    filtered = filtered.reverse();
  }

  // Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.source.toLowerCase().includes(q)
    );
  }

  return (
    <section id="feed" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" />
            <span>Curated Intelligence Wire</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>
              {selectedDomain
                ? `${selectedDomain} Coverage`
                : filterMode === "trending"
                ? "Trending Dispatches"
                : filterMode === "latest"
                ? "Latest Wire Updates"
                : "Comprehensive Editorial Feed"}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {filtered.length} {filtered.length === 1 ? "story" : "stories"}
            </span>
          </h2>
        </div>

        {/* Active Filters indicator */}
        {(selectedDomain || searchQuery || filterMode !== "all") && (
          <button
            onClick={onResetFilters}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-[#070d1e]/50 backdrop-blur-md">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No stories match your criteria</h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your search query or selecting a different technology domain to explore our coverage.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              isBookmarked={bookmarkedIds.includes(news.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenArticle={onOpenArticle}
              onShare={onShare}
              onSelectDomain={onSelectDomain}
            />
          ))}
        </div>
      )}
    </section>
  );
};
