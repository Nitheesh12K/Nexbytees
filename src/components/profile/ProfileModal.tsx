"use client";

import React, { useState, useEffect } from "react";
import { User, NewsItem, ProfileTab } from "@/types";
import { updateUserProfile } from "@/lib/auth";
import { syncNewsApi } from "@/lib/api";
import { TECHNOLOGY_DOMAINS } from "@/data/domains";
import { EmptyState } from "../ui/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User as UserIcon,
  Bookmark,
  UploadCloud,
  Settings,
  LogOut,
  Calendar,
  Mail,
  ShieldCheck,
  Trash2,
  Edit2,
  ArrowUpRight,
  Sun,
  Moon,
  Sparkles,
  Save,
  RefreshCw,
} from "lucide-react";
import { CommunityBadge } from "../ui/Badge";
import { Theme, getStoredTheme, applyTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  savedStories: NewsItem[];
  userUploads: NewsItem[];
  onLogoutClick: () => void;
  onOpenArticle: (story: NewsItem) => void;
  onRemoveSaved: (id: string) => void;
  onOpenUpload: () => void;
  onEditStory: (story: NewsItem) => void;
  onDeleteStoryClick: (story: NewsItem) => void;
  onUserUpdate: (updatedUser: User) => void;
  initialTab?: ProfileTab;
  onNotify: (text: string, type: "success" | "info" | "warning" | "error") => void;
  onNewsSynced?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  savedStories,
  userUploads,
  onLogoutClick,
  onOpenArticle,
  onRemoveSaved,
  onOpenUpload,
  onEditStory,
  onDeleteStoryClick,
  onUserUpdate,
  initialTab = "settings",
  onNotify,
  onNewsSynced,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Profile Edit fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditBio(user.bio || "Technology researcher & continuous intelligence reader.");
      setEditAvatar(user.avatarUrl || "");
      setEditInterests(user.interests || ["AI", "Quantum", "Robotics"]);
    }
    setTheme(getStoredTheme());
  }, [user, isOpen]);

  const handleSyncNews = async () => {
    setIsSyncingNews(true);
    setSyncStatus(null);
    try {
      const res = await syncNewsApi(15);
      if (res.success && res.data) {
        const msg = `NewsAPI wire synced: ${res.data.fetched} fetched, ${res.data.inserted} added to Supabase, ${res.data.duplicatesSkipped} duplicates skipped.`;
        setSyncStatus(msg);
        onNotify(msg, "success");
        onNewsSynced?.();
      } else {
        const err = res.error?.message || "NewsAPI synchronization failed.";
        setSyncStatus(err);
        onNotify(err, "error");
      }
    } catch {
      setSyncStatus("Network connection error to sync API.");
      onNotify("Network connection error to sync API.", "error");
    } finally {
      setIsSyncingNews(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      onNotify("Name and email cannot be blank.", "error");
      return;
    }

    const res = await updateUserProfile(user.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      bio: editBio.trim(),
      avatarUrl: editAvatar.trim() || user.avatarUrl,
      interests: editInterests,
    });

    if (res.success && res.user) {
      onUserUpdate(res.user);
      setIsEditingProfile(false);
      onNotify("Profile updated successfully.", "success");
    } else {
      onNotify(res.error || "Failed to update profile.", "error");
    }
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    onNotify(`Switched to ${next} mode.`, "info");
  };

  const toggleInterest = (domName: string) => {
    if (editInterests.includes(domName)) {
      setEditInterests(editInterests.filter((i) => i !== domName));
    } else {
      setEditInterests([...editInterests, domName]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-2xl bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden flex flex-col text-[#F5F5F5] max-h-[90vh]"
      >
        {/* Header Profile Summary */}
        <div className="p-6 border-b border-[#202328] bg-[#0E1013] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-center overflow-hidden shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold font-mono text-[#2F80FF]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#F5F5F5] tracking-tight truncate uppercase">
                  {user.name}
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#111317] text-[#2F80FF] border border-[#202328] flex items-center gap-1 shrink-0 uppercase">
                  <ShieldCheck className="w-3 h-3 text-[#2F80FF]" />
                  <span>Verified Reader</span>
                </span>
              </div>
              <div className="text-xs text-[#70737A] mt-0.5 truncate">{user.email}</div>
              <div className="text-[10px] font-mono text-[#70737A] mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Member since {user.joinedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-white shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#202328] bg-[#0B0D10] px-6 text-xs font-semibold overflow-x-auto scrollbar-none uppercase tracking-wider">
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsEditingProfile(false);
            }}
            className={cn(
              "py-3 px-4 border-b-2 font-mono flex items-center gap-2 transition-colors shrink-0",
              activeTab === "settings"
                ? "border-[#2F80FF] text-white font-bold"
                : "border-transparent text-[#70737A] hover:text-[#A7A9AD]"
            )}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={cn(
              "py-3 px-4 border-b-2 font-mono flex items-center gap-2 transition-colors shrink-0",
              activeTab === "saved"
                ? "border-[#2F80FF] text-white font-bold"
                : "border-transparent text-[#70737A] hover:text-[#A7A9AD]"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Stories ({savedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("uploads")}
            className={cn(
              "py-3 px-4 border-b-2 font-mono flex items-center gap-2 transition-colors shrink-0",
              activeTab === "uploads"
                ? "border-[#2F80FF] text-white font-bold"
                : "border-transparent text-[#70737A] hover:text-[#A7A9AD]"
            )}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Dispatches ({userUploads.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* 1. Profile Tab */}
          {activeTab === "settings" && (
            <div>
              {isEditingProfile ? (
                /* Profile Editor Form */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#202328]">
                    <span className="text-xs font-mono text-[#2F80FF] uppercase font-semibold">
                      Edit Profile Information
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs text-[#70737A] hover:text-[#F5F5F5]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1">
                      Bio / Specialization
                    </label>
                    <textarea
                      rows={2}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                      Technology Interests (Click to toggle)
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {["AI", "Quantum", "Robotics", "Cybersecurity", "Space", "Semiconductors", "Cloud", "Smartphones", "BioTech"].map(
                        (dom) => {
                          const isSel = editInterests.includes(dom);
                          return (
                            <button
                              key={dom}
                              type="button"
                              onClick={() => toggleInterest(dom)}
                              className={cn(
                                "text-[10px] font-mono px-2.5 py-1 rounded-md border transition-colors",
                                isSel
                                  ? "bg-[#15171B] border-[#2F80FF] text-[#F5F5F5]"
                                  : "bg-[#111317] border-[#202328] text-[#70737A] hover:text-[#A7A9AD]"
                              )}
                            >
                              {dom}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 py-2 px-4 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile Overview */
                <div className="space-y-6">
                  {/* Bio block */}
                  <div className="p-4 rounded-md bg-[#111317] border border-[#202328]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#70737A] uppercase">
                        Biography & Context
                      </span>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="text-xs font-mono text-[#2F80FF] hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#A7A9AD] leading-relaxed font-sans">
                      {user.bio || "Technology researcher & continuous intelligence reader."}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#202328]">
                      <span className="text-[10px] font-mono text-[#70737A] uppercase block mb-1.5">
                        Selected Interests
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(user.interests && user.interests.length > 0
                          ? user.interests
                          : ["AI", "Quantum", "Robotics"]
                        ).map((item) => (
                          <span
                            key={item}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0E1013] text-[#2F80FF] border border-[#202328]"
                          >
                            #{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Admin Editorial NewsAPI Sync */}
                  {user.isAdmin && (
                    <div className="p-4 rounded-md bg-[#111317] border border-[#202328] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-[#F5F5F5] tracking-tight uppercase font-mono">
                            Editorial News Wire Sync
                          </span>
                        </div>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-[#0E1013] text-emerald-400 border border-[#202328]">
                          Admin / Editor
                        </span>
                      </div>

                      <p className="text-xs text-[#A7A9AD] leading-relaxed font-sans">
                        Trigger on-demand ingestion of live technology headlines from NewsAPI directly into Supabase PostgreSQL.
                      </p>

                      {syncStatus && (
                        <div className="p-2.5 rounded-md bg-[#0B0D10] border border-[#202328] text-[11px] font-mono text-emerald-400">
                          {syncStatus}
                        </div>
                      )}

                      <button
                        onClick={handleSyncNews}
                        disabled={isSyncingNews}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={cn("w-3.5 h-3.5", isSyncingNews && "animate-spin")} />
                        <span>{isSyncingNews ? "Ingesting Headlines..." : "Sync NewsAPI Wire Now"}</span>
                      </button>
                    </div>
                  )}

                  {/* Theme Switcher Row */}
                  <div className="p-4 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#F5F5F5]">Visual Theme</div>
                      <div className="text-[11px] text-[#70737A]">
                        Current mode: <strong className="capitalize text-[#2F80FF]">{theme}</strong>
                      </div>
                    </div>

                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#202328] bg-[#0E1013] hover:border-[#2F80FF] text-xs font-mono text-[#F5F5F5] transition-colors"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="w-4 h-4 text-amber-400" />
                          <span>Switch to Light</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4 text-sky-400" />
                          <span>Switch to Dark</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sign Out Row */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Sign Out</div>
                      <div className="text-[11px] text-slate-400">
                        Terminates session on this browser
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onLogoutClick();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Saved Stories Tab */}
          {activeTab === "saved" && (
            <div>
              {savedStories.length === 0 ? (
                <EmptyState
                  type="saved"
                  onAction={() => {
                    onClose();
                    document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {savedStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-3.5 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2C3038] flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono text-[#2F80FF] uppercase">
                          {story.domain}
                        </span>
                        <h4
                          onClick={() => {
                            onOpenArticle(story);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-bold text-[#F5F5F5] hover:text-[#2F80FF] cursor-pointer transition-colors truncate"
                        >
                          {story.title}
                        </h4>
                        <div className="text-[10px] font-mono text-[#70737A] mt-0.5">
                          {story.source} • {story.publishedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onOpenArticle(story);
                            onClose();
                          }}
                          className="text-xs font-semibold text-[#2F80FF] hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>Read</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onRemoveSaved(story.id)}
                          className="text-[#70737A] hover:text-rose-400 p-1 rounded"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. My Uploads Tab */}
          {activeTab === "uploads" && (
            <div>
              {userUploads.length === 0 ? (
                <EmptyState
                  type="uploads"
                  onAction={() => {
                    onClose();
                    onOpenUpload();
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#70737A] uppercase">
                      Published Community Dispatches ({userUploads.length})
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenUpload();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Submit New Story</span>
                    </button>
                  </div>

                  {userUploads.map((story) => (
                    <div
                      key={story.id}
                      className="p-3.5 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2C3038] flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#2F80FF] uppercase">
                            {story.domain}
                          </span>
                          <CommunityBadge />
                        </div>
                        <h4
                          onClick={() => {
                            onOpenArticle(story);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-bold text-[#F5F5F5] hover:text-[#2F80FF] cursor-pointer transition-colors truncate"
                        >
                          {story.title}
                        </h4>
                        <p className="text-[11px] text-[#70737A] truncate mt-0.5">
                          {story.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onEditStory(story)}
                          className="p-1.5 rounded-md bg-[#0E1013] border border-[#202328] text-[#70737A] hover:text-[#2F80FF] transition-colors"
                          title="Edit story"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteStoryClick(story)}
                          className="p-1.5 rounded-md bg-[#0E1013] border border-[#202328] text-[#70737A] hover:text-rose-400 transition-colors"
                          title="Delete story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
