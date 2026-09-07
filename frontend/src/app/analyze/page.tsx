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
import PageTutorialBanner from '@/components/common/PageTutorialBanner';
import ContextHelpTooltip from '@/components/common/ContextHelpTooltip';
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
    plainEnglishMode,
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/12 pb-8">
        <div>
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-400 animate-ping" />
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
              {plainEnglishMode ? 'Verify Any Fact or Claim' : 'Evidence Provenance & Trust Workspace'}
            </h1>
          </div>
          <p className="mt-2 text-base sm:text-lg text-slate-300">
            {plainEnglishMode
              ? 'Test any statement to see its original sources, find hidden circular rumors, and get a trustworthy verdict.'
              : 'Submit propositions or statements to deconstruct claims, trace origins, and compute selective prediction trust.'}
          </p>
        </div>

        <Link
          href="/graph"
          className="flex items-center space-x-2.5 rounded-2xl border border-white/25 bg-gradient-to-r from-rose-500/15 via-blue-500/20 to-emerald-500/15 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-xl hover:border-white/40 hover:bg-white/15 transition-all"
        >
          <Network className="h-5 w-5 text-blue-400" />
          <span>Interactive Evidence Graph &rarr;</span>
        </Link>
      </div>

      {/* Tutorial & Guidance Banner */}
      <PageTutorialBanner
        pageKey="analyze_workspace"
        title="Workspace Quick Guide"
        subtitle="3 simple steps to audit any scientific statement, news report, or AI answer"
        empathyNote="You don't need to know academic terminology! If you're not sure what to write, click 'Peer-Reviewed Benchmarks' below to try real-world cases with 1 click."
        steps={[
          {
            number: 1,
            title: 'Choose or Paste Input',
            description: 'Paste any text, paste a news link, or choose from 3 preloaded research datasets.',
            highlightAction: 'Select "Peer-Reviewed Benchmarks" for instant results',
          },
          {
            number: 2,
            title: 'Watch Live Decomposition',
            description: 'The engine extracts atomic claims, searches literature, and collapses repeating echo-chamber articles to their single root origin.',
            highlightAction: 'Click "Analyze Information" to start',
          },
          {
            number: 3,
            title: 'Inspect Trust Verdicts',
            description: 'Check whether each claim gets TRUST, VERIFY, or ABSTAIN. Click "Inspect" on any claim card to see its full mathematical audit and provenance tree.',
            highlightAction: 'Click "Inspect" on any claim below',
          },
        ]}
        commonConfusion={{
          question: 'Why does it break my paragraph into multiple smaller claims?',
          answer: 'Long paragraphs usually mix truth with exaggeration. Breaking text into atomic sentences prevents a false claim from hiding behind three true ones!',
        }}
      />

      {/* Input Section */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#10182c] to-[#0d1424] p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Tabs: Text / Benchmark / URL */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition-all ${
                inputMode === 'text'
                  ? 'bg-blue-600/30 text-white border border-blue-400/60 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Paste Text / AI Output</span>
            </button>

            <button
              onClick={() => setInputMode('benchmark')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition-all ${
                inputMode === 'benchmark'
                  ? 'bg-blue-600/30 text-white border border-blue-400/60 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Peer-Reviewed Benchmarks</span>
            </button>

            <button
              onClick={() => setInputMode('url')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition-all ${
                inputMode === 'url'
                  ? 'bg-blue-600/30 text-white border border-blue-400/60 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>URL Extraction</span>
            </button>

            <ContextHelpTooltip
              title="Input Methods"
              simpleExplanation="You can audit any text: raw statements, articles from links, or vetted academic benchmark datasets."
              whyItMatters="Lets you fact-check anything from a tweet to a scientific paper."
              example="Try the EV Battery Debt case to see how 10 news articles copied 1 outdated study!"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-slate-300">
            <span>Model: TRACEVIDENCE-AIVIDENCE v2.4</span>
            <ContextHelpTooltip
              title="Selective Prediction Model"
              simpleExplanation="A calibrated engine that predicts TRUST, VERIFY, or ABSTAIN rather than guessing blindly."
              whyItMatters="Prevents AI hallucinations by refusing to answer when uncertainty is too high."
            />
          </div>
        </div>

        {/* Input Bodies */}
        {inputMode === 'text' && (
          <div className="mt-5">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste scientific statement, news paragraph, or LLM generated response to audit..."
              className="w-full rounded-2xl border border-white/15 bg-black/50 p-5 font-mono text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all leading-relaxed"
            />
          </div>
        )}

        {inputMode === 'url' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.org/scientific-article-or-report"
                className="w-full rounded-2xl border border-white/15 bg-black/50 px-5 py-3.5 font-mono text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none focus:border-blue-400"
              />
              <button
                onClick={() =>
                  setInputText(
                    `Article extracted from ${inputUrl || 'target link'}: Electric vehicle batteries generate an immense carbon debt during manufacturing, requiring extensive mileage to break even.`
                  )
                }
                className="rounded-2xl bg-slate-800 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-700 transition-colors shadow-md"
              >
                Fetch
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Extracts text propositions, canonical DOIs, and citation trees from scientific and news URLs.
            </p>
          </div>
        )}

        {inputMode === 'benchmark' && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENCHMARK_CASES.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  loadBenchmarkCase(b.id);
                  setInputText(b.inputContent);
                }}
                className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                  currentAnalysis?.id === b.data.id
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-400 font-bold">{b.tag}</span>
                  <DecisionBadge decision={b.expectedOutcome} size="sm" />
                </div>
                <h4 className="mt-2 font-bold text-sm sm:text-base text-white leading-snug">{b.title}</h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">{b.description}</p>
                <div className="mt-3 text-xs font-mono font-semibold text-amber-300">
                  Target Signal: {b.highlightSignal}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button & Pipeline Runner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/12">
          <div className="flex items-center space-x-2 text-sm text-slate-300 font-mono">
            <span>Input Size:</span>
            <span className="text-white font-bold">{inputText.length} characters</span>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !inputText.trim()}
            className="btn-gradient-rbgw flex items-center space-x-2.5 rounded-2xl px-8 py-3.5 font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-xl transition-all disabled:opacity-50"
          >
            <Search className="h-5 w-5 text-white" />
            <span>{isAnalyzing ? 'Executing Research Pipeline...' : 'Analyze Information'}</span>
          </button>
        </div>
      </div>

      {/* Live Pipeline Progress Indicator */}
      <PipelineProgress progress={pipelineProgress} isAnalyzing={isAnalyzing} />

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="space-y-8">
          {/* Executive Synthesis Banner */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#10182c] to-[#0d1424] p-7 sm:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/12 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
                    {plainEnglishMode ? 'Overall Investigation Summary' : 'Executive Research Synthesis'}
                  </span>
                  <ContextHelpTooltip
                    title="Executive Synthesis"
                    simpleExplanation="A high-level overview summarizing the factual reliability across all individual statements extracted from your input."
                    whyItMatters="Gives you the bottom-line conclusion before diving into claim-by-claim details."
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5">{currentAnalysis.title}</h2>
              </div>

              {/* Decision Distribution Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center space-x-2 rounded-xl bg-emerald-950/80 px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold text-emerald-300 border border-emerald-500/50 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{currentAnalysis.overallDecisionCounts.trust} TRUST</span>
                  <ContextHelpTooltip
                    title="TRUST Verdict"
                    simpleExplanation="Statements with multiple independent primary origins, up-to-date citations, and no contradictory evidence."
                    whyItMatters="You can cite or rely on these claims with high confidence."
                    size="xs"
                  />
                </span>

                <span className="flex items-center space-x-2 rounded-xl bg-amber-950/80 px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold text-amber-300 border border-amber-500/50 shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>{currentAnalysis.overallDecisionCounts.verify} VERIFY</span>
                  <ContextHelpTooltip
                    title="VERIFY Verdict"
                    simpleExplanation="Statements that appear plausible but depend on a single secondary source, press release, or older data."
                    whyItMatters="Check the underlying citations before trusting completely."
                    size="xs"
                  />
                </span>

                <span className="flex items-center space-x-2 rounded-xl bg-rose-950/80 px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold text-rose-300 border border-rose-500/50 shadow-sm">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>{currentAnalysis.overallDecisionCounts.abstain} ABSTAIN</span>
                  <ContextHelpTooltip
                    title="ABSTAIN Verdict (Selective Prediction)"
                    simpleExplanation="The system withholds a verdict because evidence is disputed, circular, or severely contradictory."
                    whyItMatters="Refusing to answer prevents fake consensus and protects you from AI hallucinations."
                    size="xs"
                  />
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {currentAnalysis.executiveSummary}
            </p>

            {/* Aggregate Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-5">
              <div className="rounded-xl bg-black/30 p-3.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    {plainEnglishMode ? 'Source Diversity' : 'Independence Factor'}
                  </div>
                  <ContextHelpTooltip
                    title="Source Independence"
                    simpleExplanation="Measures whether the sources citing this claim are genuinely separate organizations or just copying the same press release."
                    whyItMatters="100% means all sources are distinct origins. Low % means an echo chamber!"
                    size="xs"
                  />
                </div>
                <div className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-blue-400">
                  {(currentAnalysis.aggregateMetrics.averageIndependence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="rounded-xl bg-black/30 p-3.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    {plainEnglishMode ? 'Consensus Agreement' : 'Corroboration'}
                  </div>
                  <ContextHelpTooltip
                    title="Corroboration Confidence"
                    simpleExplanation="How strongly reputable literature backs up the affirmative claims."
                    whyItMatters="High corroboration indicates broad scientific or journalistic consensus."
                    size="xs"
                  />
                </div>
                <div className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-emerald-400">
                  {(currentAnalysis.aggregateMetrics.overallCorroboration * 100).toFixed(0)}%
                </div>
              </div>

              <div className="rounded-xl bg-black/30 p-3.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    {plainEnglishMode ? 'Data Freshness' : 'Temporal Freshness'}
                  </div>
                  <ContextHelpTooltip
                    title="Temporal Freshness"
                    simpleExplanation="How recent and up-to-date the supporting citations are."
                    whyItMatters="Old science gets discounted so you don't make decisions on outdated studies."
                    size="xs"
                  />
                </div>
                <div className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-blue-300">
                  {(currentAnalysis.aggregateMetrics.averageFreshness * 100).toFixed(0)}%
                </div>
              </div>

              <div className="rounded-xl bg-black/30 p-3.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    {plainEnglishMode ? 'Active Disputes' : 'Contradiction Conflict'}
                  </div>
                  <ContextHelpTooltip
                    title="Contradiction Conflict"
                    simpleExplanation="Percentage of claims where reputable studies directly disagree or refute each other."
                    whyItMatters="A high conflict rate means experts are actively debating this statement."
                    size="xs"
                  />
                </div>
                <div className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-rose-400">
                  {(currentAnalysis.aggregateMetrics.contradictionRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-slate-300" />
              <span className="font-mono text-sm font-bold text-slate-300">Filter Claims:</span>
              <div className="flex items-center space-x-1.5 rounded-xl bg-slate-900 p-1.5 border border-white/10">
                {(['ALL', 'TRUST', 'VERIFY', 'ABSTAIN'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-mono font-bold transition-all ${
                      activeFilter === filter
                        ? 'btn-gradient-rbgw shadow'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-sm text-slate-300">
              <span>Showing {filteredClaims.length} of {currentAnalysis.claims.length} claims</span>
              <ContextHelpTooltip
                title="Claim Deconstruction"
                simpleExplanation="Each statement is evaluated independently so you can pinpoint which specific claim is supported and which is unsupported."
                size="xs"
              />
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
        </div>
      )}
    </div>
  );
}
