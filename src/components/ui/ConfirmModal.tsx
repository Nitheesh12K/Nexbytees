"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

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
        className="relative w-full max-w-sm bg-[#091124] border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 text-slate-100 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
              variant === "danger"
                ? "bg-rose-500/15 border border-rose-500/35 text-rose-400"
                : "bg-amber-500/15 border border-amber-500/35 text-amber-400"
            )}
          >
            {variant === "danger" ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <LogOut className="w-6 h-6" />
            )}
          </div>

          <h3 className="text-base font-bold text-white tracking-wider font-mono uppercase">
            {title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              {cancelText}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg",
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                  : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-900/30"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
