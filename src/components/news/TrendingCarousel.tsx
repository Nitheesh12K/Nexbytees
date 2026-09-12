"use client";

import React, { useRef } from "react";
import { NewsItem } from "@/types";
import { TrendingBadge } from "../ui/Badge";
import { Flame, ArrowRight, ChevronRight, Bookmark, Share2 } from "lucide-react";
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

  const handleScrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section id="trending" className="py-12 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-3">
            {/* Brand accent line */}
            <div className="w-1 h-6 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)] flex-shrink-0" />
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Trending Now
              </h2>
            </div>
          </div>
          <p className="text-xs md:text-sm text-white/35 mt-1.5 ml-4">
            The most discussed stories across the tech world.
          </p>
        </div>

        <button
          onClick={onViewAllTrending}
          className="flex items-center gap-1 text-xs font-semibold text-sky-400/80 hover:text-sky-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trendingList.map((story) => {
            const isSaved = bookmarkedIds.includes(story.id);

            return (
              <div
                key={story.id}
                onClick={() => onOpenArticle(story)}
                className={cn(
                  "snap-start shrink-0 w-[290px] sm:w-[310px] md:w-[320px]",
                  "rounded-2xl overflow-hidden cursor-pointer group",
                  "bg-gradient-to-b from-[#0a1220] via-[#050c1a] to-[#020710]",
                  "border border-white/6 hover:border-white/12 transition-all duration-400",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.8)]",
                  "hover:shadow-[0_20px_40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(56,189,248,0.1)]",
                  "hover:-translate-y-1"
                )}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 overflow-hidden bg-black">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220]/95 via-black/20 to-black/25 opacity-85" />

                  {story.trendingBadge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <TrendingBadge type={story.trendingBadge} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-snug tracking-tight">
                      {story.title}
                    </h3>
                    <p className="mt-2 text-xs text-white/35 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-white/30">
                      <span className="font-sans font-medium text-white/50">
                        {story.source}
                      </span>
                      <span>•</span>
                      <span>{story.publishedAt}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {onShare && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(story);
                          }}
                          className="text-white/30 hover:text-white/70 transition-colors p-1"
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
                          "transition-colors p-1",
                          isSaved ? "text-sky-400" : "text-white/30 hover:text-white/70"
                        )}
                        aria-label="Save story"
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-sky-400")} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-black/90 border border-white/12 text-white/60 flex items-center justify-center shadow-xl hover:bg-sky-500 hover:text-slate-950 hover:border-sky-500 transition-all duration-300 z-20"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
