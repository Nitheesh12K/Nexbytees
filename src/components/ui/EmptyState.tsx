"use client";

import React from "react";
import { Bookmark, Search, UploadCloud, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "saved" | "search" | "uploads";
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  const configs = {
    saved: {
      icon: Bookmark,
      defaultTitle: "NO SAVED STORIES YET",
      defaultDesc: "Save technology stories to find them here later.",
      defaultAction: "Explore Trending Stories",
    },
    search: {
      icon: Search,
      defaultTitle: "NO STORIES FOUND",
      defaultDesc: "Try another keyword or technology domain.",
      defaultAction: "Reset Search",
    },
    uploads: {
      icon: UploadCloud,
      defaultTitle: "YOU HAVEN’T PUBLISHED ANY STORIES YET.",
      defaultDesc: "Share emerging breakthroughs or engineering updates with the NEXBYTEES community.",
      defaultAction: "Submit Your First Story",
    },
  };

  const current = configs[type];
  const Icon = current.icon;
  const displayTitle = title || current.defaultTitle;
  const displayDesc = description || current.defaultDesc;
  const displayAction = actionText || current.defaultAction;

  return (
    <div
      className={cn(
        "py-16 px-6 text-center rounded-2xl border border-dashed border-slate-800/80 bg-[#070e20]/40 backdrop-blur-md flex flex-col items-center justify-center max-w-md mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-4 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-white tracking-wider font-mono uppercase">
        {displayTitle}
      </h3>

      <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed font-sans">
        {displayDesc}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.02]"
        >
          <span>{displayAction}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
