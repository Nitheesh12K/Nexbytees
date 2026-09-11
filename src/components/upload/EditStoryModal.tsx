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
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-[#091124] border border-sky-500/35 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight font-mono uppercase">
              Edit Technology Story
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Technology Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TechnologyDomain)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
              >
                {TECHNOLOGY_DOMAINS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Source Organization
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Summary Description
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.35)]"
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
