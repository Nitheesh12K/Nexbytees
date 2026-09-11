"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  Compass,
  Cpu,
  Bot,
  ShieldCheck,
  Atom,
  Rocket,
  Layers,
  Code2,
  Cloud,
  Smartphone,
  Car,
  Glasses,
  Blocks,
} from "lucide-react";
import { saveUserInterests } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (interests: string[]) => void;
  userName?: string;
}

const DOMAIN_OPTIONS = [
  { label: "AI", icon: Cpu },
  { label: "Robotics", icon: Bot },
  { label: "Cybersecurity", icon: ShieldCheck },
  { label: "Quantum", icon: Atom },
  { label: "Space", icon: Rocket },
  { label: "Semiconductors", icon: Layers },
  { label: "Software", icon: Code2 },
  { label: "Cloud", icon: Cloud },
  { label: "Smartphones", icon: Smartphone },
  { label: "Automotive", icon: Car },
  { label: "AR / VR", icon: Glasses },
  { label: "Blockchain", icon: Blocks },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  userName = "Pioneer",
}) => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "AI",
    "Quantum",
    "Robotics",
  ]);

  if (!isOpen) return null;

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleFinish = () => {
    saveUserInterests(selectedInterests);
    onComplete(selectedInterests);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-lg"
      />

      {/* Dialog */}
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-[#08132e] border border-sky-400/40 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.95),0_0_30px_rgba(56,189,248,0.25)] p-6 sm:p-8 z-10 text-slate-100 overflow-hidden"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s === step
                  ? "w-8 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  : s < step
                  ? "w-4 bg-sky-600"
                  : "w-4 bg-slate-800"
              )}
            />
          ))}
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto mb-5 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold mb-2">
              STEP 1 OF 3
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              WELCOME TO NE<span className="text-sky-400">X</span>BYTEES
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto font-sans leading-relaxed">
              Your technology world starts here. Discover vetted breakthroughs across hardware, autonomous intelligence, and quantum frontiers.
            </p>

            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.01]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Screen 2: Choose Interests */}
        {step === 2 && (
          <div className="text-center py-2">
            <div className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold mb-1">
              STEP 2 OF 3
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              CHOOSE YOUR INTERESTS
            </h2>

            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto mb-5">
              Select the technology domains you want prioritized in your wire.
            </p>

            <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {DOMAIN_OPTIONS.map((dom) => {
                const Icon = dom.icon;
                const isSelected = selectedInterests.includes(dom.label);

                return (
                  <button
                    key={dom.label}
                    onClick={() => toggleInterest(dom.label)}
                    type="button"
                    className={cn(
                      "p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center",
                      isSelected
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                        : "bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-mono font-medium truncate w-full">
                      {dom.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-6 w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all"
            >
              <span>Confirm ({selectedInterests.length} selected)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Screen 3: Ready */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8" />
            </div>

            <div className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold mb-2">
              STEP 3 OF 3
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              YOUR FEED, YOUR INTERESTS.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto font-sans leading-relaxed">
              Your personalized technology wire is ready. Stay ahead of breakthroughs as they happen.
            </p>

            <button
              onClick={handleFinish}
              className="mt-8 w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.01]"
            >
              <Compass className="w-4 h-4" />
              <span>Start Exploring</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
