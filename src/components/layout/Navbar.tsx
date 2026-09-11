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
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        "sticky top-0 z-40 w-full transition-all duration-500",
        scrolled
          ? "bg-[#010409]/96 backdrop-blur-xl border-b border-white/6 shadow-[0_4px_40px_rgba(0,0,0,0.9)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Premium top accent line — visible when scrolled */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(56,189,248,0.4) 25%, rgba(56,189,248,0.7) 50%, rgba(56,189,248,0.4) 75%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Left brand accent bar */}
          <div className="w-0.5 h-5 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)] flex-shrink-0" />
          <div className="flex flex-col">
            <div className="text-lg md:text-xl font-black tracking-wider text-white uppercase flex items-center leading-none">
              NE<span className="text-sky-400">X</span>BYTEES
            </div>
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
              AI • TECHNOLOGY • FUTURE
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <button
            onClick={() => onNavigate("home")}
            className="relative py-1 text-white hover:text-sky-300 transition-colors"
          >
            <span>Home</span>
            {activeNav === "home" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate("trending")}
            className="relative py-1 text-slate-300 hover:text-white transition-colors"
          >
            <span>Trending</span>
            {activeNav === "trending" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate("domains")}
            className="relative py-1 text-slate-300 hover:text-white transition-colors"
          >
            <span>Domains</span>
            {activeNav === "domains" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          <button
            onClick={() => onNavigate("latest")}
            className="relative py-1 text-slate-300 hover:text-white transition-colors"
          >
            <span>Latest</span>
            {activeNav === "latest" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          <button
            onClick={handleUploadClick}
            className="relative py-1 text-slate-300 hover:text-sky-300 transition-colors"
          >
            <span>Upload</span>
          </button>
        </nav>

        {/* Right Search, Bookmark & Profile */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/8 bg-white/5 hover:bg-white/8 hover:border-white/15 text-white/50 hover:text-white/70 text-xs font-sans cursor-pointer transition-all duration-300 w-36 sm:w-56"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate hidden sm:inline">Search tech news...</span>
            <span className="truncate sm:hidden">Search...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white/8 px-1.5 py-0.5 rounded border border-white/10 text-white/30 hidden sm:inline-block">
              Ctrl K
            </kbd>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 hover:border-white/15 text-white/50 hover:text-white transition-all duration-300"
            title="Saved Stories"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          {user && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 hover:border-white/15 text-white/50 hover:text-white transition-all duration-300"
              title="Intelligence Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono shadow-[0_0_8px_rgba(56,189,248,0.8)]">
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
                className="flex items-center gap-1.5 p-0.5 rounded-full border border-sky-400/40 hover:border-sky-400/70 transition-all duration-300"
                style={{
                  boxShadow: "0 0 0 1px rgba(56,189,248,0.15), 0 0 16px rgba(56,189,248,0.12)",
                }}
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#0c1a3c] flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#091124] border border-sky-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl py-2 z-50 text-slate-200 text-xs">
                  <div className="px-4 py-2.5 border-b border-slate-800/80">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    {user.isAdmin && (
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin / Editorial
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("settings");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("saved");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800/70 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                        <span>Saved Stories</span>
                      </div>
                      {savedCount > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                          {savedCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile("uploads");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-800/70 flex items-center gap-2.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                      <span>My Uploads</span>
                    </button>

                    {user.isAdmin && onSyncNews && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSyncNews();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-amber-500/15 text-amber-300 flex items-center gap-2.5 transition-colors border-t border-slate-800/60 mt-1 pt-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sync NewsAPI Wire</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-rose-500/15 text-rose-300 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-sky-500/50 text-slate-200 hover:text-white text-xs font-semibold transition-all"
            >
              <UserIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Log In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070e20] border-b border-slate-800 px-6 py-4 space-y-3 text-xs">
          <button
            onClick={() => {
              onNavigate("home");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-white"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate("trending");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-slate-300"
          >
            Trending
          </button>
          <button
            onClick={() => {
              onNavigate("domains");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-slate-300"
          >
            Domains
          </button>
          <button
            onClick={() => {
              onNavigate("latest");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-slate-300"
          >
            Latest
          </button>
          <button
            onClick={() => {
              handleUploadClick();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-1 text-sky-400 font-semibold"
          >
            Upload Story
          </button>

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 hover:underline"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth("login");
                  setMobileMenuOpen(false);
                }}
                className="text-sky-400 font-semibold"
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
