"use client";

import React, { useState } from "react";
import { NewsItem, FilterMode } from "@/types";
import {
  BookOpen,
  ArrowRight,
  Bookmark,
  UploadCloud,
  Hash,
  Sparkles,
  Share2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LatestWithSidebarProps {
  stories: NewsItem[];
  bookmarkedIds: string[];
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  onOpenArticle: (news: NewsItem) => void;
  onToggleBookmark: (id: string) => void;
  onOpenUpload: () => void;
  onSelectTag: (tag: string) => void;
  onSelectDomain: (domain: string) => void;
  onShare?: (news: NewsItem) => void;
}

export const LatestWithSidebar: React.FC<LatestWithSidebarProps> = ({
  stories,
  bookmarkedIds,
  filterMode,
  onFilterModeChange,
  onOpenArticle,
  onToggleBookmark,
  onOpenUpload,
  onSelectTag,
  onSelectDomain,
  onShare,
}) => {
  // Prioritize user submissions first, then default to the 6 stories from screenshot
  let displayedStories = [...stories];
  if (filterMode === "trending") {
    displayedStories = displayedStories.sort((a, b) => b.trendingScore - a.trendingScore);
  } else if (filterMode === "latest") {
    displayedStories = displayedStories.reverse();
  } else {
    // Default 'all': User submissions first, then exact 6 latest stories from screenshot
    const communityStories = displayedStories.filter((s) => s.isCommunitySubmission);
    const regularStories = displayedStories.filter((s) => !s.isCommunitySubmission);
    
    // Sort regular stories so the 6 from the screenshot are first
    const preferredIds = [
      "nb-apple-vision",
      "nb-tesla-fsd",
      "nb-aws-infra",
      "nb-ai-agents-tasks",
      "nb-satellite-network",
      "nb-cyber-ai-threats",
    ];
    regularStories.sort((a, b) => {
      const idxA = preferredIds.indexOf(a.id);
      const idxB = preferredIds.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    displayedStories = [...communityStories, ...regularStories];
  }

  // Show stories in 2-column grid with pagination support
  const [visibleCount, setVisibleCount] = useState(6);
  const gridStories = displayedStories.slice(0, visibleCount);
  const hasMore = displayedStories.length > visibleCount;

  const TOP_TAGS = [
    "#AI",
    "#Robotics",
    "#Quantum",
    "#Cybersecurity",
    "#Space",
    "#NVIDIA",
    "#Apple",
    "#Google",
    "#Microsoft",
    "#OpenSource",
  ];

  return (
    <section id="latest" className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Latest Stories (8 cols) */}
        <div className="lg:col-span-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Latest Stories
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Fresh perspectives. Real impact.
              </p>
            </div>

            {/* Filter Pills: All / Trending / Latest */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#081022] border border-slate-800 text-xs self-start sm:self-auto">
              <button
                onClick={() => onFilterModeChange("all")}
                className={cn(
                  "px-3.5 py-1 rounded-full font-medium transition-all",
                  filterMode === "all"
                    ? "bg-sky-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                All
              </button>
              <button
                onClick={() => onFilterModeChange("trending")}
                className={cn(
                  "px-3.5 py-1 rounded-full font-medium transition-all",
                  filterMode === "trending"
                    ? "bg-sky-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Trending
              </button>
              <button
                onClick={() => onFilterModeChange("latest")}
                className={cn(
                  "px-3.5 py-1 rounded-full font-medium transition-all",
                  filterMode === "latest"
                    ? "bg-sky-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Latest
              </button>
              <span className="text-slate-500 px-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* 2-Column Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gridStories.map((story) => {
              const isSaved = bookmarkedIds.includes(story.id);

              return (
                <div
                  key={story.id}
                  onClick={() => onOpenArticle(story)}
                  className="rounded-2xl overflow-hidden border border-slate-800/80 bg-[#091124]/90 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                >
                  {/* Thumbnail with top-right bookmark */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-950">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-80" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(story.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors z-10"
                      aria-label="Save story"
                    >
                      <Bookmark
                        className={cn("w-3.5 h-3.5", isSaved && "text-sky-400 fill-sky-400")}
                      />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDomain(story.domain);
                        }}
                        className="text-[11px] font-mono text-sky-400 hover:underline uppercase tracking-wider font-semibold"
                      >
                        {story.domain}
                      </button>

                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mt-1.5 line-clamp-2 leading-snug">
                        {story.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    {/* Card Footer: Source & Bookmark/Share */}
                    <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="font-sans font-medium text-slate-300">
                        {story.source}
                      </span>

                      <div className="flex items-center gap-1">
                        {onShare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(story);
                            }}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            aria-label="Share story"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(story.id);
                          }}
                          className="text-slate-400 hover:text-white transition-colors p-1"
                          aria-label="Save story"
                        >
                          <Bookmark
                            className={cn("w-3.5 h-3.5", isSaved && "text-sky-400 fill-sky-400")}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-800 bg-[#091124] hover:border-sky-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-sky-500/10"
              >
                <span>Show More Stories ({displayedStories.length - visibleCount} remaining)</span>
                <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Community Card & Top Tags (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Join the Tech Community Card */}
          <div className="relative rounded-2xl p-6 border border-sky-500/30 bg-gradient-to-b from-[#091530] to-[#040816] overflow-hidden shadow-2xl">
            {/* Background glowing Earth horizon graphic in bottom corner */}
            <div className="absolute -bottom-14 -right-14 w-48 h-48 rounded-full bg-sky-500/20 blur-2xl pointer-events-none" />
            <div
              className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full border border-sky-400/40 bg-gradient-to-tr from-sky-400/30 to-transparent pointer-events-none"
              style={{
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)",
              }}
            />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Join the Tech Community
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                Share technology news with the world.
              </p>

              {/* Upload Button */}
              <button
                onClick={onOpenUpload}
                className="w-full mt-5 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.01]"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Your Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quote */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 italic font-sans leading-relaxed">
                “Great ideas can come from anywhere. Share what you discover.”
              </div>
            </div>
          </div>

          {/* 2. Top Tags Card */}
          <div className="rounded-2xl p-6 border border-slate-800/80 bg-[#070e20]/90 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-1.5">
              <span>Top Tags</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {TOP_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(tag.replace("#", ""))}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-[#0c1630] border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
