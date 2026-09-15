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
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="relative z-10 w-full max-w-md bg-[#0B0D10] border-l border-[#202328] h-full flex flex-col shadow-2xl text-[#F5F5F5]"
      >
        {/* Top Bar */}
        <div className="p-5 border-b border-[#202328] flex items-center justify-between bg-[#111317]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#15171B] border border-[#202328] flex items-center justify-center text-[#2F80FF]">
              <Bookmark className="w-4 h-4 fill-[#2F80FF]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2 font-mono">
                <span>Reading List</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#15171B] text-[#2F80FF] border border-[#202328]">
                  {savedStories.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedStories.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-mono text-[#70737A] hover:text-rose-400 px-2 py-1 rounded transition-colors"
              >
                Clear all
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm bg-[#15171B] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stories List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedStories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bookmark className="w-10 h-10 text-[#202328] mb-3" />
              <h3 className="text-sm font-semibold text-[#F5F5F5]">Reading list is empty</h3>
              <p className="text-xs text-[#70737A] mt-1 max-w-xs font-mono">
                Bookmark dispatches from across the news wire to read later.
              </p>
            </div>
          ) : (
            savedStories.map((story) => (
              <div
                key={story.id}
                className="p-3.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] hover:border-[#2C3038] transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-medium text-[#2F80FF] uppercase tracking-wider">
                    {story.domain}
                  </span>
                  <button
                    onClick={() => onRemoveBookmark(story.id)}
                    className="text-[#70737A] hover:text-rose-400 transition-colors p-1"
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
                  className="text-xs sm:text-sm font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {story.title}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-[#202328] text-[11px] font-mono text-[#70737A]">
                  <span>{story.source}</span>
                  <button
                    onClick={() => {
                      onOpenArticle(story);
                      onClose();
                    }}
                    className="text-[#2F80FF] font-semibold hover:underline flex items-center gap-1"
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
