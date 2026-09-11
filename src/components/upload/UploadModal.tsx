"use client";

import React, { useState, useRef } from "react";
import { TechnologyDomain, UploadFormData } from "@/types";
import { TECHNOLOGY_DOMAINS } from "@/data/domains";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  FileText,
  Tag,
  Globe,
  Radio,
} from "lucide-react";
import { CommunityBadge } from "../ui/Badge";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (formData: UploadFormData) => void;
}

const PRESET_IMAGES = [
  {
    label: "Neural Architecture",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Robotic Dexterity",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Deep Silicon",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Quantum Lattice",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Orbital Spacecraft",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPublish,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    domain: "Artificial Intelligence",
    source: "Independent Contributor",
    imageUrl: PRESET_IMAGES[0].url,
    tags: "EmergingTech, Engineering, Research",
    content: "",
  });

  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in both a headline and description.");
      return;
    }

    onPublish(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* 3D Glass Upload Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "relative w-full max-w-3xl bg-[#091124]/95 border border-sky-500/30 rounded-2xl",
          "shadow-[0_20px_70px_rgba(0,0,0,0.9)] backdrop-blur-xl z-10 overflow-hidden flex flex-col text-slate-100 max-h-[92vh]"
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
                <span>Submit Technology Story</span>
                <CommunityBadge />
              </h2>
              <p className="text-xs text-slate-400">
                Publish verified breakthroughs, releases, or research dispatches to the community feed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewActive(!isPreviewActive)}
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors",
                isPreviewActive
                  ? "bg-sky-500/20 border-sky-500 text-sky-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewActive ? "Edit Form" : "Live Preview"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isPreviewActive ? (
            /* Live Preview Mode */
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>REAL-TIME CARD PREVIEW</span>
              </div>

              <div className="max-w-md mx-auto rounded-2xl border border-sky-500/40 bg-gradient-to-b from-[#0e1b38] to-[#040816] p-5 shadow-2xl">
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 border border-slate-800 bg-slate-950">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-sky-300 border border-white/10">
                      {formData.domain}
                    </span>
                    <CommunityBadge />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {formData.title || "Your headline will appear here..."}
                </h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {formData.description || "Your 2-3 line summary and technical context will appear here..."}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{formData.source || "Community Contributor"}</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form id="upload-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Drag & Drop Image Area */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Featured Story Imagery
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
                    dragOver
                      ? "border-sky-400 bg-sky-500/10"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-sky-400 mb-1" />
                  <div className="text-xs text-slate-300 font-medium">
                    Drag and drop an image, or <span className="text-sky-400 underline">browse files</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    PNG, JPG, WebP up to 10MB
                  </div>
                </div>

                {/* Preset Thumbnails */}
                <div className="mt-3">
                  <span className="text-[11px] font-mono text-slate-500 mr-2">Quick Presets:</span>
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, imageUrl: preset.url }))}
                        className={cn(
                          "text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-colors",
                          formData.imageUrl === preset.url
                            ? "bg-sky-500/20 border-sky-400 text-sky-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Headline <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next-Generation Neuromorphic Chip Achieves Sub-Milliwatt Vision Inference"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                />
              </div>

              {/* Domain & Source row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Technology Domain <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value as TechnologyDomain })
                    }
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
                  >
                    {TECHNOLOGY_DOMAINS.map((dom) => (
                      <option key={dom.name} value={dom.name}>
                        {dom.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Source / Lab / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g. Stanford AI Lab, CERN, DeepMind"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Short Summary Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Executive Summary (2–3 sentences) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the core engineering discovery, architectural shift, benchmark metric, or release..."
                  className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Extended Content (Optional) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Article Body (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed multi-paragraph technical breakdown, methodology, or benchmark citations..."
                  className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Hardware, Neuromorphic, LowPower, Silicon"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-sans"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500">
            Frontend-only • Stored locally in browser
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="upload-form"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>PUBLISH STORY</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
