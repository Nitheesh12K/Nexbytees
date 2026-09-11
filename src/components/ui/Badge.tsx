import React from "react";
import { TrendingBadgeType } from "@/types";
import { Flame, Sparkles, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingBadgeProps {
  type: TrendingBadgeType;
  className?: string;
}

export const TrendingBadge: React.FC<TrendingBadgeProps> = ({ type, className }) => {
  if (!type) return null;

  switch (type) {
    case "TRENDING":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono",
            "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
            className
          )}
        >
          <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>TRENDING</span>
        </span>
      );
    case "HOT":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono",
            "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
            className
          )}
        >
          <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>HOT</span>
        </span>
      );
    case "RISING":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono",
            "bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.25)]",
            className
          )}
        >
          <TrendingUp className="w-3 h-3 text-sky-400" />
          <span>RISING</span>
        </span>
      );
    default:
      return null;
  }
};

export const CommunityBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono",
      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      className
    )}
  >
    <Users className="w-3 h-3 text-emerald-400" />
    <span>COMMUNITY SUBMISSION</span>
  </span>
);
