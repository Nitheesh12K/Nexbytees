"use client";

import React, { useState } from "react";
import { NewsItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Social SVG Icons
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: NewsItem | null;
  onNotify: (text: string, type: "success" | "info") => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  story,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !story) return null;

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/#story-${story.id}`
    : `https://nexbytees.com/#story-${story.id}`;

  const shareText = `${story.title} — via NEXBYTEES Technology Wire`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      onNotify("Link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: story.title,
          text: story.summary,
          url,
        })
        .then(() => onNotify("Shared successfully", "success"))
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      story.title
    )}&url=${encodeURIComponent(url)}&via=NEXBYTEES`;
    window.open(twitterUrl, "_blank");
  };

  const shareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${story.title} - ${url}`
    )}`;
    window.open(waUrl, "_blank");
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

      {/* Share Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-md bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 z-10 text-[#F5F5F5] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#70737A] hover:text-[#F5F5F5] p-1.5 rounded-md bg-[#111317] border border-[#202328] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[#2F80FF] text-[10px] font-mono uppercase tracking-wider mb-2">
          <Share2 className="w-3.5 h-3.5" />
          <span>Dispatch Syndicate · Share Story</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-[#F5F5F5] line-clamp-2 leading-snug">
          {story.title}
        </h3>

        {/* Copy Link Input Bar */}
        <div className="mt-5 p-2 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-between gap-2">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent text-xs text-[#A7A9AD] font-mono w-full truncate focus:outline-none pl-2"
          />

          <button
            onClick={handleCopy}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-bold font-mono shrink-0 flex items-center gap-1.5 transition-all cursor-pointer",
              copied
                ? "bg-emerald-500 text-slate-950"
                : "bg-[#2F80FF] hover:bg-[#2566CC] text-white"
            )}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>

        {/* Social Share Grid */}
        <div className="mt-5 pt-5 border-t border-[#202328]">
          <span className="text-[10px] font-mono text-[#70737A] uppercase tracking-wider block mb-3">
            Syndicate Channels
          </span>

          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={shareWhatsApp}
              className="p-3 rounded-md bg-[#111317] border border-[#202328] hover:border-emerald-500/50 text-emerald-400 flex flex-col items-center gap-1.5 transition-colors text-center cursor-pointer group"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="text-[10px] font-mono text-[#A7A9AD]">WhatsApp</span>
            </button>

            <button
              onClick={shareTwitter}
              className="p-3 rounded-md bg-[#111317] border border-[#202328] hover:border-[#F5F5F5]/40 text-[#F5F5F5] flex flex-col items-center gap-1.5 transition-colors text-center cursor-pointer group"
            >
              <XIcon className="w-4 h-4" />
              <span className="text-[10px] font-mono text-[#A7A9AD]">X / Twitter</span>
            </button>

            <button
              onClick={shareLinkedIn}
              className="p-3 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2F80FF] text-[#2F80FF] flex flex-col items-center gap-1.5 transition-colors text-center cursor-pointer group"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span className="text-[10px] font-mono text-[#A7A9AD]">LinkedIn</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="p-3 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2F80FF] text-[#A7A9AD] hover:text-white flex flex-col items-center gap-1.5 transition-colors text-center cursor-pointer group"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-[10px] font-mono text-[#A7A9AD]">More</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
