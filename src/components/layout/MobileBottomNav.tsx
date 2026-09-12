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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060c1c]/95 backdrop-blur-xl border-t border-slate-800/90 pt-1.5 pb-3 sm:pb-2 px-2 shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate("home")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors",
            activeSection === "home"
              ? "text-sky-400 font-bold"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate">Home</span>
        </button>

        {/* 2. Trending */}
        <button
          onClick={() => onNavigate("trending")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors",
            activeSection === "trending"
              ? "text-sky-400 font-bold"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Flame className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate">Trending</span>
        </button>

        {/* 3. Domains */}
        <button
          onClick={() => onNavigate("domains")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors",
            activeSection === "domains"
              ? "text-sky-400 font-bold"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate">Domains</span>
        </button>

        {/* 4. Saved */}
        <button
          onClick={onOpenSaved}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <div className="relative">
            <Bookmark className="w-4 h-4 flex-shrink-0" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-sky-500 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans truncate">Saved</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={onOpenProfile}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors",
            isLoggedIn ? "text-sky-400 font-semibold" : "text-slate-400 hover:text-white"
          )}
        >
          <UserIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-sans truncate">{isLoggedIn ? "Profile" : "Log In"}</span>
        </button>
      </div>
    </div>
  );
};
