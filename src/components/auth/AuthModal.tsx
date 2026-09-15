"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthMode, User } from "@/types";
import { loginUser, registerUser, resetPassword } from "@/lib/auth";
import { PasswordInput } from "./PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onAuthSuccess: (user: User, message: string, isFirstTimeSignUp?: boolean) => void;
  requiredForAction?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  onAuthSuccess,
  requiredForAction,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // States
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("This field is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("This field is required.");
      return;
    }

    setIsLoading(true);
    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthSuccess(res.user, `Welcome back, ${res.user.name}!`);
      onClose();
    } else {
      setError(res.error || "Invalid email or password.");
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError("This field is required.");
      return;
    }
    if (!email.trim()) {
      setError("This field is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    const res = await registerUser(name, email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthSuccess(res.user, `Account created! Welcome, ${res.user.name}.`, true);
      onClose();
    } else {
      setError(res.error || "Failed to create account.");
    }
  };

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setError("This field is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    setSuccessMsg("Reset authorization granted. Please enter your new password.");
    setMode("reset");
    setError(null);
  };

  const handleResetPassword = async () => {
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(email, password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("Password updated successfully! Please log in.");
      setPassword("");
      setConfirmPassword("");
      setMode("login");
    } else {
      setError(res.error || "Failed to reset password.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      handleLogin();
    } else if (mode === "signup") {
      handleSignUp();
    } else if (mode === "forgot") {
      handleSendResetLink();
    } else if (mode === "reset") {
      handleResetPassword();
    }
  };

  const handleQuickDemoFill = () => {
    setEmail("alex@nexbytees.com");
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* 3D Glassmorphism Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className={cn(
          "relative w-full max-w-md bg-[#0B0D10] border border-[#202328] rounded-md",
          "shadow-[0_20px_60px_rgba(0,0,0,0.85)]",
          "z-10 overflow-hidden flex flex-col text-[#F5F5F5]"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md bg-[#111317] border border-[#202328] text-[#70737A] hover:text-[#F5F5F5] transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-6 sm:px-8 text-center relative z-10 border-b border-[#202328]/60">
          <div className="inline-flex flex-col items-center cursor-pointer select-none mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#2F80FF] rounded-sm" />
              <div className="text-lg font-black tracking-tight text-[#F5F5F5] uppercase leading-none">
                NEXBYTEES
              </div>
            </div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#70737A] uppercase mt-1">
              TECH MEDIA & INTELLIGENCE
            </span>
          </div>

          <h2 className="text-base font-bold tracking-tight text-[#F5F5F5] uppercase">
            {mode === "signup" && "Create Reader Account"}
            {mode === "login" && "Access Your Account"}
            {mode === "forgot" && "Reset Security Key"}
            {mode === "reset" && "Set New Password"}
          </h2>

          <p className="text-xs text-[#A7A9AD] mt-1 font-sans">
            {mode === "signup" && "Join the verified global technology journalism community."}
            {mode === "login" && "Sign in to access your saved coverage, tips, and dispatches."}
            {mode === "forgot" && "Enter your registered email address to receive an authorization link."}
            {mode === "reset" && "Choose a strong password with at least 8 characters."}
          </p>

          {requiredForAction && (
            <div className="mt-3 p-2 rounded-md bg-[#111317] border border-[#2F80FF]/30 text-xs text-[#2F80FF] font-mono flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{requiredForAction}</span>
            </div>
          )}
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mx-6 sm:mx-8 mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/35 text-xs text-rose-300 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 sm:mx-8 mb-3 p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 space-y-4 relative z-10">
          {/* Sign Up: Full Name */}
          {mode === "signup" && (
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#70737A] pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Elena Rostova"
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] placeholder-[#70737A] focus:outline-none focus:border-[#2F80FF] focus:ring-1 focus:ring-[#2F80FF] transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* Email: for Login, Signup, and Forgot */}
          {mode !== "reset" && (
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#70737A] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="engineer@domain.com"
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-md bg-[#111317] border border-[#202328] text-[#F5F5F5] placeholder-[#70737A] focus:outline-none focus:border-[#2F80FF] focus:ring-1 focus:ring-[#2F80FF] transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* Password: for Login, Signup, Reset */}
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD]">
                  {mode === "reset" ? "New Password" : "Password"}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-sans text-[#2F80FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <PasswordInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
              />
              {mode === "signup" && (
                <div className="text-[10px] text-[#70737A] font-mono mt-1">
                  Must be at least 8 characters
                </div>
              )}
            </div>
          )}

          {/* Confirm Password: for Signup & Reset */}
          {(mode === "signup" || mode === "reset") && (
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#A7A9AD] mb-1.5">
                Confirm Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Terms checkbox for signup */}
          {mode === "signup" && (
            <div className="flex items-start gap-2 pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#202328] bg-[#111317] text-[#2F80FF] focus:ring-[#2F80FF] cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-xs text-[#A7A9AD] select-none cursor-pointer leading-tight">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-[#2F80FF] hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-[#2F80FF] hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {mode === "login" && "Signing in…"}
                  {mode === "signup" && "Creating account…"}
                  {mode === "forgot" && "Sending reset link…"}
                  {mode === "reset" && "Updating password…"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>
                  {mode === "login" && "Log In"}
                  {mode === "signup" && "Create Reader Account"}
                  {mode === "forgot" && "Send Authorization Link"}
                  {mode === "reset" && "Save Password"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Demo account helper on login */}
          {mode === "login" && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-mono text-[#70737A] hover:text-[#2F80FF] transition-colors underline"
              >
                Use Demo Account (alex@nexbytees.com)
              </button>
            </div>
          )}

          {/* Switchers */}
          <div className="text-center pt-3 border-t border-[#202328] text-xs text-[#70737A]">
            {mode === "signup" && (
              <div>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[#2F80FF] font-semibold hover:underline ml-1"
                >
                  Log in
                </button>
              </div>
            )}

            {mode === "login" && (
              <div>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[#2F80FF] font-semibold hover:underline ml-1"
                >
                  Sign up
                </button>
              </div>
            )}

            {(mode === "forgot" || mode === "reset") && (
              <div>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[#2F80FF] font-semibold hover:underline ml-1"
                >
                  Back to Log In
                </button>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
