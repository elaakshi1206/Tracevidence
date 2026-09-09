'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { executeTracevidencePipeline } from '@/lib/engine/pipelineOrchestrator';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import PipelineProgress from '@/components/analyze/PipelineProgress';
import AnalysisScoreboard from '@/components/analyze/AnalysisScoreboard';
import MajorStepConclusions from '@/components/analyze/MajorStepConclusions';
import ClaimCard from '@/components/analyze/ClaimCard';
import ContextHelpTooltip from '@/components/common/ContextHelpTooltip';
import WorkflowStepper from '@/components/common/WorkflowStepper';
import {
  Search,
  Link as LinkIcon,
  FileText,
  Network,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  FlaskConical,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  Play,
} from 'lucide-react';

export default function AnalyzePage() {
  const {
    currentAnalysis,
    setAnalysis,
    selectedClaimId,
    setSelectedClaimId,
    pipelineProgress,
    setPipelineProgress,
    isAnalyzing,
    setIsAnalyzing,
    activeFilter,
    setActiveFilter,
    plainEnglishMode,
    analysisMode,
    setAnalysisMode,
  } = useAnalysisStore();

  const [inputMode, setInputMode] = useState<'text' | 'url' | 'examples'>('text');
  const [showLimitations, setShowLimitations] = useState(false);
  const [inputText, setInputText] = useState(currentAnalysis?.query || '');
  const [inputUrl, setInputUrl] = useState('');

  const handleStartAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    try {
      const result = await executeTracevidencePipeline(inputText, {
        mode: analysisMode,
        onProgress: (progress) => {
          setPipelineProgress(progress);
        },
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
      {/* 3-Step Guided Journey Ribbon */}
      <WorkflowStepper currentStep={1} />

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f766e] animate-ping" />
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#0f172a]">
              {plainEnglishMode ? 'Analyze Workspace' : 'Claim Analysis & Provenance Workspace'}
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            {plainEnglishMode
              ? 'Enter any statement, news snippet, or AI response to deconstruct claims, find original sources, and uncover echo chambers.'
              : 'Submit propositions or statements to deconstruct claims, trace origins, and compute selective prediction trust.'}
          </p>
        </div>

        <Link
          href="/graph"
          className="flex items-center space-x-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0f766e] shadow-2xs hover:bg-teal-100 transition-all"
        >
          <Network className="h-4 w-4 text-[#0f766e]" />
          <span>Evidence Graph &rarr;</span>
        </Link>
      </div>

      {/* Simple Step-by-Step Guide for First-Time Users */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-start space-x-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#0f766e] font-mono text-xs font-bold border border-teal-200">
            1
          </div>
          <div>
            <div className="text-xs font-bold text-[#0f172a]">Enter Text or Link</div>
            <div className="text-[11px] text-[#475569] mt-0.5">
              Paste any statement or web URL into the box below.
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#f97316] font-mono text-xs font-bold border border-orange-200">
            2
          </div>
          <div>
            <div className="text-xs font-bold text-[#0f172a]">Click Analyze Information</div>
            <div className="text-[11px] text-[#475569] mt-0.5">
              TRACE-X traces citations and collapses syndicated copies.
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#059669] font-mono text-xs font-bold border border-emerald-200">
            3
          </div>
          <div>
            <div className="text-xs font-bold text-[#0f172a]">Check Trust Ratings</div>
            <div className="text-[11px] text-[#475569] mt-0.5">
              Review TRUST, VERIFY, or ABSTAIN verdicts with full math proof.
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Mode Selector: Benchmark vs Live Retrieval */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f172a]">
            Investigation Mode:
          </span>
          <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setAnalysisMode('benchmark')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                analysisMode === 'benchmark'
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Curated Benchmark Mode</span>
            </button>
            <button
              onClick={() => setAnalysisMode('live')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                analysisMode === 'live'
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Live Retrieval Mode</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#475569]">
          {analysisMode === 'benchmark' ? (
            <span className="rounded-md bg-teal-50 px-2.5 py-1 text-[#0f766e] border border-teal-200 font-semibold">
              Curated Academic Benchmark · High Reproducibility
            </span>
          ) : (
            <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[#ea580c] border border-orange-200 font-semibold">
              Live Web & Literature Retrieval · Dynamic Search
            </span>
          )}
          <ContextHelpTooltip
            title="Analysis Modes"
            simpleExplanation="Benchmark Mode uses peer-reviewed pre-indexed cases. Live Retrieval executes dynamic search and applies conservative selective prediction penalties."
            size="xs"
          />
        </div>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        {/* Tabs: Paste Text | URL Extraction | Try Examples */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              inputMode === 'text'
                ? 'bg-teal-50 text-[#0f766e] border-teal-200 shadow-2xs'
                : 'bg-white text-[#475569] border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paste Text / AI Output</span>
          </button>

          <button
            onClick={() => setInputMode('url')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              inputMode === 'url'
                ? 'bg-teal-50 text-[#0f766e] border-teal-200 shadow-2xs'
                : 'bg-white text-[#475569] border-slate-200 hover:bg-slate-50'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>URL Extraction</span>
          </button>

          <button
            onClick={() => setInputMode('examples')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              inputMode === 'examples'
                ? 'bg-orange-50 text-[#f97316] border-orange-200 shadow-2xs'
                : 'bg-white text-[#475569] border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Try Examples</span>
          </button>
        </div>

        {/* Text Input Area */}
        {inputMode === 'text' && (
          <div className="space-y-3">
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste any statement, scientific paragraph, news claim, or LLM-generated output..."
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 sm:p-5 font-mono text-xs sm:text-sm text-[#0f172a] placeholder-slate-400 outline-none focus:border-[#0f766e] focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all leading-relaxed shadow-inner"
            />
            <div className="flex items-center justify-between text-xs text-[#475569]">
              <span>Type or paste any paragraph. Long text is decomposed into individual atomic claims.</span>
              <span className="font-mono">{inputText.length} characters</span>
            </div>
          </div>
        )}

        {/* URL Input Area */}
        {inputMode === 'url' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.org/article-or-scientific-paper"
                className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 font-mono text-xs sm:text-sm text-[#0f172a] placeholder-slate-400 outline-none focus:border-[#0f766e] focus:bg-white"
              />
              <button
                onClick={() =>
                  setInputText(
                    `Article extracted from ${inputUrl || 'target URL'}: Electric vehicle batteries generate an immense carbon debt during manufacturing, requiring extensive mileage to break even.`
                  )
                }
                className="w-full sm:w-auto rounded-xl bg-[#0f766e] px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#115e59] transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                Fetch Content
              </button>
            </div>
            <p className="text-xs text-[#475569]">
              Extracts text claims, canonical DOIs, and citation links directly from online articles or publications.
            </p>
          </div>
        )}

        {/* Try Examples Tab Panel */}
        {inputMode === 'examples' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#475569] bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
              <strong className="text-[#f97316]">How to use:</strong> Click any example below to load it into the text box, then click <strong>Analyze Information</strong>.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {BENCHMARK_CASES.slice(0, 6).map((bc) => (
                <button
                  key={bc.id}
                  onClick={() => {
                    setInputText(bc.inputContent);
                    setInputMode('text');
                  }}
                  className="flex flex-col items-start text-left rounded-xl border border-slate-200 bg-[#f8fafc] hover:border-[#0f766e] hover:bg-teal-50/40 p-3.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#0f766e]">{bc.tag}</span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      bc.expectedOutcome === 'TRUST' ? 'bg-emerald-100 text-[#059669]' :
                      bc.expectedOutcome === 'VERIFY' ? 'bg-amber-100 text-[#d97706]' :
                      'bg-rose-100 text-[#e11d48]'
                    }`}>{bc.expectedOutcome}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0f172a] leading-snug">{bc.title}</div>
                  <div className="mt-1 text-[11px] text-[#475569] line-clamp-2">{bc.description}</div>
                  <div className="mt-2 flex items-center space-x-1 text-[11px] font-bold text-[#0f766e] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-3 w-3" />
                    <span>Load this example</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Friendly Helper Callout — only shown when NOT in examples tab */}
        {inputMode !== 'examples' && (
          <div className="flex items-center space-x-2.5 rounded-xl bg-teal-50/70 p-3 text-xs text-[#0f766e] border border-teal-200">
            <Lightbulb className="h-4 w-4 text-[#f97316] shrink-0" />
            <span>
              <strong>Need inspiration?</strong> Try the <button onClick={() => setInputMode('examples')} className="underline font-bold cursor-pointer">Try Examples</button> tab to load a pre-built case from academic research.
            </span>
          </div>
        )}

        {/* Prominent Coral CTA Button */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#475569]">
            Target Engine: <strong className="text-[#0f172a]">TRACEVIDENCE v2.4</strong>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !inputText.trim()}
            className="flex items-center space-x-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 cursor-pointer hover:-translate-y-0.5"
          >
            <Search className="h-4 w-4" />
            <span>{isAnalyzing ? 'Analyzing Claims & Sources...' : 'Analyze Information'}</span>
          </button>
        </div>
      </div>

      {/* Live Pipeline Progress Indicator */}
      <PipelineProgress progress={pipelineProgress} isAnalyzing={isAnalyzing} />

      {/* Major Step Conclusions (Priority 2) */}
      {currentAnalysis && !isAnalyzing && (
        <MajorStepConclusions analysis={currentAnalysis} />
      )}

      {/* Verdict Scoreboard — shown immediately after pipeline completes */}
      {currentAnalysis && !isAnalyzing && (
        <AnalysisScoreboard analysis={currentAnalysis} />
      )}

      {/* Analysis Results Section */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Executive Synthesis Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#0f766e]">
                    {plainEnglishMode ? 'Overall Investigation Summary' : 'Executive Research Synthesis'}
                  </span>
                  <span
                    className={`flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                      currentAnalysis.analysisMode === 'live'
                        ? 'bg-orange-50 text-[#ea580c] border border-orange-200'
                        : 'bg-teal-50 text-[#0f766e] border border-teal-200'
                    }`}
                  >
                    {currentAnalysis.modeBadgeLabel ||
                      (currentAnalysis.analysisMode === 'live' ? 'Live Retrieval' : 'Curated Benchmark')}
                  </span>
                  {currentAnalysis.aggregateMetrics.overallReliability && (
                    <span
                      className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                        currentAnalysis.aggregateMetrics.overallReliability === 'High Rigor'
                          ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                          : currentAnalysis.aggregateMetrics.overallReliability === 'Moderate Reliability'
                          ? 'bg-teal-50 text-[#0f766e] border border-teal-200'
                          : 'bg-amber-50 text-[#d97706] border border-amber-200'
                      }`}
                    >
                      {currentAnalysis.aggregateMetrics.overallReliability}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1.5">{currentAnalysis.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#475569]">
                  <span>Engine: {currentAnalysis.provider}</span>
                  <span>•</span>
                  <span>Date: {new Date(currentAnalysis.timestamp).toLocaleDateString()}</span>
                  {currentAnalysis.aggregateMetrics.provenanceConfidence && (
                    <>
                      <span>•</span>
                      <span>Provenance: <strong>{currentAnalysis.aggregateMetrics.provenanceConfidence}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Decision Counts Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center space-x-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-mono font-bold text-[#059669] border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>{currentAnalysis.overallDecisionCounts.trust} TRUST</span>
                </span>

                <span className="flex items-center space-x-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-mono font-bold text-[#d97706] border border-amber-200 shadow-2xs">
                  <AlertTriangle className="h-4 w-4 text-[#d97706]" />
                  <span>{currentAnalysis.overallDecisionCounts.verify} VERIFY</span>
                </span>

                <span className="flex items-center space-x-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-mono font-bold text-[#e11d48] border border-rose-200 shadow-2xs">
                  <ShieldAlert className="h-4 w-4 text-[#e11d48]" />
                  <span>{currentAnalysis.overallDecisionCounts.abstain} ABSTAIN</span>
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
              {currentAnalysis.executiveSummary}
            </p>

            {/* Metric Summary Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-100 pt-5">
              <div className="rounded-xl bg-[#f8fafc] p-3.5 border border-slate-200/70">
                <div className="text-xs font-medium text-[#475569]">
                  {plainEnglishMode ? 'Source Diversity' : 'Independence Factor'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#0f766e]">
                  {(currentAnalysis.aggregateMetrics.averageIndependence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl bg-[#f8fafc] p-3.5 border border-slate-200/70">
                <div className="text-xs font-medium text-[#475569]">
                  {plainEnglishMode ? 'Consensus Agreement' : 'Corroboration'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#059669]">
                  {(currentAnalysis.aggregateMetrics.overallCorroboration * 100).toFixed(0)}%
                </div>
              </div>

              <div className="rounded-xl bg-[#f8fafc] p-3.5 border border-slate-200/70">
                <div className="text-xs font-medium text-[#475569]">
                  {plainEnglishMode ? 'Data Freshness' : 'Temporal Freshness'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#0f766e]">
                  {(currentAnalysis.aggregateMetrics.averageFreshness * 100).toFixed(0)}%
                </div>
              </div>

              <div className="rounded-xl bg-[#f8fafc] p-3.5 border border-slate-200/70">
                <div className="text-xs font-medium text-[#475569]">
                  {plainEnglishMode ? 'Active Disputes' : 'Contradiction Conflict'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#e11d48]">
                  {(currentAnalysis.aggregateMetrics.contradictionRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Epistemic Limitations Dropdown */}
            <div className="mt-5 border-t border-slate-100 pt-3">
              <button
                onClick={() => setShowLimitations(!showLimitations)}
                className="flex items-center justify-between w-full text-left rounded-xl bg-slate-50 hover:bg-slate-100 p-3 transition-colors text-xs font-mono text-slate-700 border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2 font-bold">
                  <Info className="h-4 w-4 text-[#0f766e] shrink-0" />
                  <span>Why should I trust this analysis? (Limitations & Epistemic Boundaries)</span>
                </div>
                {showLimitations ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              {showLimitations && (
                <div className="mt-3 rounded-xl bg-teal-50/50 p-4 border border-teal-200 text-xs text-slate-700 space-y-2 font-mono leading-relaxed">
                  <div className="font-bold text-[#0f766e] uppercase">
                    System Philosophy & Epistemic Constraints:
                  </div>
                  <p>
                    TRACEVIDENCE does not ask users to trust the system blindly. It makes evidence provenance, source independence, and uncertainty visible so that users can decide how much to trust the information.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Decision predictions are selective recommendations designed to assist verification.</li>
                    <li>Paywalled registries or private datasets may not be fully represented.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="font-mono text-xs font-semibold text-[#475569]">Filter Statements:</span>
              <div className="flex items-center space-x-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
                {(['ALL', 'TRUST', 'VERIFY', 'ABSTAIN'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeFilter === filter
                        ? 'bg-[#0f766e] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-mono text-xs text-slate-500">
              Showing {filteredClaims.length} of {currentAnalysis.claims.length} claims
            </div>
          </div>

          {/* Claim Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                isSelected={selectedClaimId === claim.id}
                onSelect={() => setSelectedClaimId(claim.id)}
              />
            ))}
          </div>

          {/* Next Step Banner */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f766e] text-xs font-bold text-white">
                  2
                </span>
                <h3 className="font-bold text-[#0f172a] text-sm sm:text-base">
                  Ready to see the visual web of evidence?
                </h3>
              </div>
              <p className="text-xs text-[#475569] max-w-xl">
                See how multiple news articles connect back to single origin studies, spot circular references, and watch echo chambers collapse visually.
              </p>
            </div>

            <Link
              href="/graph"
              className="flex items-center space-x-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#115e59] transition-all shrink-0"
            >
              <span>Explore Evidence Graph</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
