'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import { executeTracevidencePipeline } from '@/lib/engine/pipelineOrchestrator';
import PipelineProgress from '@/components/analyze/PipelineProgress';
import ClaimCard from '@/components/analyze/ClaimCard';
import DecisionBadge from '@/components/common/DecisionBadge';
import {
  Search,
  Sparkles,
  Link as LinkIcon,
  FileText,
  Network,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export default function AnalyzePage() {
  const router = useRouter();
  const {
    currentAnalysis,
    setAnalysis,
    selectedClaimId,
    setSelectedClaimId,
    pipelineProgress,
    setPipelineProgress,
    isAnalyzing,
    setIsAnalyzing,
    loadBenchmarkCase,
    activeFilter,
    setActiveFilter,
  } = useAnalysisStore();

  const [inputMode, setInputMode] = useState<'text' | 'benchmark' | 'url'>('text');
  const [inputText, setInputText] = useState(
    currentAnalysis?.query ||
      'Electric vehicle batteries generate an immense carbon debt during manufacturing. Media reports that producing a 75 kWh EV battery emits between 17 and 20 tonnes of CO2 equivalent, requiring 50,000 km to break even.'
  );
  const [inputUrl, setInputUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    try {
      const result = await executeTracevidencePipeline(inputText, (progress) => {
        setPipelineProgress(progress);
      });
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredClaims = currentAnalysis
    ? currentAnalysis.claims.filter((c) => {
        if (activeFilter === 'ALL') return true;
        return c.decision === activeFilter;
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              Evidence Provenance & Trust Workspace
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Submit propositions or statements to deconstruct claims, trace origins, and compute selective prediction trust.
          </p>
        </div>

        <Link
          href="/graph"
          className="flex items-center space-x-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-2.5 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/10 hover:bg-cyan-900/50 transition-all"
        >
          <Network className="h-4 w-4" />
          <span>Interactive Evidence Graph &rarr;</span>
        </Link>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-white/10 bg-[#0d1424]/95 p-6 shadow-xl backdrop-blur-md">
        {/* Tabs: Text / Benchmark / URL */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                inputMode === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Paste Text / AI Output</span>
            </button>

            <button
              onClick={() => setInputMode('benchmark')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                inputMode === 'benchmark'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Peer-Reviewed Benchmarks</span>
            </button>

            <button
              onClick={() => setInputMode('url')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                inputMode === 'url'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>URL Extraction</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Model: TRACEVIDENCE-AIVIDENCE v2.4 (Selective Prediction Active)
          </span>
        </div>

        {/* Input Bodies */}
        {inputMode === 'text' && (
          <div className="mt-4">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste scientific statement, news paragraph, or LLM generated response to audit..."
              className="w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all"
            />
          </div>
        )}

        {inputMode === 'url' && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.org/scientific-article-or-report"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
              <button
                onClick={() =>
                  setInputText(
                    `Article extracted from ${inputUrl || 'target link'}: Electric vehicle batteries generate an immense carbon debt during manufacturing, requiring extensive mileage to break even.`
                  )
                }
                className="rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                Fetch
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Extracts text propositions, canonical DOIs, and citation trees from scientific and news URLs.
            </p>
          </div>
        )}

        {inputMode === 'benchmark' && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BENCHMARK_CASES.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  loadBenchmarkCase(b.id);
                  setInputText(b.inputContent);
                }}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  currentAnalysis?.id === b.data.id
                    ? 'border-cyan-500 bg-cyan-950/30'
                    : 'border-white/5 bg-slate-900/50 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">{b.tag}</span>
                  <DecisionBadge decision={b.expectedOutcome} size="sm" />
                </div>
                <h4 className="mt-1.5 font-bold text-xs text-white leading-tight">{b.title}</h4>
                <p className="mt-1 text-[10px] text-slate-400 line-clamp-2">{b.description}</p>
                <div className="mt-2 text-[9px] font-mono text-amber-300">
                  Target Signal: {b.highlightSignal}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button & Pipeline Runner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>Input Size:</span>
            <span className="text-white font-bold">{inputText.length} chars</span>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-102 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50"
          >
            <Search className="h-4 w-4 text-slate-950" />
            <span>{isAnalyzing ? 'Executing Research Pipeline...' : 'Analyze Information'}</span>
          </button>
        </div>
      </div>

      {/* Live Pipeline Progress Indicator */}
      <PipelineProgress progress={pipelineProgress} isAnalyzing={isAnalyzing} />

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Executive Synthesis Banner */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1424] p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Executive Research Synthesis
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{currentAnalysis.title}</h2>
              </div>

              {/* Decision Distribution Badges */}
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1.5 rounded-lg bg-emerald-950/70 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{currentAnalysis.overallDecisionCounts.trust} TRUST</span>
                </span>
                <span className="flex items-center space-x-1.5 rounded-lg bg-amber-950/70 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-500/40">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>{currentAnalysis.overallDecisionCounts.verify} VERIFY</span>
                </span>
                <span className="flex items-center space-x-1.5 rounded-lg bg-rose-950/70 px-2.5 py-1 text-xs font-mono font-bold text-rose-300 border border-rose-500/40">
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  <span>{currentAnalysis.overallDecisionCounts.abstain} ABSTAIN</span>
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentAnalysis.executiveSummary}
            </p>

            {/* Aggregate Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/5 pt-4">
              <div className="rounded-lg bg-black/20 p-2.5">
                <div className="text-[10px] font-mono text-slate-400">Independence Factor</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-cyan-400">
                  {(currentAnalysis.aggregateMetrics.averageIndependence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="rounded-lg bg-black/20 p-2.5">
                <div className="text-[10px] font-mono text-slate-400">Corroboration Confidence</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-emerald-400">
                  {(currentAnalysis.aggregateMetrics.overallCorroboration * 100).toFixed(0)}%
                </div>
              </div>
              <div className="rounded-lg bg-black/20 p-2.5">
                <div className="text-[10px] font-mono text-slate-400">Temporal Freshness</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-indigo-400">
                  {(currentAnalysis.aggregateMetrics.averageFreshness * 100).toFixed(0)}%
                </div>
              </div>
              <div className="rounded-lg bg-black/20 p-2.5">
                <div className="text-[10px] font-mono text-slate-400">Contradiction Conflict</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-rose-400">
                  {(currentAnalysis.aggregateMetrics.contradictionRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="font-mono text-xs font-semibold text-slate-400">Filter Claims:</span>
              <div className="flex items-center space-x-1 rounded-lg bg-slate-900 p-1 border border-white/5">
                {(['ALL', 'TRUST', 'VERIFY', 'ABSTAIN'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-md px-3 py-1 text-xs font-mono font-bold transition-all ${
                      activeFilter === filter
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-mono text-xs text-slate-400">
              Showing {filteredClaims.length} of {currentAnalysis.claims.length} claims
            </div>
          </div>

          {/* Claim Cards Grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                isSelected={selectedClaimId === claim.id}
                onSelect={() => setSelectedClaimId(claim.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
