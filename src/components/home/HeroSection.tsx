"use client";

import React from "react";
import { NewsItem } from "@/types";
import { MOCK_NEWS_STORIES } from "@/data/mockNews";
import { HeroGlobe3D } from "../3d/HeroGlobe3D";
import { ArrowUpRight, Bookmark, Clock, Flame, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  leadStory?: NewsItem;
  secondaryStories?: NewsItem[];
  onOpenArticle?: (story: NewsItem) => void;
  onExploreTrending: () => void;
  onExploreDomains: () => void;
  onSelectDomain: (domain: string) => void;
  onToggleBookmark?: (id: string) => void;
  bookmarkedIds?: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadStory,
  secondaryStories,
  onOpenArticle,
  onExploreTrending,
  onExploreDomains,
  onSelectDomain,
  onToggleBookmark,
  bookmarkedIds = [],
}) => {
  // Use provided stories or default to mock editorial dispatches
  const lead = leadStory || MOCK_NEWS_STORIES[0];
  const secondary =
    secondaryStories && secondaryStories.length >= 2
      ? secondaryStories
      : MOCK_NEWS_STORIES.slice(1, 3);

  const isLeadBookmarked = bookmarkedIds.includes(lead.id);

  return (
    <section className="relative w-full border-b border-[#202328] bg-[#08090B] py-8 lg:py-12">
      {/* Editorial Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Editorial Front Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: 1 Dominant Lead Story (7 cols / ~60%) */}
          <article className="lg:col-span-7 flex flex-col justify-between">
            {/* Lead Story Image Container */}
            <div
              onClick={() => onOpenArticle?.(lead)}
              className="group relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden rounded-md border border-[#202328] bg-[#111317] cursor-pointer"
            >
              <img
                src={lead.imageUrl}
                alt={lead.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-transparent opacity-70" />

              {/* Badges overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-[#08090B]/90 border border-[#202328] text-[#2F80FF]">
                  COVER STORY
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#111317]/90 text-[#A7A9AD] border border-[#202328]">
                  {lead.domain}
                </span>
              </div>

              {lead.trendingScore && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[#08090B]/85 border border-[#202328] text-[10px] font-mono text-[#A7A9AD]">
                  <Flame className="w-3.5 h-3.5 text-[#2F80FF]" />
                  <span>VIRAL SCORE {lead.trendingScore}</span>
                </div>
              )}
            </div>

            {/* Lead Story Editorial Typography */}
            <div className="mt-5 flex flex-col">
              {/* Category Kicker */}
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#2F80FF] uppercase font-semibold">
                <span>{lead.domain}</span>
                <span className="text-[#70737A]">•</span>
                <span className="text-[#A7A9AD]">IN-DEPTH DISPATCH</span>
              </div>

              {/* Main Headline */}
              <h1
                onClick={() => onOpenArticle?.(lead)}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5F5] hover:text-[#2F80FF] transition-colors leading-[1.15] tracking-tight mt-2.5 cursor-pointer font-sans"
              >
                {lead.title}
              </h1>

              {/* Excerpt */}
              <p className="text-sm md:text-base text-[#A7A9AD] leading-relaxed mt-3 font-normal line-clamp-3">
                {lead.summary}
              </p>

              {/* Byline / Source / Timestamp & Action Strip */}
              <div className="mt-5 pt-4 border-t border-[#202328] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#70737A]">
                <div className="flex items-center gap-3">
                  <span className="font-sans font-semibold text-[#F5F5F5]">
                    By {lead.author || "Editorial Staff"}
                  </span>
                  <span>•</span>
                  <span className="text-[#2F80FF]">{lead.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#70737A]" />
                    {lead.publishedAt}
                  </span>
                  <span>•</span>
                  <span>{lead.readTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  {onToggleBookmark && (
                    <button
                      onClick={() => onToggleBookmark(lead.id)}
                      className={cn(
                        "p-1.5 rounded border border-[#202328] bg-[#111317] hover:border-[#2F80FF] transition-colors",
                        isLeadBookmarked ? "text-[#2F80FF]" : "text-[#70737A] hover:text-[#F5F5F5]"
                      )}
                      aria-label="Save story"
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", isLeadBookmarked && "fill-[#2F80FF]")} />
                    </button>
                  )}

                  <button
                    onClick={() => onOpenArticle?.(lead)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F80FF] hover:text-[#70A6FF] transition-colors"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Right Column: 2 Secondary Stories + Signature 3D Earth Widget (5 cols / ~40%) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header for Supporting Dispatches */}
            <div className="flex items-center justify-between pb-2 border-b border-[#202328]">
              <span className="text-xs font-mono font-bold tracking-widest text-[#F5F5F5] uppercase">
                SPOTLIGHT COVERAGE
              </span>
              <button
                onClick={onExploreTrending}
                className="text-[11px] font-mono text-[#2F80FF] hover:underline uppercase"
              >
                View Trending &rarr;
              </button>
            </div>

            {/* Secondary Stories Stack */}
            <div className="flex flex-col gap-4">
              {secondary.map((story) => {
                const isStorySaved = bookmarkedIds.includes(story.id);

                return (
                  <div
                    key={story.id}
                    onClick={() => onOpenArticle?.(story)}
                    className="group p-3.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] transition-all duration-200 cursor-pointer flex gap-4 items-start"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 sm:w-28 aspect-[4/3] rounded-sm overflow-hidden border border-[#202328] shrink-0 bg-[#08090B]">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#2F80FF] uppercase">
                          <span>{story.domain}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors leading-snug line-clamp-2 mt-1">
                          {story.title}
                        </h3>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-[#70737A]">
                        <span className="truncate max-w-[120px]">{story.source}</span>
                        <span>{story.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signature 3D Earth Telemetry Module (Sole 3D Element) */}
            <div className="relative rounded-md border border-[#202328] bg-[#111317] p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#202328]">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#2F80FF]" />
                  <span className="text-xs font-mono font-bold tracking-wider text-[#F5F5F5] uppercase">
                    GLOBAL TECH RADAR
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>25+ DOMAINS LIVE</span>
                </div>
              </div>

              <div className="relative w-full h-[300px] sm:h-[340px] flex items-center justify-center overflow-hidden rounded bg-[#08090B] border border-[#1A1D23]">
                <HeroGlobe3D onSelectDomain={onSelectDomain} />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#70737A]">
                <span>Rotate globe to explore global tech hubs</span>
                <button
                  onClick={onExploreDomains}
                  className="text-[#2F80FF] hover:underline"
                >
                  Browse Directory &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
