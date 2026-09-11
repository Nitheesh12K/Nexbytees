import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#02050f] text-slate-100 py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to NEXBYTEES Home</span>
        </Link>

        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial Standards & Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Last updated: September 2026 • NEXBYTEES Frontend Prototype
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800">
            <h2 className="text-base font-bold text-white font-mono uppercase mb-2">
              1. Platform Nature & Prototype Scope
            </h2>
            <p>
              NEXBYTEES is an interactive technology intelligence platform demonstrating next-generation 3D editorial design, domain taxonomy, and client-side technology reporting. All interactions, user accounts, and submitted stories are handled client-side within your browser.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800">
            <h2 className="text-base font-bold text-white font-mono uppercase mb-2">
              2. Content Attribution & Mock Data
            </h2>
            <p>
              Editorial technology stories, benchmarks, and data points displayed on this website represent realistic simulation content modeled after global research disclosures, engineering papers, and hardware announcements.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800">
            <h2 className="text-base font-bold text-white font-mono uppercase mb-2">
              3. Community Submissions
            </h2>
            <p>
              Users submitting articles via the “Upload Story” feature contribute to their local browser feed tagged under “COMMUNITY SUBMISSION”. Content published locally can be edited and deleted at any time through the profile menu.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800">
            <h2 className="text-base font-bold text-white font-mono uppercase mb-2">
              4. Codebase & Licensing
            </h2>
            <p>
              The platform source code, 3D digital Earth canvas, and components are provided under permissive prototype licensing for technology evaluation and demonstration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
