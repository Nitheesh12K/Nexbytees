"use client";

import React from "react";
import { Home, Flame, Layers, Bookmark, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenSaved: () => void;
  onOpenProfile: () => void;
  savedCount: number;
  isLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenSaved,
  onOpenProfile,
  savedCount,
  isLoggedIn,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D10]/98 backdrop-blur-md border-t border-[#202328] pt-1 pb-3 px-2">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate("home")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 transition-colors",
            activeSection === "home"
              ? "text-[#2F80FF] font-bold"
              : "text-[#70737A] hover:text-[#F5F5F5]"
          )}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate uppercase tracking-wider">Home</span>
        </button>

        {/* 2. Trending */}
        <button
          onClick={() => onNavigate("trending")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 transition-colors",
            activeSection === "trending"
              ? "text-[#2F80FF] font-bold"
              : "text-[#70737A] hover:text-[#F5F5F5]"
          )}
        >
          <Flame className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate uppercase tracking-wider">Trending</span>
        </button>

        {/* 3. Domains */}
        <button
          onClick={() => onNavigate("domains")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 transition-colors",
            activeSection === "domains"
              ? "text-[#2F80FF] font-bold"
              : "text-[#70737A] hover:text-[#F5F5F5]"
          )}
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate uppercase tracking-wider">Desks</span>
        </button>

        {/* 4. Saved */}
        <button
          onClick={onOpenSaved}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 text-[#70737A] hover:text-[#F5F5F5] transition-colors"
        >
          <div className="relative">
            <Bookmark className="w-4 h-4 flex-shrink-0" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#2F80FF] text-white font-bold text-[8px] flex items-center justify-center font-mono">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans truncate uppercase tracking-wider">Saved</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={onOpenProfile}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 transition-colors",
            isLoggedIn ? "text-[#2F80FF] font-bold" : "text-[#70737A] hover:text-[#F5F5F5]"
          )}
        >
          <UserIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate uppercase tracking-wider">{isLoggedIn ? "Account" : "Sign In"}</span>
        </button>
      </div>
    </div>
  );
};
