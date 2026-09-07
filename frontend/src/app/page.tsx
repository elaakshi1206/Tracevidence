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
  const { loadBenchmarkCase } = useAnalysisStore();

  const handleCaseClick = (caseId: string) => {
    loadBenchmarkCase(caseId);
    router.push('/analyze');
  };

  return (
    <div className="space-y-24 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-96 sm:w-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-sm shadow-cyan-500/20">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>Avishkar Research Prototype · Decision Intelligence Framework</span>
        </div>

        <h1 className="mt-6 font-mono text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
          TRACE<span className="text-cyan-400">VIDENCE</span>
        </h1>

        <p className="mt-3 text-lg sm:text-2xl font-medium text-slate-300 font-serif italic">
          &ldquo;Trace the Evidence. Measure the Trust.&rdquo;
        </p>

        <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Standard chatbots and fact-checkers produce opaque scores and binary verdicts. TRACEVIDENCE formalizes an academic framework integrating{' '}
          <strong className="text-cyan-300 font-semibold">TRACE-X</strong> (deep provenance tracing, origin seed detection, apparent vs independent source collapse) and{' '}
          <strong className="text-emerald-300 font-semibold">AIVIDENCE</strong> (selective prediction: TRUST / VERIFY / ABSTAIN with mathematical transparency).
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="flex items-center space-x-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-7 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 hover:from-cyan-400 hover:to-indigo-500"
          >
            <Search className="h-4 w-4" />
            <span>Analyze Information</span>
          </Link>

          <Link
            href="/research"
            className="flex items-center space-x-2.5 rounded-xl border border-white/10 bg-slate-900/80 px-7 py-3.5 font-mono text-xs sm:text-sm font-semibold text-slate-200 backdrop-blur-md hover:border-cyan-500/40 hover:bg-slate-800 transition-all"
          >
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            <span>Research Dashboard (Judges)</span>
          </Link>
        </div>

        {/* Core Principles Pill Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
            <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
            <span>Provenance Lineage Trees</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Source Independence Clustering</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Temporal Freshness Hazard Decay</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Selective Prediction (ABSTAIN)</span>
          </span>
        </div>
      </section>

      {/* Peer-Reviewed Benchmark Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              Interactive Case Studies
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white font-mono">
              Preloaded Academic Benchmark Demos
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Click any peer-reviewed dataset below to instantly inspect the live provenance graph, independence collapse, and trust decisions.
            </p>
          </div>

          <Link
            href="/research"
            className="flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <span>View full ablation table</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENCHMARK_CASES.map((b) => (
            <div
              key={b.id}
              onClick={() => handleCaseClick(b.id)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0d1424]/90 p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-400 border border-white/10">
                  {b.tag}
                </span>
                <DecisionBadge decision={b.expectedOutcome} size="sm" />
              </div>

              <h3 className="mt-3 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {b.title}
              </h3>

              <div className="mt-1 text-[11px] font-mono text-slate-400">{b.domain}</div>

              <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {b.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                <span className="rounded bg-amber-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-800/40">
                  {b.highlightSignal}
                </span>

                <span className="flex items-center space-x-1 text-cyan-400 font-mono text-[11px] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Audit Case</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture & Pipeline Narrative */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1424] via-[#080d1a] to-[#07090e] p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              The Academic Pipeline
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono">
              From Raw Proposition to Selective Decision Intelligence
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Traditional systems rely on token probabilities. TRACEVIDENCE enforces rigorous epistemic constraints across 5 decoupled modules.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-5">
            <div className="rounded-xl bg-black/40 p-4 border border-white/5">
              <div className="font-mono text-xs text-cyan-400 font-bold">01 / EXTRACTION</div>
              <h4 className="mt-2 font-bold text-white text-xs">Atomic Decomposition</h4>
              <p className="mt-1 text-[11px] text-slate-400">
                Breaks discourse into atomic, falsifiable claims with isolated entities and target quantities.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-4 border border-white/5">
              <div className="font-mono text-xs text-cyan-400 font-bold">02 / RETRIEVAL</div>
              <h4 className="mt-2 font-bold text-white text-xs">Tiered Source Audit</h4>
              <p className="mt-1 text-[11px] text-slate-400">
                Classifies candidate literature into Academic, Government, Official, Media, or Aggregator tiers.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-4 border border-white/5">
              <div className="font-mono text-xs text-cyan-400 font-bold">03 / TRACE-X</div>
              <h4 className="mt-2 font-bold text-white text-xs">Provenance Lineage</h4>
              <p className="mt-1 text-[11px] text-slate-400">
                Computes verbatim reuse and traces origin seeds to detect echoes, syndicated wire copy, and circularity.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-4 border border-white/5">
              <div className="font-mono text-xs text-cyan-400 font-bold">04 / SIGNALS</div>
              <h4 className="mt-2 font-bold text-white text-xs">Freshness & Conflict</h4>
              <p className="mt-1 text-[11px] text-slate-400">
                Calculates exponential temporal decay exp(-λΔt) and flags direct empirical refutations.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-4 border border-white/5">
              <div className="font-mono text-xs text-cyan-400 font-bold">05 / AIVIDENCE</div>
              <h4 className="mt-2 font-bold text-white text-xs">Selective Prediction</h4>
              <p className="mt-1 text-[11px] text-slate-400">
                Replaces hallucinations with principled decisions: TRUST, VERIFY, or selective ABSTAIN.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
