import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
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
            <Lock className="w-4 h-4" />
            <span>Local Storage & Data Isolation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Last updated: September 2026 • NEXBYTEES Frontend-Only Architecture
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            <h2 className="text-base font-bold text-sky-400 font-mono uppercase mb-2">
              Zero Server-Side Tracking & No Remote Database
            </h2>
            <p>
              NEXBYTEES is an exclusively client-side frontend prototype. We do not operate a remote database, authentication server, user tracking telemetry, or analytics trackers. Your personal data is never transmitted across the network to external servers.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-white font-mono uppercase">
              What Is Stored In Your Browser (localStorage)
            </h2>
            <p>
              All state persistence is maintained strictly inside your browser’s isolated local storage:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-xs font-mono text-slate-300">
              <li>
                <strong>Demo Account & Authentication:</strong> Your simulated account details (full name, email, credentials) and current active session token are stored locally.
              </li>
              <li>
                <strong>Saved Stories (Bookmarks):</strong> The list of article identifiers you have bookmarked for offline reference.
              </li>
              <li>
                <strong>Uploaded Technology News:</strong> Articles you submit through the “Upload Story” workflow remain saved in your local feed.
              </li>
              <li>
                <strong>Theme Preference:</strong> Your selected visual theme (Dark / Light mode).
              </li>
              <li>
                <strong>Onboarding Interests:</strong> Your curated technology domain specializations selected during onboarding.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-[#08132e]/60 border border-slate-800">
            <h2 className="text-base font-bold text-white font-mono uppercase mb-2">
              Clearing Your Data
            </h2>
            <p>
              You maintain total control over your local data at all times. Clearing your browser cookies/site data or clicking “Clear all” in the Saved drawer immediately purges all stored state.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
