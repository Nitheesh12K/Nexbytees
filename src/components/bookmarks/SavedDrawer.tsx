"use client";

import React from "react";
import { NewsItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Trash2, ArrowUpRight, Clock, Flame } from "lucide-react";
import { TrendingBadge, CommunityBadge } from "../ui/Badge";
import { cn } from "@/lib/utils";

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedStories: NewsItem[];
  onRemoveBookmark: (id: string) => void;
  onOpenArticle: (news: NewsItem) => void;
  onClearAll: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedStories,
  onRemoveBookmark,
  onOpenArticle,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-md bg-[#091124] border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100"
      >
        {/* Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bookmark className="w-4 h-4 fill-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Saved Stories</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  {savedStories.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedStories.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-mono text-slate-500 hover:text-rose-400 px-2.5 py-1 rounded transition-colors"
              >
                Clear all
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stories List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedStories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bookmark className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-white">No saved stories yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Click the bookmark icon on any technology story card to save it for offline reading.
              </p>
            </div>
          ) : (
            savedStories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-xl border border-slate-800/90 bg-[#0c1630]/80 hover:border-sky-500/40 transition-all flex flex-col gap-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-medium text-sky-400 uppercase tracking-wider">
                    {story.domain}
                  </span>
                  <button
                    onClick={() => onRemoveBookmark(story.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4
                  onClick={() => {
                    onOpenArticle(story);
                    onClose();
                  }}
                  className="text-xs md:text-sm font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {story.title}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span>{story.source}</span>
                  <button
                    onClick={() => {
                      onOpenArticle(story);
                      onClose();
                    }}
                    className="text-sky-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
