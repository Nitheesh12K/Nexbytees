"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, ProfileTab } from "@/types";
import {
  Search,
  Bookmark,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  UploadCloud,
  ChevronDown,
  ShieldCheck,
  Bell,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  activeNav: string;
  onNavigate: (section: string) => void;
  user: User | null;
  onOpenAuth: (mode?: "login" | "signup", reason?: string) => void;
  onOpenProfile: (tab?: ProfileTab) => void;
  onLogout: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onSyncNews?: () => void;
  selectedDomain?: string | null;
  onSelectDomain?: (domain: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenUpload,
  onOpenSaved,
  savedCount,
  activeNav,
  onNavigate,
  user,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onSyncNews,
  selectedDomain,
  onSelectDomain,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const EDITORIAL_DESKS = [
    { label: "Latest", type: "section" as const, id: "latest" },
    { label: "Trending", type: "section" as const, id: "trending" },
    { label: "AI", type: "domain" as const, id: "AI" },
    { label: "Cybersecurity", type: "domain" as const, id: "Cybersecurity" },
    { label: "Robotics", type: "domain" as const, id: "Robotics" },
    { label: "Science", type: "domain" as const, id: "Science" },
    { label: "Business", type: "domain" as const, id: "Business" },
    { label: "Space", type: "domain" as const, id: "Space" },
    { label: "Programming", type: "domain" as const, id: "Programming" },
  ];

  const handleDeskClick = (desk: { label: string; type: "section" | "domain"; id: string }) => {
    if (desk.type === "domain") {
      if (onSelectDomain) {
        onSelectDomain(desk.id);
      }
      const el = document.getElementById("latest");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (desk.id === "latest") {
      if (onSelectDomain) {
        onSelectDomain(null);
      }
      onNavigate("latest");
    } else {
      onNavigate(desk.id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUploadClick = () => {
    if (!user) {
      onOpenAuth("login", "Please log in to upload technology stories.");
    } else {
      onOpenUpload();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-[#08090B]/95 backdrop-blur-md border-b border-[#202328] shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          : "bg-[#08090B]/80 backdrop-blur-sm border-b border-[#1A1D23]"
      )}
    >
      {/* Top Editorial Ticker Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-[#050608] border-b border-[#181A20] text-[10px] font-mono text-[#70737A] tracking-wider uppercase">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DISPATCH
          </span>
          <span>•</span>
          <span>GLOBAL TECHNOLOGY & AI INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-4 text-[#A7A9AD]">
          <span>EDITION: GLOBAL TECH</span>
          <span>•</span>
          <span>NEW YORK · LONDON · TOKYO · BENGALURU</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo / Masthead */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-1 h-5 bg-[#2F80FF] rounded-sm flex-shrink-0" />
          <div className="flex flex-col">
            <div className="text-xl md:text-2xl font-black tracking-tight text-[#F5F5F5] uppercase flex items-center leading-none">
              NEXBYTEES
            </div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#70737A] uppercase mt-0.5">
              TECH MEDIA & INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center Editorial Navigation Desks */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-6 text-xs font-semibold tracking-wide uppercase overflow-x-auto no-scrollbar scroll-smooth">
          {EDITORIAL_DESKS.map((desk) => {
            const isActive =
              desk.type === "section"
                ? activeNav === desk.id && !selectedDomain
                : selectedDomain?.toLowerCase() === desk.id.toLowerCase();
            return (
              <button
                key={desk.id}
                onClick={() => handleDeskClick(desk)}
                className={cn(
                  "relative py-1 transition-colors whitespace-nowrap",
                  isActive ? "text-[#F5F5F5]" : "text-[#A7A9AD] hover:text-[#F5F5F5]"
                )}
              >
                <span>{desk.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2F80FF]" />
                )}
              </button>
            );
          })}

          <button
            onClick={handleUploadClick}
            className="relative py-1 text-[#2F80FF] hover:text-[#70A6FF] transition-colors whitespace-nowrap pl-2 border-l border-[#202328]"
          >
            <span>Submit Story</span>
          </button>
        </nav>

        {/* Right Search, Bookmarks, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div
            onClick={onOpenSearch}
            className="flex items-center justify-center sm:justify-start gap-2.5 px-3 py-1.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] text-[#70737A] hover:text-[#A7A9AD] text-xs font-sans cursor-pointer transition-all duration-200 w-9 h-9 sm:w-44 md:w-52"
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0 text-[#A7A9AD]" />
            <span className="truncate hidden sm:inline text-[#A7A9AD]">Search coverage...</span>
            <kbd className="ml-auto text-[9px] font-mono bg-[#1A1D23] px-1.5 py-0.5 rounded border border-[#282B32] text-[#70737A] hidden md:inline-block">
              Ctrl K
            </kbd>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={onOpenSaved}
            className="hidden sm:flex relative p-2 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] text-[#A7A9AD] hover:text-[#F5F5F5] transition-all duration-200"
            title="Saved Reading List"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#2F80FF] text-white font-bold text-[9px] flex items-center justify-center font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          {user && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] text-[#A7A9AD] hover:text-[#F5F5F5] transition-all duration-200"
              title="Intelligence Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#2F80FF] text-white font-bold text-[9px] flex items-center justify-center font-mono">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-md border border-[#202328] hover:border-[#2F80FF] bg-[#111317] transition-all duration-200"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-sm bg-[#1A1D23] flex items-center justify-center overflow-hidden border border-[#282B32]">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#2F80FF] font-mono">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#70737A] hidden sm:inline" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#111317] border border-[#202328] shadow-[0_12px_32px_rgba(0,0,0,0.8)] py-1 z-50 text-[#A7A9AD] text-xs">
                  <div className="px-4 py-3 border-b border-[#202328]">
                    <div className="font-bold text-[#F5F5F5] truncate">{user.name}</div>
                    <div className="text-[11px] text-[#70737A] truncate">{user.email}</div>
                    {user.isAdmin && (
                      <span className="inline-block mt-1.5 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                        Editorial Staff
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("settings");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#15171B] hover:text-[#F5F5F5] flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#2F80FF]" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("saved");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#15171B] hover:text-[#F5F5F5] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-3.5 h-3.5 text-[#2F80FF]" />
                        <span>Saved Stories</span>
                      </div>
                      {savedCount > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1A1D23] text-[#F5F5F5] border border-[#202328]">
                          {savedCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("uploads");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#15171B] hover:text-[#F5F5F5] flex items-center gap-2.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#2F80FF]" />
                      <span>My Dispatches</span>
                    </button>

                    {user.isAdmin && onSyncNews && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSyncNews();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-amber-500/10 text-amber-300 flex items-center gap-2.5 transition-colors border-t border-[#202328] mt-1 pt-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sync News Wire</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#202328]">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-rose-500/10 text-rose-400 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2F80FF] text-[#F5F5F5] text-xs font-semibold transition-all duration-200"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#2F80FF]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md border border-[#202328] bg-[#111317] text-[#A7A9AD] hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0D10] border-b border-[#202328] px-6 py-5 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#70737A] uppercase mb-2">
              SECTIONS
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate("home");
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "text-left py-2 px-3 rounded border text-xs font-semibold transition-colors",
                  activeNav === "home" && !selectedDomain
                    ? "border-[#2F80FF] text-white bg-[#111317]"
                    : "border-[#202328] text-[#A7A9AD] hover:text-white"
                )}
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate("trending");
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "text-left py-2 px-3 rounded border text-xs font-semibold transition-colors",
                  activeNav === "trending"
                    ? "border-[#2F80FF] text-white bg-[#111317]"
                    : "border-[#202328] text-[#A7A9AD] hover:text-white"
                )}
              >
                Trending
              </button>
              <button
                onClick={() => {
                  if (onSelectDomain) onSelectDomain(null);
                  onNavigate("latest");
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "text-left py-2 px-3 rounded border text-xs font-semibold transition-colors",
                  activeNav === "latest" && !selectedDomain
                    ? "border-[#2F80FF] text-white bg-[#111317]"
                    : "border-[#202328] text-[#A7A9AD] hover:text-white"
                )}
              >
                Latest Wire
              </button>
              <button
                onClick={() => {
                  onOpenSaved();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 px-3 rounded border border-[#202328] text-[#A7A9AD] hover:text-white"
              >
                <span>Saved Stories</span>
                {savedCount > 0 && (
                  <span className="font-mono text-[10px] text-[#2F80FF] bg-[#111317] px-1.5 py-0.5 rounded">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#70737A] uppercase mb-2">
              EDITORIAL DESKS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "AI",
                "Cybersecurity",
                "Robotics",
                "Science",
                "Business",
                "Space",
                "Programming",
              ].map((domain) => {
                const isActive = selectedDomain?.toLowerCase() === domain.toLowerCase();
                return (
                  <button
                    key={domain}
                    onClick={() => {
                      if (onSelectDomain) onSelectDomain(domain);
                      const el = document.getElementById("latest");
                      el?.scrollIntoView({ behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "text-left py-2 px-3 rounded border text-xs font-medium transition-colors truncate",
                      isActive
                        ? "border-[#2F80FF] text-white bg-[#111317]"
                        : "border-[#202328] text-[#A7A9AD] hover:text-white bg-[#0E1013]"
                    )}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#202328] flex items-center justify-between">
            <button
              onClick={() => {
                handleUploadClick();
                setMobileMenuOpen(false);
              }}
              className="py-1.5 px-3 rounded bg-[#2F80FF] text-white font-bold text-xs hover:bg-[#2566CC] transition-colors"
            >
              Submit Story / Tip
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onOpenProfile("settings");
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#A7A9AD] hover:text-white font-medium"
                >
                  {user.name}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth("login");
                  setMobileMenuOpen(false);
                }}
                className="text-[#2F80FF] font-semibold"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
