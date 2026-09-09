'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import DecisionBadge from '@/components/common/DecisionBadge';
import {
  FlaskConical,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export default function BenchmarksPage() {
  const router = useRouter();
  const { loadBenchmarkCase } = useAnalysisStore();
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'TRUST' | 'VERIFY' | 'ABSTAIN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAuditCase = (caseId: string) => {
    loadBenchmarkCase(caseId);
    router.push('/analyze');
  };

  const filteredCases = BENCHMARK_CASES.filter((b) => {
    if (filterDecision !== 'ALL' && b.expectedOutcome !== filterDecision) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.domain.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-[#0f766e]">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0f766e]">
              Peer-Reviewed Evaluation Suite
            </span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
            Academic Benchmarks & Case Studies
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-3xl leading-relaxed">
            Explore ready-made examples to understand how TRACEVIDENCE works. Each case demonstrates root-cause lineage tracing, source independence collapse, and selective prediction.
          </p>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'TRUST', 'VERIFY', 'ABSTAIN'] as const).map((dec) => (
            <button
              key={dec}
              onClick={() => setFilterDecision(dec)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold font-mono transition-all cursor-pointer border ${
                filterDecision === dec
                  ? 'bg-[#0f766e] text-white border-[#0f766e] shadow-xs'
                  : 'bg-white text-[#475569] border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dec}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search benchmark case studies by title, domain, or methodology..."
          className="w-full text-xs sm:text-sm text-[#0f172a] placeholder-slate-400 outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid of Benchmark Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCases.map((b) => (
          <div
            key={b.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all group"
          >
            <div>
              {/* Card Header: Tag & Decision Badge */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0f766e] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {b.tag}
                </span>
                <DecisionBadge decision={b.expectedOutcome} size="sm" />
              </div>

              {/* Title */}
              <h3 className="mt-4 text-base font-bold text-[#0f172a] group-hover:text-[#0f766e] transition-colors leading-snug">
                {b.title}
              </h3>

              {/* Small Domain Tag */}
              <div className="mt-1.5 inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {b.domain}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                {b.description}
              </p>

              {/* Highlight Signal Tag */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${
                    b.expectedOutcome === 'TRUST'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : b.expectedOutcome === 'ABSTAIN'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {b.expectedOutcome === 'TRUST'
                    ? '✓ Verified True Fact'
                    : b.expectedOutcome === 'ABSTAIN'
                    ? '🚫 Clear False / Misleading'
                    : '⚠ Echo Chamber / Stale'}
                </span>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
                  ⚡ {b.highlightSignal}
                </span>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600 border border-slate-200">
                  {b.data.claims.length} Claims
                </span>
              </div>
            </div>

            {/* Bottom: Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                1-Click Dataset
              </span>
              <button
                onClick={() => handleAuditCase(b.id)}
                className="flex items-center space-x-1.5 rounded-xl bg-[#0f766e] px-4 py-2 text-xs font-bold text-white hover:bg-[#115e59] transition-all shadow-xs group-hover:bg-[#f97316] cursor-pointer"
              >
                <span>Audit Case</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-[#0f172a]">No benchmark case studies match your query.</p>
          <button
            onClick={() => {
              setFilterDecision('ALL');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-[#0f766e] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
