"use client";

import React, { useState, useEffect } from "react";
import { NotificationItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCheck,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  UploadCloud,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "@/lib/api";
import { formatTimeAgo } from "@/lib/api/mappers";
import { cn } from "@/lib/utils";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (text: string, type: "success" | "info" | "warning" | "error") => void;
  onNavigateToStory?: (storyId: string) => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNotify,
  onNavigateToStory,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotificationsApi();
      if (res.success && Array.isArray(res.data?.notifications || res.data)) {
        const list = (res.data?.notifications || res.data).map((n: any) => ({
          id: n.id,
          type: n.type || "SYSTEM",
          title: n.title,
          message: n.message,
          isRead: Boolean(n.isRead),
          link: n.link,
          createdAt: n.createdAt,
        }));
        setNotifications(list);
        const unread = list.filter((n: NotificationItem) => !n.isRead).length;
        onUnreadCountChange?.(unread);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      const remainingUnread = notifications.filter(
        (n) => n.id !== id && !n.isRead
      ).length;
      onUnreadCountChange?.(remainingUnread);
    } catch {
      // Offline fallback
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
      onNotify?.("All notifications marked as read.", "info");
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case "UPLOAD_APPROVED":
      case "UPLOAD_REJECTED":
        return <UploadCloud className="w-4 h-4 text-emerald-400" />;
      case "SECURITY":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

      {/* Slide-out Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-md bg-[#091124] border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Intelligence Alerts</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-bold">
                    {unreadCount}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-sky-500/10 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
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

        {/* Notifications Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-500">
              Synchronizing intelligence alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-white">All caught up</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                No new intelligence notifications at this time. You will be alerted when other contributors interact with your submissions.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={cn(
                  "p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3",
                  item.isRead
                    ? "bg-[#0b1428]/40 border-slate-800/60 text-slate-400"
                    : "bg-[#0c1a3c]/70 border-sky-500/40 text-slate-200 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                )}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn("text-xs font-bold truncate", !item.isRead && "text-white")}>
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/40 text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(item.createdAt)}</span>
                    </div>

                    {!item.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item.id);
                        }}
                        className="text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
