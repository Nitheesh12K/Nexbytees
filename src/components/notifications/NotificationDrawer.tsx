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
        className="relative z-10 w-full max-w-md bg-[#0B0D10] border-l border-[#202328] h-full flex flex-col shadow-2xl text-[#F5F5F5]"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#202328] flex items-center justify-between bg-[#0E1013]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-center text-[#2F80FF]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F5] tracking-tight flex items-center gap-2 uppercase font-mono">
                <span>Intelligence Alerts</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2F80FF] text-white font-bold">
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
                className="text-[11px] font-mono text-[#2F80FF] hover:underline flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-[#70737A]">
              Synchronizing intelligence alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell className="w-10 h-10 text-[#70737A]/40 mb-3" />
              <h3 className="text-sm font-semibold text-[#F5F5F5]">All caught up</h3>
              <p className="text-xs text-[#70737A] mt-1 max-w-xs">
                No new intelligence notifications at this time. You will be alerted when other contributors interact with your submissions.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={cn(
                  "p-3.5 rounded-md border transition-all duration-200 cursor-pointer flex items-start gap-3",
                  item.isRead
                    ? "bg-[#111317] border-[#202328] text-[#70737A]"
                    : "bg-[#15171B] border-[#2F80FF]/40 text-[#F5F5F5]"
                )}
              >
                <div className="w-7 h-7 rounded-md bg-[#0E1013] border border-[#202328] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn("text-xs font-bold truncate", !item.isRead ? "text-[#F5F5F5]" : "text-[#A7A9AD]")}>
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#2F80FF] shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-[#A7A9AD] mt-1 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#202328] text-[10px] font-mono text-[#70737A]">
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
                        className="text-[#2F80FF] hover:underline font-semibold"
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
