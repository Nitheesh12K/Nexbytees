"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  hasError?: boolean;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
  name,
  id,
  hasError = false,
  className,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#70737A] pointer-events-none" />
      <input
        type={show ? "text" : "password"}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={id}
        className={cn(
          "w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-md transition-all font-sans text-[#F5F5F5] placeholder-[#70737A]",
          "bg-[#111317] border",
          hasError
            ? "border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50"
            : "border-[#202328] focus:border-[#2F80FF] focus:ring-1 focus:ring-[#2F80FF]",
          className
        )}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#70737A] hover:text-[#F5F5F5] transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4 text-[#2F80FF]" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};
