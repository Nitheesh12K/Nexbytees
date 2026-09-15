"use client";

import React, { useState, useEffect } from "react";
import { NewsItem, TechnologyDomain } from "@/types";
import { TECHNOLOGY_DOMAINS } from "@/data/domains";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, UploadCloud, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: NewsItem | null;
  onSave: (updatedStory: NewsItem) => void;
}

export const EditStoryModal: React.FC<EditStoryModalProps> = ({
  isOpen,
  onClose,
  story,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [domain, setDomain] = useState<TechnologyDomain>("Artificial Intelligence");
  const [source, setSource] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setSummary(story.summary);
      setDomain(story.domain);
      setSource(story.source);
      setImageUrl(story.imageUrl);
      setTags(story.tags ? story.tags.join(", ") : "");
      setError(null);
    }
  }, [story]);

  if (!isOpen || !story) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setError("Title and description are required.");
      return;
    }

    const updated: NewsItem = {
      ...story,
      title: title.trim(),
      summary: summary.trim(),
      domain,
      source: source.trim() || "Community Contributor",
      imageUrl: imageUrl.trim() || story.imageUrl,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-2xl bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10 overflow-hidden flex flex-col text-[#F5F5F5] max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-[#202328] flex items-center justify-between bg-[#0E1013]">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-4 bg-[#2F80FF] rounded-sm" />
            <h2 className="text-sm font-bold text-[#F5F5F5] tracking-tight uppercase font-mono">
              Edit Technology Dispatch
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
              Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                Technology Domain / Desk
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TechnologyDomain)}
                className="w-full px-3.5 py-2 text-xs rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans cursor-pointer"
              >
                {TECHNOLOGY_DOMAINS.map((d) => (
                  <option key={d.name} value={d.name} className="bg-[#111317] text-[#F5F5F5]">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                Source Organization
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
              Photography URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
              Standfirst / Executive Summary
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
              Indexed Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] focus:outline-none focus:border-[#2F80FF] font-sans"
            />
          </div>

          <div className="pt-4 border-t border-[#202328] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3.5 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] text-xs text-[#A7A9AD] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 py-2 px-4 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
