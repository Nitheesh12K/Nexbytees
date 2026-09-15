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
    <section id="latest" className="py-10 px-4 md:px-8 max-w-7xl mx-auto border-b border-[#202328]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Latest Stories (8 cols) */}
        <div className="lg:col-span-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#202328] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#2F80FF] rounded-sm flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[#F5F5F5] uppercase">
                  LATEST DISPATCHES · CHRONOLOGICAL FEED
                </h2>
              </div>
              <p className="text-xs text-[#70737A] mt-1 font-mono">
                VERIFIED REPORTS &amp; INVESTIGATIVE WIRE
              </p>
            </div>

            {/* Filter Tabs: All / Trending / Latest */}
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#111317] border border-[#202328] text-xs self-start sm:self-auto">
              <button
                onClick={() => onFilterModeChange("all")}
                className={cn(
                  "px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors",
                  filterMode === "all"
                    ? "bg-[#15171B] text-[#F5F5F5] border border-[#282B32] font-semibold"
                    : "text-[#70737A] hover:text-[#F5F5F5]"
                )}
              >
                All
              </button>
              <button
                onClick={() => onFilterModeChange("trending")}
                className={cn(
                  "px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors",
                  filterMode === "trending"
                    ? "bg-[#15171B] text-[#F5F5F5] border border-[#282B32] font-semibold"
                    : "text-[#70737A] hover:text-[#F5F5F5]"
                )}
              >
                Trending
              </button>
              <button
                onClick={() => onFilterModeChange("latest")}
                className={cn(
                  "px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors",
                  filterMode === "latest"
                    ? "bg-[#15171B] text-[#F5F5F5] border border-[#282B32] font-semibold"
                    : "text-[#70737A] hover:text-[#F5F5F5]"
                )}
              >
                Latest
              </button>
            </div>
          </div>

          {/* 2-Column Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gridStories.map((story) => {
              const isSaved = bookmarkedIds.includes(story.id);

              return (
                <article
                  key={story.id}
                  onClick={() => onOpenArticle(story)}
                  className="rounded-md overflow-hidden border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#08090B]">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent opacity-60" />

                    {/* Top actions overlay */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDomain(story.domain);
                        }}
                        className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#08090B]/90 text-[#2F80FF] border border-[#202328] hover:border-[#2F80FF] transition-colors"
                      >
                        {story.domain}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(story.id);
                        }}
                        className="p-1 rounded bg-[#08090B]/80 backdrop-blur-sm border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors"
                        aria-label="Save story"
                      >
                        <Bookmark
                          className={cn("w-3.5 h-3.5", isSaved && "text-[#2F80FF] fill-[#2F80FF]")}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h3>

                      <p className="mt-2 text-xs text-[#A7A9AD] line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-[#202328] flex items-center justify-between text-[11px] font-mono text-[#70737A]">
                      <span className="font-sans font-medium text-[#A7A9AD] truncate max-w-[120px]">
                        {story.source}
                      </span>

                      <div className="flex items-center gap-2">
                        <span>{story.publishedAt}</span>
                        {onShare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(story);
                            }}
                            className="text-[#70737A] hover:text-[#F5F5F5] transition-colors p-1"
                            aria-label="Share story"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2F80FF] text-xs font-mono uppercase tracking-wider text-[#F5F5F5] transition-colors"
              >
                <span>Load More Coverage ({displayedStories.length - visibleCount} remaining)</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#2F80FF]" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Community Wire & Topic Desks (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Community Dispatch Card */}
          <div className="rounded-md p-6 border border-[#202328] bg-[#111317]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#2F80FF] uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNITY WIRE</span>
            </div>

            <h3 className="text-base font-bold text-[#F5F5F5] tracking-tight">
              Publish Your Technology Dispatch
            </h3>
            <p className="text-xs text-[#A7A9AD] mt-1.5 leading-relaxed">
              Have breaking technology research, product discoveries, or security analysis? Submit to the global NEXBYTEES network.
            </p>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="w-full mt-5 py-2.5 px-4 rounded-md bg-[#2F80FF] hover:bg-[#1A6BE6] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit A Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Editorial standard notice */}
            <div className="mt-4 pt-3.5 border-t border-[#202328] text-[11px] text-[#70737A] font-mono leading-relaxed">
              Submissions are indexed across our global reporting desk and shared with our verified technology community.
            </div>
          </div>

          {/* 2. Topic Tags Card */}
          <div className="rounded-md p-6 border border-[#202328] bg-[#111317]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#202328]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F5]">
                INDEXED TOPICS
              </h3>
              <span className="text-[10px] font-mono text-[#70737A]">KEYWORD TAGS</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TOP_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(tag.replace("#", ""))}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-[#08090B] border border-[#202328] hover:border-[#2F80FF] text-[#A7A9AD] hover:text-[#F5F5F5] transition-colors"
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
