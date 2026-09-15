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
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.99 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative w-full max-w-4xl bg-[#0B0D10] border border-[#202328] rounded-none md:rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.9)]",
            "z-10 max-h-screen md:max-h-[92vh] overflow-y-auto flex flex-col text-[#F5F5F5]"
          )}
        >
          {/* Sticky Modal Top Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-[#0B0D10]/95 backdrop-blur-md border-b border-[#202328]">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  onSelectDomain(article.domain);
                  onClose();
                }}
                className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded-sm bg-[#111317] text-[#2F80FF] border border-[#202328] hover:border-[#2F80FF] transition-colors"
              >
                {article.domain}
              </button>

              <span className="hidden sm:inline text-xs font-mono text-[#70737A]">
                NEXBYTEES EDITORIAL WIRE
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                aria-label="Like story"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors",
                  isLiked
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    : "bg-[#111317] border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038]"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-rose-400 text-rose-400")} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(article.id)}
                aria-label="Bookmark story"
                className={cn(
                  "p-2 rounded-md border transition-colors",
                  isBookmarked
                    ? "bg-[#2F80FF]/15 border-[#2F80FF] text-[#2F80FF]"
                    : "bg-[#111317] border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038]"
                )}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-[#2F80FF]")} />
              </button>

              <button
                onClick={() => onShare(article)}
                aria-label="Share story"
                className="p-2 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] hover:border-[#2C3038] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Article Header & Metadata */}
          <div className="p-6 md:p-10 space-y-7">
            {/* Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#2F80FF] uppercase font-semibold">
              <span>{article.domain}</span>
              <span className="text-[#70737A]">•</span>
              <span>SPECIAL REPORT</span>
            </div>

            {/* Journalistic Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.18] font-sans">
              {article.title}
            </h1>

            {/* Standfirst / Summary Lead */}
            <div className="text-base sm:text-lg text-[#A7A9AD] font-normal leading-relaxed border-l-2 border-[#2F80FF] pl-4 py-1 italic bg-[#111317]/50 rounded-r">
              {article.summary}
            </div>

            {/* Byline / Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-[#202328] text-xs text-[#70737A] font-mono">
              <div className="flex items-center gap-4">
                <span>
                  By <strong className="text-[#F5F5F5] font-sans">{article.author}</strong>
                </span>
                <span>•</span>
                <span className="text-[#2F80FF] font-sans font-semibold">{article.source}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#70737A]" />
                  {article.publishedAt}
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
                {article.trendingScore && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#A7A9AD]">
                      <Flame className="w-3.5 h-3.5 text-[#2F80FF]" />
                      Viral Rank: {article.trendingScore}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Full-Width Hero Photography */}
            <div className="relative w-full aspect-[16/9] md:aspect-[16/10] rounded-md overflow-hidden border border-[#202328] bg-[#08090B]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-[#70737A] font-mono">
                <span className="bg-[#08090B]/85 px-2 py-1 rounded border border-[#202328]">
                  Source: NEXBYTEES Visual Wire
                </span>
                <span className="bg-[#08090B]/85 px-2 py-1 rounded border border-[#202328]">
                  Desk: {article.domain}
                </span>
              </div>
            </div>

            {/* Key Editorial Takeaways */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="p-5 rounded-md bg-[#111317] border border-[#202328]">
                <div className="flex items-center gap-2 mb-3 text-[#2F80FF] text-xs font-mono uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Analytical Takeaways</span>
                </div>
                <ul className="space-y-2.5">
                  {article.keyTakeaways.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs md:text-sm text-[#A7A9AD]">
                      <Check className="w-4 h-4 text-[#2F80FF] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Article Prose Content */}
            <div className="space-y-5 text-sm md:text-base text-[#D4D7DC] leading-relaxed font-normal">
              {article.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-lg md:text-xl font-bold text-[#F5F5F5] pt-5 pb-1 border-b border-[#202328] tracking-tight font-sans"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Topic Keywords Row */}
            <div className="pt-6 border-t border-[#202328]">
              <span className="text-xs font-mono text-[#70737A] mr-3">INDEXED TOPICS:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-[#111317] text-[#A7A9AD] border border-[#202328] hover:border-[#2F80FF] hover:text-[#F5F5F5] cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Coverage Section */}
            {relatedStories.length > 0 && (
              <div className="pt-8 border-t border-[#202328]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F5] font-bold">
                    Related Coverage in {article.domain}
                  </h3>
                  <button
                    onClick={() => {
                      onSelectDomain(article.domain);
                      onClose();
                    }}
                    className="text-xs font-mono text-[#2F80FF] hover:underline flex items-center gap-1"
                  >
                    View Domain Feed &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {relatedStories.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="group p-3.5 rounded-md bg-[#111317] border border-[#202328] hover:border-[#2C3038] hover:bg-[#15171B] cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#2F80FF] uppercase tracking-wider">
                          {rel.domain}
                        </span>
                        <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] mt-1.5 line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#70737A] font-mono mt-3">
                        <span>{rel.publishedAt}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#70737A] group-hover:text-[#2F80FF] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Peer Technical Discussion Section */}
            <div className="pt-8 border-t border-[#202328] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2F80FF]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#F5F5F5] font-bold">
                    Technical Discourse &amp; Peer Commentary ({comments.length})
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#70737A]">VERIFIED WIRE</span>
              </div>

              {/* Comment Input */}
              {currentUser ? (
                <form onSubmit={handlePostComment} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Contribute technical insights, code perspective, or counter-analysis..."
                      className="w-full px-4 py-3 rounded-md bg-[#08090B] border border-[#202328] text-sm text-[#F5F5F5] placeholder-[#70737A] focus:outline-none focus:border-[#2F80FF] transition-colors resize-none font-sans"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-[#70737A] font-mono">
                      Posting as <strong className="text-[#F5F5F5]">{currentUser.name}</strong>
                    </div>
                    <button
                      type="submit"
                      disabled={isPostingComment || !newComment.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2F80FF] hover:bg-[#1A6BE6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs font-mono transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isPostingComment ? "Publishing..." : "Submit Insight"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-between gap-4">
                  <p className="text-xs text-[#A7A9AD] font-sans">
                    Join the technical discourse. Sign in or register to publish peer insights.
                  </p>
                  <button
                    onClick={onRequireAuth}
                    className="px-3.5 py-1.5 rounded-md bg-[#2F80FF]/15 border border-[#2F80FF] text-[#2F80FF] hover:bg-[#2F80FF]/25 text-xs font-mono transition-colors shrink-0"
                  >
                    Authenticate
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3">
                {isLoadingComments && (
                  <div className="py-6 text-center text-xs font-mono text-[#70737A]">
                    Loading commentary wire...
                  </div>
                )}

                {!isLoadingComments && comments.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-[#70737A]">
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
                      className="p-4 rounded-md bg-[#111317] border border-[#202328] space-y-2"
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
                            className="w-6 h-6 rounded-sm border border-[#202328] object-cover"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#F5F5F5]">
                              {comment.user?.name || "Contributor"}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#08090B] text-[#70737A] border border-[#202328]">
                              {comment.user?.role || "Contributor"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#70737A]">
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
                              className="p-1 rounded text-[#70737A] hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-[#D4D7DC] leading-relaxed pl-8 font-sans">
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Sticky Footer */}
          <div className="sticky bottom-0 bg-[#0B0D10]/95 backdrop-blur-md px-6 py-3.5 border-t border-[#202328] flex items-center justify-between">
            <div className="text-xs text-[#70737A] font-mono hidden sm:inline">
              NEXBYTEES Intelligence Editorial Wire
            </div>

            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <button
                onClick={() => onToggleBookmark(article.id)}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md bg-[#111317] border border-[#202328] text-[#A7A9AD] hover:text-[#F5F5F5] hover:border-[#2C3038] transition-colors"
              >
                <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "text-[#2F80FF] fill-[#2F80FF]")} />
                <span>{isBookmarked ? "Saved" : "Save Story"}</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs font-semibold px-4 py-2 rounded-md bg-[#2F80FF] hover:bg-[#1A6BE6] text-white transition-colors"
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
