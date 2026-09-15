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
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full max-w-sm bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 z-10 text-[#F5F5F5] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#70737A] hover:text-white p-1.5 rounded-md bg-[#111317] border border-[#202328] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "w-11 h-11 rounded-md flex items-center justify-center mb-4",
              variant === "danger"
                ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
            )}
          >
            {variant === "danger" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
          </div>

          <h3 className="text-sm font-bold text-[#F5F5F5] tracking-wide font-mono uppercase">
            {title}
          </h3>

          <p className="text-xs text-[#A7A9AD] mt-2 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-md border border-[#202328] bg-[#111317] hover:bg-[#15171B] text-xs font-semibold text-[#A7A9AD] hover:text-white transition-colors cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "py-2 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-[#2F80FF] hover:bg-[#2566CC] text-white"
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
