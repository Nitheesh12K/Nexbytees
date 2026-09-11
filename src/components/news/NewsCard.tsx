"use client";

import React from "react";
import { NewsItem } from "@/types";
import { Bookmark, Share2, Clock, ArrowUpRight, Flame } from "lucide-react";
import { TrendingBadge, CommunityBadge } from "../ui/Badge";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  news: NewsItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenArticle: (news: NewsItem) => void;
  onShare: (news: NewsItem) => void;
  onSelectDomain?: (domain: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  isBookmarked,
  onToggleBookmark,
  onOpenArticle,
  onShare,
  onSelectDomain,
}) => {
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl overflow-hidden border transition-all duration-400",
        "bg-gradient-to-b from-[#08101f] via-[#050b18] to-[#020710]",
        "border-white/6 hover:border-white/12",
        "shadow-[0_4px_24px_rgba(0,0,0,0.8)]",
        "hover:shadow-[0_24px_48px_rgba(0,0,0,0.95),0_0_0_1px_rgba(56,189,248,0.08)]",
        "hover:-translate-y-1.5"
      )}
    >
      {/* Top Image */}
      <div className="relative w-full h-48 overflow-hidden bg-black">
        <img
          src={news.imageUrl}
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
        />
        {/* Stronger bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08101f]/95 via-black/25 to-transparent" />

        {/* Subtle top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDomain?.(news.domain);
            }}
            className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-sky-300/90 border border-sky-400/20 hover:bg-sky-500/15 hover:border-sky-400/40 transition-all duration-200 tracking-[0.12em]"
          >
            {news.domain}
          </button>

          <div className="flex items-center gap-1.5">
            {news.isCommunitySubmission ? (
              <CommunityBadge />
            ) : (
              <TrendingBadge type={news.trendingBadge || null} />
            )}
          </div>
        </div>

        {/* Trending score — bottom right of image */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white/50 border border-white/8">
          <Flame className="w-3 h-3 text-rose-400/80" />
          <span>{news.trendingScore}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenArticle(news)}
            className="text-base font-extrabold text-white/90 group-hover:text-white transition-colors cursor-pointer leading-snug tracking-tight line-clamp-2"
          >
            {news.title}
          </h3>

          <p className="mt-2.5 text-xs md:text-sm text-white/38 line-clamp-2 leading-relaxed">
            {news.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-white/35 font-mono">
            <span className="truncate max-w-[140px] text-white/55 font-sans font-medium">
              {news.source}
            </span>
            <div className="flex items-center gap-1.5 text-white/25">
              <Clock className="w-3.5 h-3.5" />
              <span>{news.publishedAt}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenArticle(news)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400/80 hover:text-sky-300 transition-colors group/readmore"
            >
              <span>Read More</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/readmore:translate-x-0.5 group-hover/readmore:-translate-y-0.5 transition-transform duration-200" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(news.id);
                }}
                aria-label="Bookmark"
                className={cn(
                  "p-1.5 rounded-lg border transition-all duration-200",
                  isBookmarked
                    ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                    : "bg-white/4 border-white/8 text-white/35 hover:text-white/70 hover:border-white/15"
                )}
              >
                <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-sky-400")} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(news);
                }}
                aria-label="Share"
                className="p-1.5 rounded-lg bg-white/4 border border-white/8 text-white/35 hover:text-white/70 hover:border-white/15 transition-all duration-200"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
