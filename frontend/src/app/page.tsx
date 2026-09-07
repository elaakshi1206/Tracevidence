'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import DecisionBadge from '@/components/common/DecisionBadge';
import {
  GitBranch,
  ShieldCheck,
  Search,
  Network,
  BarChart3,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
  Clock,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { loadBenchmarkCase, openTour } = useAnalysisStore();

  const handleCaseClick = (caseId: string) => {
    loadBenchmarkCase(caseId);
    router.push('/analyze');
  };

  return (
    <div className="space-y-24 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Dynamic Multi-Color Ambient Glows (Red, Blue, Green, White) */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-rose-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-96 rounded-full bg-emerald-500/18 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/10 blur-[100px] pointer-events-none" />

        {/* Top Announcement Pill */}
        <div className="inline-flex items-center space-x-2.5 rounded-full border border-white/25 bg-gradient-to-r from-rose-500/15 via-blue-500/15 to-emerald-500/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-xl shadow-lg">
          <Award className="h-4 w-4 text-amber-300" />
          <span>Avishkar Research Prototype · Human-Verifiable Decision Intelligence</span>
        </div>

        {/* Grand Hero Title with Red-Blue-Green-White Gradient */}
        <h1 className="mt-8 font-mono text-5xl font-black tracking-tight text-white sm:text-7xl sm:leading-tight">
          TRACE<span className="text-gradient-rbgw">VIDENCE</span>
        </h1>

        <p className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-200 italic">
          &ldquo;Trace the Evidence. Measure the Trust.&rdquo;
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-xl text-slate-200 leading-relaxed font-normal">
          Standard chatbots and fact-checkers produce opaque scores and binary verdicts. TRACEVIDENCE formalizes an academic framework integrating{' '}
          <strong className="text-blue-300 font-bold">TRACE-X</strong> (deep provenance tracing, origin seed detection, source collapse) and{' '}
          <strong className="text-emerald-300 font-bold">AIVIDENCE</strong> (selective prediction: TRUST / VERIFY / ABSTAIN with mathematical transparency).
        </p>

        {/* Primary CTAs with Red-Blue-Green-White Gradients */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/analyze"
            className="btn-gradient-rbgw flex items-center space-x-3 rounded-2xl px-8 py-4 text-base sm:text-lg font-bold tracking-wide transition-all shadow-xl"
          >
            <Search className="h-5 w-5" />
            <span>Analyze Information</span>
          </Link>

          <button
            onClick={() => openTour(0)}
            className="flex items-center space-x-3 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-base sm:text-lg font-bold text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/40 shadow-xl transition-all"
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span>Interactive Tutorial (60s)</span>
          </button>

          <Link
            href="/research"
            className="flex items-center space-x-3 rounded-2xl border border-white/20 bg-slate-900/90 px-7 py-4 text-base sm:text-lg font-semibold text-slate-100 backdrop-blur-xl hover:border-blue-400 hover:bg-slate-800 transition-all shadow-lg"
          >
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <span>Research Dashboard</span>
          </Link>
        </div>

        {/* Core Principles Pill Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-3.5 text-sm sm:text-base font-semibold text-slate-200">
          <span className="flex items-center space-x-2 rounded-xl bg-slate-900/80 px-4 py-2.5 border border-rose-500/30 shadow-md">
            <GitBranch className="h-4 w-4 text-rose-400" />
            <span>Provenance Lineage Trees</span>
          </span>
          <span className="flex items-center space-x-2 rounded-xl bg-slate-900/80 px-4 py-2.5 border border-blue-500/30 shadow-md">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Source Independence Clustering</span>
          </span>
          <span className="flex items-center space-x-2 rounded-xl bg-slate-900/80 px-4 py-2.5 border border-emerald-500/30 shadow-md">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>Temporal Freshness Decay</span>
          </span>
          <span className="flex items-center space-x-2 rounded-xl bg-slate-900/80 px-4 py-2.5 border border-white/30 shadow-md">
            <ShieldCheck className="h-4 w-4 text-white" />
            <span>Selective Prediction (ABSTAIN)</span>
          </span>
        </div>
      </section>

      {/* Human-Centered Guide: Why Standard Fact-Checking Fails */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card-gradient-border p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-6">
            <div className="flex items-center space-x-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-blue-500 to-emerald-400 p-[1px] shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#0c1322]">
                  <Compass className="h-5 w-5 text-white" />
                </div>
              </span>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
                  New Here? How It Works In Plain English
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Why Standard Fact-Checking Fails & How TRACEVIDENCE Protects You
                </h3>
              </div>
            </div>

            <button
              onClick={() => openTour(0)}
              className="btn-gradient-rbgw flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm sm:text-base font-bold shadow-md"
            >
              <span>Take Full Guided Tour</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 shadow-lg">
              <div className="flex items-center space-x-2.5 text-rose-300 font-bold text-base">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <span>The Problem: The Echo Chamber</span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                If 12 news blogs report that an EV battery requires 50,000 km to break even, standard checkers count 12 corroborating sources. In reality, all 12 simply syndicated 1 single outdated Swedish paper.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 shadow-lg">
              <div className="flex items-center space-x-2.5 text-blue-300 font-bold text-base">
                <GitBranch className="h-5 w-5 text-blue-400" />
                <span>The Fix: TRACE-X Lineage</span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                TRACE-X audits citation paths back to the primary origin seed. It recognizes syndicated wire copy and mathematically collapses duplicate echoes back to <strong>1 single origin</strong>!
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg">
              <div className="flex items-center space-x-2.5 text-emerald-300 font-bold text-base">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>The Result: Trust Intelligence</span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                Instead of guessing True or False, AIVIDENCE computes an explainable trust score. When epistemic uncertainty is too high, it <strong>ABSTAINS</strong>, preventing automated hallucination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Peer-Reviewed Benchmark Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-400">
              Interactive Case Studies
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white">
              Preloaded Academic Benchmark Demos
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-300">
              Click any peer-reviewed dataset below to instantly inspect the live provenance graph, independence collapse, and trust decisions.
            </p>
          </div>

          <Link
            href="/research"
            className="flex items-center space-x-1.5 text-sm sm:text-base font-semibold text-blue-400 hover:text-white transition-colors"
          >
            <span>View full ablation suite</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENCHMARK_CASES.map((b) => (
            <div
              key={b.id}
              onClick={() => handleCaseClick(b.id)}
              className="group cursor-pointer rounded-2xl border border-white/15 bg-gradient-to-b from-[#10182b] to-[#0c1220] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/35 hover:shadow-2xl hover:shadow-blue-500/15"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-800/90 px-2.5 py-1 font-mono text-xs font-bold text-white border border-white/15">
                  {b.tag}
                </span>
                <DecisionBadge decision={b.expectedOutcome} size="md" />
              </div>

              <h3 className="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                {b.title}
              </h3>

              <div className="mt-1.5 text-xs sm:text-sm font-mono text-slate-400">{b.domain}</div>

              <p className="mt-3 text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
                {b.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                <span className="rounded-lg bg-amber-950/60 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-800/50">
                  {b.highlightSignal}
                </span>

                <span className="flex items-center space-x-1.5 text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Audit Case</span>
                  <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture & Pipeline Narrative */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10192e] via-[#0c1322] to-[#080d18] p-8 sm:p-14 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
              The Academic Pipeline
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-white">
              From Raw Proposition to Selective Decision Intelligence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Traditional systems rely on token probabilities. TRACEVIDENCE enforces rigorous epistemic constraints across 5 decoupled modules.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-5">
            <div className="rounded-2xl bg-black/40 p-5 border border-rose-500/25 shadow-lg">
              <div className="font-mono text-xs text-rose-400 font-bold">01 / EXTRACTION</div>
              <h4 className="mt-2.5 font-bold text-white text-sm sm:text-base">Atomic Decomposition</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Breaks discourse into atomic, falsifiable claims with isolated entities and target quantities.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-blue-500/25 shadow-lg">
              <div className="font-mono text-xs text-blue-400 font-bold">02 / RETRIEVAL</div>
              <h4 className="mt-2.5 font-bold text-white text-sm sm:text-base">Tiered Source Audit</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Classifies candidate literature into Academic, Government, Official, Media, or Aggregator tiers.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-emerald-500/25 shadow-lg">
              <div className="font-mono text-xs text-emerald-400 font-bold">03 / TRACE-X</div>
              <h4 className="mt-2.5 font-bold text-white text-sm sm:text-base">Provenance Lineage</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Computes verbatim reuse and traces origin seeds to detect echoes, syndicated wire copy, and circularity.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-amber-500/25 shadow-lg">
              <div className="font-mono text-xs text-amber-400 font-bold">04 / SIGNALS</div>
              <h4 className="mt-2.5 font-bold text-white text-sm sm:text-base">Freshness & Conflict</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Calculates exponential temporal decay exp(-λΔt) and flags direct empirical refutations.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-white/25 shadow-lg">
              <div className="font-mono text-xs text-white font-bold">05 / AIVIDENCE</div>
              <h4 className="mt-2.5 font-bold text-white text-sm sm:text-base">Selective Prediction</h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Replaces hallucinations with principled decisions: TRUST, VERIFY, or selective ABSTAIN.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
