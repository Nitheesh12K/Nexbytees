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
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-[#0B0D10] border border-[#202328] rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 z-10 text-[#F5F5F5] overflow-hidden"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 rounded-sm transition-all duration-300",
                s === step
                  ? "w-8 bg-[#2F80FF]"
                  : s < step
                  ? "w-4 bg-[#2F80FF]/50"
                  : "w-4 bg-[#202328]"
              )}
            />
          ))}
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-md bg-[#111317] border border-[#202328] flex items-center justify-center text-[#2F80FF] mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-[10px] font-mono tracking-widest text-[#2F80FF] uppercase font-semibold mb-2">
              STEP 01 OF 03 · DISPATCH DESK SETUP
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#F5F5F5] tracking-tight uppercase">
              WELCOME TO NEXBYTEES
            </h2>

            <p className="text-xs text-[#A7A9AD] mt-2 max-w-sm mx-auto font-sans leading-relaxed">
              Your technology intelligence edition starts here. Discover vetted breakthroughs across hardware, autonomous systems, and scientific frontiers.
            </p>

            <button
              onClick={() => setStep(2)}
              className="mt-7 w-full py-3 px-6 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Screen 2: Choose Interests */}
        {step === 2 && (
          <div className="text-center py-2">
            <div className="text-[10px] font-mono tracking-widest text-[#2F80FF] uppercase font-semibold mb-1">
              STEP 02 OF 03 · REPORTING PREFERENCES
            </div>

            <h2 className="text-lg sm:text-xl font-black text-[#F5F5F5] tracking-tight uppercase">
              CHOOSE YOUR REPORTING DESKS
            </h2>

            <p className="text-xs text-[#70737A] mt-1 max-w-xs mx-auto mb-4">
              Select the technology disciplines you want prioritized in your wire.
            </p>

            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {DOMAIN_OPTIONS.map((dom) => {
                const Icon = dom.icon;
                const isSelected = selectedInterests.includes(dom.label);

                return (
                  <button
                    key={dom.label}
                    onClick={() => toggleInterest(dom.label)}
                    type="button"
                    className={cn(
                      "p-3 rounded-md border flex flex-col items-center gap-1.5 transition-colors text-center cursor-pointer",
                      isSelected
                        ? "bg-[#15171B] border-[#2F80FF] text-[#F5F5F5]"
                        : "bg-[#111317] border-[#202328] text-[#70737A] hover:border-[#2C3038] hover:text-[#F5F5F5]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-mono font-medium truncate w-full">
                      {dom.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-6 w-full py-3 px-6 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Confirm ({selectedInterests.length} selected)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Screen 3: Ready */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-md bg-[#111317] border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>

            <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold mb-2">
              STEP 03 OF 03 · READY
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#F5F5F5] tracking-tight uppercase">
              YOUR WIRE IS CONFIGURED
            </h2>

            <p className="text-xs text-[#A7A9AD] mt-2 max-w-sm mx-auto font-sans leading-relaxed">
              Your personalized technology edition is ready. Stay ahead of global tech journalism as stories break.
            </p>

            <button
              onClick={handleFinish}
              className="mt-7 w-full py-3 px-6 rounded-md bg-[#2F80FF] hover:bg-[#2566CC] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Enter NEXBYTEES Wire</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
