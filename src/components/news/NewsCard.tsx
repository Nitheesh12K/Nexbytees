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
        "group relative flex flex-col justify-between rounded-md overflow-hidden border transition-all duration-200",
        "bg-[#111317] hover:bg-[#15171B]",
        "border-[#202328] hover:border-[#2C3038]"
      )}
    >
      {/* Top Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#08090B]">
        <img
          src={news.imageUrl}
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDomain?.(news.domain);
            }}
            className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#08090B]/90 text-[#2F80FF] border border-[#202328] hover:border-[#2F80FF] transition-colors"
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

        {/* Trending score */}
        {news.trendingScore && (
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#08090B]/85 text-[#A7A9AD] border border-[#202328]">
            <Flame className="w-3 h-3 text-[#2F80FF]" />
            <span>{news.trendingScore}</span>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenArticle(news)}
            className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {news.title}
          </h3>

          <p className="mt-2 text-xs text-[#A7A9AD] line-clamp-2 leading-relaxed">
            {news.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#202328] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#70737A] font-mono">
            <span className="truncate max-w-[130px] text-[#A7A9AD] font-sans font-medium">
              {news.source}
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{news.publishedAt}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenArticle(news)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F80FF] hover:text-[#70A6FF] transition-colors group/readmore"
            >
              <span>Read Full Dispatch</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/readmore:translate-x-0.5 group-hover/readmore:-translate-y-0.5 transition-transform duration-200" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(news.id);
                }}
                aria-label="Bookmark"
                className={cn(
                  "p-1.5 rounded border transition-colors",
                  isBookmarked
                    ? "bg-[#2F80FF]/15 border-[#2F80FF] text-[#2F80FF]"
                    : "bg-[#08090B] border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038]"
                )}
              >
                <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-[#2F80FF]")} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(news);
                }}
                aria-label="Share"
                className="p-1.5 rounded bg-[#08090B] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038] transition-colors"
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
