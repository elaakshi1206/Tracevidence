'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import EvidenceGraph from '@/components/graph/EvidenceGraph';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import { Network, ArrowLeft, Sparkles, Info, ShieldCheck, Layers } from 'lucide-react';

export default function GraphPage() {
  const { currentAnalysis, loadBenchmarkCase } = useAnalysisStore();

  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">No Graph Data Available</h2>
        <p className="mt-2 text-sm text-slate-400">
          Run an analysis or select a benchmark case to construct the evidence provenance graph.
        </p>
        <Link
          href="/analyze"
          className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950"
        >
          <span>Go to Analyze Workspace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-cyan-400" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              Interactive Evidence & Provenance Graph
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            TRACE-X node-link visualization mapping claims, primary seeds, and syndicated copies.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Dataset:</span>
          <select
            value={currentAnalysis.id}
            onChange={(e) => {
              const matched = BENCHMARK_CASES.find((b) => b.data.id === e.target.value);
              if (matched) loadBenchmarkCase(matched.id);
            }}
            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500"
          >
            {BENCHMARK_CASES.map((b) => (
              <option key={b.data.id} value={b.data.id}>
                {b.tag} - {b.title.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend and Guidance Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 rounded-xl border border-white/10 bg-[#0d1424] p-4 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-cyan-400 bg-cyan-950" />
          <div>
            <div className="font-bold text-white">Primary Origin Node</div>
            <div className="text-[10px] text-slate-400">First-published seed data / study</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-indigo-500 bg-indigo-950" />
          <div>
            <div className="font-bold text-white">Intermediate Source</div>
            <div className="text-[10px] text-slate-400">Reprint, wire agency, or media</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-emerald-500 bg-slate-900" />
          <div>
            <div className="font-bold text-white">Claim Proposition</div>
            <div className="text-[10px] text-slate-400">Target atomic statement evaluated</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-0.5 w-6 bg-rose-500 animate-pulse" />
          <div>
            <div className="font-bold text-rose-400">Contradiction Edge</div>
            <div className="text-[10px] text-slate-400">Direct refutation link</div>
          </div>
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <EvidenceGraph analysis={currentAnalysis} />
    </div>
  );
}
