'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  GitBranch,
  Search,
  Network,
  BarChart3,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  Layers,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function HomePage() {
  const { openTour, plainEnglishMode } = useAnalysisStore();

  return (
    <div className="space-y-20 py-10 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Soft Ambient Highlights */}
        <div className="ambient-glow top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-teal-200/30 blur-[90px] pointer-events-none" />
        <div className="ambient-glow top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-orange-200/30 blur-[90px] pointer-events-none" />

        {/* Small badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-teal-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#0f766e] shadow-2xs">
          <Award className="h-4 w-4 text-amber-500" />
          <span>Academic Research Tool</span>
        </div>

        {/* Large title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-6xl sm:leading-tight">
          TRACE<span className="text-[#0f766e]">VIDENCE</span>
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-xl sm:text-2xl font-serif italic text-[#0f766e] font-medium">
          &ldquo;Trace the Evidence. Measure the Trust.&rdquo;
        </p>

        {/* Short simple description (maximum 2-3 lines) */}
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[#475569] leading-relaxed">
          TRACEVIDENCE helps students, teachers, and researchers verify information by finding where claims originally came from, collapsing echo chambers, and computing transparent trust decisions.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          {/* Analyze Information (Primary - Coral) */}
          <Link
            href="/analyze"
            className="flex items-center space-x-2.5 rounded-xl bg-[#f97316] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:bg-[#ea580c] hover:-translate-y-0.5 transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Analyze Information</span>
          </Link>

          {/* Tour & Training (Secondary) */}
          <button
            onClick={() => openTour(0)}
            className="flex items-center space-x-2.5 rounded-xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-900/15 hover:bg-[#115e59] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Tour &amp; Training</span>
          </button>

          {/* Research Dashboard (Outline) */}
          <Link
            href="/research"
            className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#0f172a] hover:bg-slate-50 hover:border-[#0f766e] hover:text-[#0f766e] shadow-2xs transition-all"
          >
            <BarChart3 className="h-4 w-4 text-[#0f766e]" />
            <span>Research Dashboard</span>
          </Link>
        </div>
        {/* Quick Verdict Glossary Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="text-slate-500 font-semibold">Quick Guide:</span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700">
            <span>🟢</span><span>TRUST = Safe to cite (with source)</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 font-semibold text-amber-700">
            <span>🟡</span><span>VERIFY = Double-check before using</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 font-semibold text-rose-700">
            <span>🔴</span><span>ABSTAIN = Do NOT cite this</span>
          </span>
        </div>
      </section>

      {/* 2. WHY IT MATTERS SECTION (Three Equal Cards) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0f766e]">
            Why This Matters
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0f172a]">
            Why It Matters
          </h2>
          <p className="mt-2 text-sm text-[#475569]">
            Traditional fact-checking merely counts how many times something is repeated. Here is how TRACEVIDENCE changes the game:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: The Problem (Echo Chamber) */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 border border-rose-200 text-[#e11d48] mb-5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#e11d48]">
                The Problem
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#0f172a]">
                The Echo Chamber
              </h3>
              <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                When 10 news articles report the exact same claim, ordinary systems count 10 independent confirmations. In reality, all 10 outlets merely syndicated or rewrote one single unverified blog post or outdated paper.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-xs font-semibold text-rose-700">
              10 Articles ≠ 10 Independent Truths
            </div>
          </div>

          {/* Card 2: The Fix (TRACE-X) */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-[#0f766e] mb-5">
                <GitBranch className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                The Fix
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#0f172a]">
                TRACE-X Lineage Engine
              </h3>
              <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                TRACE-X automatically traces citations back to the root primary origin seed. It analyzes text reuse, publication dates, and syndicated wire copies to mathematically collapse 10 duplicate echoes down to their single root source.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-xs font-semibold text-[#0f766e]">
              Root Lineage Tracking & Collapse
            </div>
          </div>

          {/* Card 3: The Result (Trust Intelligence) */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-[#059669] mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#059669]">
                The Result
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#0f172a]">
                Trust Intelligence
              </h3>
              <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                Rather than guessing True or False, TRACEVIDENCE delivers an explainable trust score. When evidence is genuinely conflicted, circular, or outdated, it has the integrity to <strong>ABSTAIN</strong>, preventing dangerous AI hallucinations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 font-mono text-xs font-semibold text-[#059669]">
              Selective Prediction: TRUST / VERIFY / ABSTAIN
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (Simple 5-Step Visual Pipeline) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0f766e]">
              Step-By-Step Workflow
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#0f172a]">
              How It Works
            </h2>
            <p className="mt-2 text-sm text-[#475569]">
              Our transparent 5-step pipeline audits any claim with scientific rigor:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-center sm:text-left transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white font-mono text-xs font-bold">
                    1
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Extract
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">1. Extract Claims</h4>
                <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                  Breaks paragraphs into atomic, testable statements so complex ideas are evaluated individually.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-center sm:text-left transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white font-mono text-xs font-bold">
                    2
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Retrieve
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">2. Find Evidence</h4>
                <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                  Queries academic papers, official repositories, and credible media sources across tiered databases.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-center sm:text-left transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white font-mono text-xs font-bold">
                    3
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Lineage
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">3. Trace Origin</h4>
                <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                  Follows citations backwards to discover the original publication or experimental study.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-center sm:text-left transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white font-mono text-xs font-bold">
                    4
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Cluster
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">4. Check Independence</h4>
                <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                  Groups sources that copy one another to calculate the true number of distinct origin voices.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-center sm:text-left transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white font-mono text-xs font-bold">
                    5
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Decision
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0f172a]">5. Decide Trust</h4>
                <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                  Assigns calibrated decisions: TRUST (verified), VERIFY (needs checking), or ABSTAIN (conflicted).
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-100">
            <Link
              href="/analyze"
              className="flex items-center space-x-2 rounded-xl bg-[#f97316] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#ea580c] transition-all shadow-xs"
            >
              <span>Try It in the Analyze Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/benchmarks"
              className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0f766e] hover:border-teal-200 transition-all"
            >
              <span>Explore Benchmark Cases</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SHORT ACADEMIC DISCLAIMER */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-900 leading-relaxed shadow-2xs">
          <div className="flex items-center justify-center space-x-2 font-mono font-bold text-amber-800 mb-1">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>Academic Research Disclaimer</span>
          </div>
          <p>
            TRACEVIDENCE is an academic research tool. It provides visible evidence provenance and uncertainty quantification, not an infallible truth oracle. Users should always consult primary literature for safety-critical decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
