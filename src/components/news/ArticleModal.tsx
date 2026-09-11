"use client";

import React, { useEffect, useState } from "react";
import { NewsItem, User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bookmark,
  Share2,
  Clock,
  ExternalLink,
  Flame,
  Check,
  ChevronRight,
  Sparkles,
  Heart,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import { TrendingBadge, CommunityBadge } from "../ui/Badge";
import { cn } from "@/lib/utils";
import {
  toggleLikeApi,
  getCommentsApi,
  addCommentApi,
  deleteCommentApi,
} from "@/lib/api";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    role?: string;
  };
}

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (article: NewsItem) => void;
  onSelectRelated: (article: NewsItem) => void;
  allStories: NewsItem[];
  onSelectDomain: (domain: string) => void;
  currentUser?: User | null;
  onRequireAuth?: () => void;
  onNotify?: (text: string, type: "success" | "info" | "warning" | "error") => void;
  onLikeChanged?: (articleId: string, isLiked: boolean, likesCount: number) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onSelectRelated,
  allStories,
  onSelectDomain,
  currentUser,
  onRequireAuth,
  onNotify,
  onLikeChanged,
}) => {
  // Likes state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Lock background scroll when open
  useEffect(() => {
    if (article) {
      document.body.style.overflow = "hidden";
      // Initialize likes directly from real backend article data
      setLikesCount(Number(article.likesCount ?? 0));
      setIsLiked(Boolean(article.isLiked));

      // Load comments from API
      loadComments(article.id);
    } else {
      document.body.style.overflow = "unset";
      setComments([]);
      setNewComment("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [article]);

  const loadComments = async (articleId: string) => {
    setIsLoadingComments(true);
    try {
      const res = await getCommentsApi(articleId);
      if (res.success && Array.isArray(res.data)) {
        setComments(res.data);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoadingComments(false);
    }
  };

  if (!article) return null;

  const handleToggleLike = async () => {
    if (!currentUser) {
      onNotify?.("Please log in to like this intelligence dispatch.", "warning");
      onRequireAuth?.();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await toggleLikeApi(article.id);
      if (res.success && res.data) {
        const serverLiked = typeof res.data.liked === "boolean" ? res.data.liked : nextLiked;
        const serverLikes =
          typeof res.data.totalLikes === "number"
            ? res.data.totalLikes
            : typeof res.data.likes === "number"
            ? res.data.likes
            : nextLiked
            ? likesCount + 1
            : Math.max(0, likesCount - 1);

        setIsLiked(serverLiked);
        setLikesCount(serverLikes);
        onLikeChanged?.(article.id, serverLiked, serverLikes);
      }
    } catch {
      // Revert if failed
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      onNotify?.("Could not update like status. Please try again.", "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    if (!currentUser) {
      onNotify?.("Please log in to contribute to the discussion.", "warning");
      onRequireAuth?.();
      return;
    }

    setIsPostingComment(true);
    try {
      const res = await addCommentApi(article.id, content);
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewComment("");
        onNotify?.("Comment posted to intelligence thread.", "success");
      } else {
        onNotify?.("Failed to post comment. Please try again.", "error");
      }
    } catch {
      onNotify?.("Failed to post comment. Please try again.", "error");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await deleteCommentApi(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        onNotify?.("Comment deleted from intelligence thread.", "info");
      } else {
        onNotify?.("Could not delete comment. You may only delete your own commentary.", "error");
      }
    } catch {
      onNotify?.("Could not delete comment. You may only delete your own commentary.", "error");
    }
  };

  // Filter related stories from same domain or adjacent domains
  const relatedStories = allStories
    .filter((s) => s.id !== article.id && (s.domain === article.domain || s.trendingScore > 90))
    .slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "relative w-full max-w-4xl bg-[#080e1e] border border-slate-800/90 rounded-none md:rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)]",
            "z-10 max-h-screen md:max-h-[92vh] overflow-y-auto flex flex-col text-slate-100"
          )}
        >
          {/* Sticky Modal Top Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#080e1e]/90 backdrop-blur-md border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectDomain(article.domain);
                  onClose();
                }}
                className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-colors"
              >
                {article.domain}
              </button>

              {article.isCommunitySubmission ? (
                <CommunityBadge />
              ) : (
                <TrendingBadge type={article.trendingBadge || null} />
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                aria-label="Like story"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200",
                  isLiked
                    ? "bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5 transition-transform active:scale-125", isLiked && "fill-rose-400 text-rose-400")} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(article.id)}
                aria-label="Bookmark story"
                className={cn(
                  "p-2 rounded-lg border transition-all duration-200",
                  isBookmarked
                    ? "bg-sky-500/20 border-sky-500 text-sky-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                )}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-sky-400")} />
              </button>

              <button
                onClick={() => onShare(article)}
                aria-label="Share story"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Header & Metadata */}
          <div className="p-6 md:p-10 space-y-6">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            {/* Author / Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-800/70 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span>
                  By <strong className="text-slate-200 font-sans">{article.author}</strong>
                </span>
                <span>•</span>
                <span className="text-sky-400 font-sans">{article.source}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {article.publishedAt}
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-sky-300">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Score: {article.trendingScore}
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full h-[260px] md:h-[400px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080e1e] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                  Image Source: NEXBYTEES Visual Wire
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                  Domain: {article.domain}
                </span>
              </div>
            </div>

            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#0e1b38]/70 to-[#091124]/90 border border-sky-500/25">
                <div className="flex items-center gap-2 mb-3 text-sky-400 text-xs font-mono uppercase tracking-wider font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Editorial Takeaways</span>
                </div>
                <ul className="space-y-2">
                  {article.keyTakeaways.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Summary Lead Paragraph */}
            <div className="text-base md:text-lg text-slate-200 font-normal leading-relaxed border-l-2 border-sky-400 pl-4 py-1 italic bg-sky-500/5 rounded-r">
              {article.summary}
            </div>

            {/* Main Editorial Content */}
            <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              {article.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-lg md:text-xl font-bold text-white pt-4 pb-1 border-b border-slate-800/80 tracking-tight"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags Row */}
            <div className="pt-6 border-t border-slate-800/70">
              <span className="text-xs font-mono text-slate-500 mr-3">TOPICS:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:border-sky-500/40 hover:text-sky-300 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Stories Section */}
            {relatedStories.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Related Coverage in {article.domain}
                  </h3>
                  <button
                    onClick={() => {
                      onSelectDomain(article.domain);
                      onClose();
                    }}
                    className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                  >
                    View Domain Feed &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedStories.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="group p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-900 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                          {rel.domain}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 mt-1 line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-3">
                        <span>{rel.publishedAt}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Discussion & Commentary Section */}
            <div className="pt-8 border-t border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Technical Commentary ({comments.length})
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Live Peer Wire</span>
              </div>

              {/* Comment Input */}
              {currentUser ? (
                <form onSubmit={handlePostComment} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Contribute technical insight or counter-argument..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none font-sans"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      Posting as <strong className="text-slate-300">{currentUser.name}</strong>
                    </div>
                    <button
                      type="submit"
                      disabled={isPostingComment || !newComment.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs font-mono transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPostingComment ? "Publishing..." : "Post Insight"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400 font-sans">
                    Join the technical discourse. Log in or create an account to post insights.
                  </p>
                  <button
                    onClick={onRequireAuth}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-mono transition-colors shrink-0"
                  >
                    Authenticate
                  </button>
                </div>
              )}

              {/* Comments Thread */}
              <div className="space-y-3">
                {isLoadingComments && (
                  <div className="py-6 text-center text-xs font-mono text-slate-500">
                    Loading commentary...
                  </div>
                )}

                {!isLoadingComments && comments.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-slate-500">
                    No commentary yet. Be the first to share your analysis.
                  </div>
                )}

                {comments.map((comment) => {
                  const canDelete =
                    currentUser &&
                    (currentUser.id === comment.user?.id ||
                      currentUser.isAdmin ||
                      currentUser.role === "Lead System Architect");

                  return (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-800 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              comment.user?.profileImage ||
                              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                                comment.user?.name || "contributor"
                              )}`
                            }
                            alt={comment.user?.name || "Contributor"}
                            className="w-6 h-6 rounded-full border border-sky-500/30 object-cover"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200">
                              {comment.user?.name || "Contributor"}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {comment.user?.role || "Peer"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently"}
                          </span>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              aria-label="Delete comment"
                              className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-8 font-sans">
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer actions */}
          <div className="sticky bottom-0 bg-[#080e1e]/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-mono">
              NEXBYTEES Intelligence Editorial Wire
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleBookmark(article.id)}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "text-sky-400 fill-sky-400")} />
                <span>{isBookmarked ? "Saved" : "Save Story"}</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs font-medium px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-colors"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
