"use client";

import React, { useRef } from "react";
import { NewsItem } from "@/types";
import { ArrowRight, Bookmark, Share2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingCarouselProps {
  stories: NewsItem[];
  onOpenArticle: (news: NewsItem) => void;
  onSelectDomain: (domain: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onViewAllTrending: () => void;
  onShare?: (news: NewsItem) => void;
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({
  stories,
  onOpenArticle,
  onSelectDomain,
  bookmarkedIds,
  onToggleBookmark,
  onViewAllTrending,
  onShare,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingList = stories.slice(0, 5);

  return (
    <section id="trending" className="py-10 px-4 md:px-8 max-w-7xl mx-auto border-b border-[#202328]">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#202328]">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-[#2F80FF] rounded-sm flex-shrink-0" />
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#2F80FF]" />
            <h2 className="text-base sm:text-lg font-black tracking-tight text-[#F5F5F5] uppercase">
              TRENDING DISPATCHES · MOST READ
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#70737A]">
            (TOP 5 RANKED ACROSS THE WIRE)
          </span>
        </div>

        <button
          onClick={onViewAllTrending}
          className="flex items-center gap-1.5 text-xs font-mono text-[#2F80FF] hover:text-[#70A6FF] transition-colors"
        >
          <span>ALL TRENDING</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Numbered Editorial Ranking Strip */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-[#202328] overflow-x-auto"
      >
        {trendingList.map((story, index) => {
          const isSaved = bookmarkedIds.includes(story.id);
          const rank = `0${index + 1}`;

          return (
            <div
              key={story.id}
              onClick={() => onOpenArticle(story)}
              className={cn(
                "group relative p-4 flex flex-col justify-between cursor-pointer rounded-md lg:rounded-none transition-all duration-200",
                "bg-[#111317] lg:bg-transparent hover:bg-[#15171B]",
                "border border-[#202328] lg:border-none"
              )}
            >
              <div>
                {/* Number & Domain Kicker */}
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#70737A] group-hover:text-[#2F80FF] transition-colors">
                    {rank}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDomain(story.domain);
                    }}
                    className="text-[10px] font-mono text-[#2F80FF] hover:underline uppercase tracking-wider"
                  >
                    {story.domain}
                  </button>
                </div>

                {/* Compact Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm border border-[#202328] mb-3 bg-[#08090B]">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {story.trendingScore && (
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#08090B]/90 border border-[#202328] text-[9px] font-mono text-[#A7A9AD]">
                      +{story.trendingScore}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors line-clamp-3 leading-snug">
                  {story.title}
                </h3>
              </div>

              {/* Metadata & Actions */}
              <div className="mt-4 pt-3 border-t border-[#202328] flex items-center justify-between text-[11px] font-mono text-[#70737A]">
                <div className="truncate max-w-[100px] text-[#A7A9AD]">
                  {story.source}
                </div>

                <div className="flex items-center gap-1.5">
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(story);
                      }}
                      className="text-[#70737A] hover:text-[#F5F5F5] p-1 transition-colors"
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
                    className={cn(
                      "p-1 transition-colors",
                      isSaved ? "text-[#2F80FF]" : "text-[#70737A] hover:text-[#F5F5F5]"
                    )}
                    aria-label="Save story"
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-[#2F80FF]")} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
