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
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "relative w-full max-w-md bg-[#08132e]/95 border border-sky-400/35 rounded-2xl",
          "shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.25)]",
          "backdrop-blur-2xl z-10 overflow-hidden flex flex-col text-slate-100"
        )}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex flex-col items-center cursor-pointer select-none mb-4">
            <div className="text-xl font-black tracking-wider text-white uppercase flex items-center">
              NE<span className="text-sky-400">X</span>BYTEES
            </div>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              AI • TECHNOLOGY • FUTURE
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            {mode === "signup" && "Create your account"}
            {mode === "login" && "Welcome back"}
            {mode === "forgot" && "Reset Password"}
            {mode === "reset" && "New Password"}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {mode === "signup" && "Join the global technology intelligence community"}
            {mode === "login" && "Log in to access your saved stories and community publishing"}
            {mode === "forgot" && "Enter your registered email address to receive a secure link"}
            {mode === "reset" && "Choose a strong password with at least 8 characters"}
          </p>

          {requiredForAction && (
            <div className="mt-3 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 font-mono flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
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
          <div className="mx-6 sm:mx-8 mb-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-xs text-emerald-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 space-y-4 relative z-10">
          {/* Sign Up: Full Name */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Elena Rostova"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0a1738]/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* Email: for Login, Signup, and Forgot */}
          {mode !== "reset" && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="engineer@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#0a1738]/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* Password: for Login, Signup, Reset */}
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
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
                    className="text-[11px] font-sans text-sky-400 hover:underline"
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
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Must be at least 8 characters
                </div>
              )}
            </div>
          )}

          {/* Confirm Password: for Signup & Reset */}
          {(mode === "signup" || mode === "reset") && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
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
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-xs text-slate-300 select-none cursor-pointer leading-tight">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-sky-400 hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-sky-400 hover:underline font-medium"
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
            className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.01]"
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
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                  {mode === "reset" && "Save New Password"}
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
                className="text-[11px] font-mono text-sky-400/90 hover:underline"
              >
                Use Demo Account (alex@nexbytees.com)
              </button>
            </div>
          )}

          {/* Switchers */}
          <div className="text-center pt-3 border-t border-slate-800/80 text-xs text-slate-400">
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
                  className="text-sky-400 font-semibold hover:underline ml-1"
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
                  className="text-sky-400 font-semibold hover:underline ml-1"
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
                  className="text-sky-400 font-semibold hover:underline ml-1"
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
