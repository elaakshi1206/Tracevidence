'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import WorkflowStepper from '@/components/common/WorkflowStepper';
import MajorStepConclusions from '@/components/analyze/MajorStepConclusions';
import SourceVsUserComparison from '@/components/claims/SourceVsUserComparison';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Search,
  Network,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function ClaimScoreboardPage() {
  const { currentAnalysis, plainEnglishMode, loadBenchmarkCase } = useAnalysisStore();
  const [selectedClaimIndex, setSelectedClaimIndex] = useState(0);

  // If no analysis is loaded, display an inviting empty state with instant demo cases
  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <WorkflowStepper currentStep={3} />

        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center shadow-sm space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-[#0f766e] mx-auto border border-teal-200 shadow-sm">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0f766e]">
              Step 3: Decision Page
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#0f172a]">
              Claim Scoreboard
            </h1>
            <p className="text-sm text-[#475569] max-w-lg mx-auto leading-relaxed">
              No claim has been analyzed yet. Run a claim in Step 1 (Fact Check) or load one of our verified school-level demo cases below to inspect the complete decision scoreboard instantly.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center space-x-2 rounded-xl bg-[#0f766e] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#115e59] transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Go to Step 1: Fact Check</span>
            </Link>
          </div>

          {/* Quick Demo Cases */}
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Or Try an Instant Demo Case:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {BENCHMARK_CASES.slice(0, 3).map((demoCase) => {
                const badge =
                  demoCase.expectedOutcome === 'TRUST'
                    ? { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', label: '🟢 TRUST Demo' }
                    : demoCase.expectedOutcome === 'VERIFY'
                    ? { bg: 'bg-amber-50 text-amber-800 border-amber-300', label: '🟡 VERIFY Demo' }
                    : { bg: 'bg-rose-50 text-rose-800 border-rose-300', label: '🔴 ABSTAIN Demo' };

                return (
                  <button
                    key={demoCase.id}
                    onClick={() => loadBenchmarkCase(demoCase.id)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 transition-all text-left flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border mb-2 ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#0f766e] line-clamp-2">
                        {demoCase.title}
                      </div>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-[#0f766e] flex items-center gap-1">
                      <span>View Scoreboard</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis is loaded: compute primary verdict and details
  const { trust, verify, abstain } = currentAnalysis.overallDecisionCounts;
  const totalClaims = trust + verify + abstain;
  const m = currentAnalysis.aggregateMetrics;
  const claims = currentAnalysis.claims;
  const selectedClaim = claims[selectedClaimIndex] || claims[0];

  // Determine overall verdict
  let primaryVerdict: 'TRUST' | 'VERIFY' | 'ABSTAIN' = 'VERIFY';
  if (totalClaims === 1 && claims[0]) {
    primaryVerdict = claims[0].decision;
  } else if (
    abstain > 0 &&
    (abstain >= trust || m.contradictionRate > 0.2 || claims.some((c) => c.decision === 'ABSTAIN' && c.contradictionDetected))
  ) {
    primaryVerdict = 'ABSTAIN';
  } else if (trust > verify && trust > abstain) {
    primaryVerdict = 'TRUST';
  } else {
    primaryVerdict = 'VERIFY';
  }

  const independencePct = Math.round((m.averageIndependence || 0) * 100);
  const echoChamber = independencePct < 40;
  const contradictionPct = Math.round((m.contradictionRate || 0) * 100);
  const hasContradiction = m.contradictionRate > 0.3;

  // Visual styling config for each verdict
  const verdictConfig = {
    TRUST: {
      title: 'TRUST',
      badgeLabel: 'VERIFIED EVIDENCE',
      bannerBg: 'bg-emerald-600',
      boxBg: 'bg-emerald-50/70 border-emerald-300',
      textColor: 'text-emerald-700',
      pillBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: ShieldCheck,
      shortSummary: plainEnglishMode
        ? 'Independent scientific sources confirm this claim. No major contradictions or circular copying were detected. It is backed by genuine research.'
        : 'Empirically supported across independent multi-origin scientific literature with minimal contradiction and high corroboration.',
      action: plainEnglishMode
        ? 'Safe to use in your homework, school project, or presentation. Remember to cite the primary source (e.g. peer-reviewed journal or government report).'
        : 'Safe for academic quotation with proper primary citation. Independent replication criteria satisfied.',
    },
    VERIFY: {
      title: 'VERIFY',
      badgeLabel: 'CHECK BEFORE USING',
      bannerBg: 'bg-amber-500',
      boxBg: 'bg-amber-50/70 border-amber-300',
      textColor: 'text-amber-700',
      pillBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: AlertTriangle,
      shortSummary: echoChamber
        ? plainEnglishMode
          ? 'Echo chamber warning: multiple news websites are simply repeating one original article. What appears to be wide agreement is actually just one voice repeated.'
          : 'High syndication collapse detected: apparent multi-source agreement reduces to a single primary seed without independent verification.'
        : plainEnglishMode
        ? 'This claim has partial evidence, but it relies on older information, secondary blog reports, or lacks sufficient independent scientific proof.'
        : 'Moderate epistemic uncertainty: evidence is plausible but relies on secondary journalistic reprints or unverified claims.',
      action: plainEnglishMode
        ? 'Do NOT use this as a standalone fact. Find at least 2 independent peer-reviewed studies before relying on it.'
        : 'Requires secondary verification. Do not cite as settled consensus until corroborated by primary literature.',
    },
    ABSTAIN: {
      title: 'ABSTAIN',
      badgeLabel: 'DO NOT CITE',
      bannerBg: 'bg-rose-600',
      boxBg: 'bg-rose-50/70 border-rose-300',
      textColor: 'text-rose-700',
      pillBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: ShieldAlert,
      shortSummary: hasContradiction
        ? plainEnglishMode
          ? 'Scientific dispute or refutation: authoritative clinical studies or official scientific measurements directly contradict this claim.'
          : 'Severe empirical contradiction detected: controlled experimental trials refute the proposition.'
        : plainEnglishMode
        ? 'The evidence is strongly contradicted, circular, or completely unsupported. TRACEVIDENCE refuses to endorse it to prevent spreading falsehoods.'
        : 'Selective prediction abstention triggered: risk of false certainty exceeds safety thresholds.',
      action: plainEnglishMode
        ? 'Do NOT cite this claim in your project. The evidence is disputed or disproven. Ask a teacher or consult official medical/science guidelines.'
        : 'Epistemic rejection: do not rely on this statement. Consult authoritative scientific bodies or systematic meta-analyses.',
    },
  };

  const vConfig = verdictConfig[primaryVerdict];
  const VerdictIcon = vConfig.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 4-Step Guided Journey Ribbon */}
      <WorkflowStepper currentStep={3} />

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-[#0f766e]">
              <Award className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#0f172a]">
              Step 3: Claim Scoreboard
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            {plainEnglishMode
              ? 'Your central decision dashboard: see the final trust verdict, plain-English reasons, and what you should do next.'
              : 'Synthesized calibrated decision engine: final verdict, step conclusions, evidence matching, and actionable guidance.'}
          </p>
        </div>

        {/* Action Link to Restart or Test Another */}
        <Link
          href="/analyze"
          className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <Search className="h-3.5 w-3.5 text-[#0f766e]" />
          <span>Fact Check Another Claim</span>
        </Link>
      </div>

      {/* Currently Analyzed Statement Bar */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-sm">
        <div className="flex items-center space-x-3 overflow-hidden">
          <Sparkles className="h-5 w-5 text-teal-300 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 block">
              Tested Proposition:
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate block">
              &ldquo;{currentAnalysis.title}&rdquo;
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400 shrink-0 pl-4 hidden sm:block">
          {totalClaims} statement{totalClaims !== 1 ? 's' : ''} audited
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. BIG FINAL VERDICT AT THE TOP (TRUST / VERIFY / ABSTAIN)
          ───────────────────────────────────────────────────────────── */}
      <section className={`rounded-3xl border-2 ${vConfig.boxBg} p-6 sm:p-8 shadow-md overflow-hidden relative transition-all`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Huge Verdict Badge + Color */}
          <div className="flex items-center gap-5">
            <div className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl ${vConfig.bannerBg} text-white shadow-xl shrink-0`}>
              <VerdictIcon className="h-12 w-12 sm:h-14 sm:w-14" />
            </div>

            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${vConfig.pillBg}`}>
                {vConfig.badgeLabel}
              </span>
              <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${vConfig.textColor}`}>
                {vConfig.title}
              </div>
              <div className="text-xs font-mono font-bold text-slate-500">
                {trust} TRUST · {verify} VERIFY · {abstain} ABSTAIN
              </div>
            </div>
          </div>

          {/* Right: Short Plain-English Summary: "Why this decision?" */}
          <div className="flex-1 md:max-w-xl rounded-2xl bg-white/90 border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              <Lightbulb className="h-4 w-4 text-[#0f766e]" />
              <span>Why This Decision?</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {vConfig.shortSummary}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THREE CLEAR CONCLUSION CARDS FROM PREVIOUS STEPS
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 text-[#0f766e] border border-teal-200 text-xs font-bold font-mono">
              3
            </span>
            <h2 className="text-lg font-bold font-mono text-[#0f172a]">
              Key Conclusions After Each Major Step
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            How Steps 1, 2, and 3 build to this verdict
          </span>
        </div>

        {/* Render 3 Prominent Step Conclusion Cards */}
        <MajorStepConclusions analysis={currentAnalysis} />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. USER CLAIM VS SOURCE CLAIMS (SIMPLE COMPARISON)
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-[#0f172a]">
                User Claim vs Source Claims (Evidence Match)
              </h2>
              <p className="text-xs text-slate-500">
                Compare what you stated against what authoritative studies actually found
              </p>
            </div>
          </div>

          {/* If multiple claims exist, allow selecting which claim to view */}
          {claims.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-500 px-2">Statement:</span>
              {claims.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClaimIndex(idx)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedClaimIndex === idx
                      ? 'bg-white text-[#0f766e] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detailed User Claim vs Source Claims Component */}
        <SourceVsUserComparison
          claim={selectedClaim}
          evidences={currentAnalysis.evidences}
          sources={currentAnalysis.sources}
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CLEAR RECOMMENDATION: WHAT SHOULD THE USER DO NEXT?
          ───────────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border-2 border-slate-900 bg-[#0f172a] text-white p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/20 text-[#f97316] border border-orange-500/30">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#f97316]">
              Actionable Guidance for Students &amp; Teachers
            </span>
            <h3 className="text-lg font-bold text-white">
              What Should You Do Next?
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5">
          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {vConfig.action}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Left Buttons: View Evidence Map */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/graph"
              className="flex items-center space-x-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-2xs"
            >
              <Network className="h-4 w-4" />
              <span>&larr; View Evidence Map (Step 2)</span>
            </Link>

            <Link
              href="/analyze"
              className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-md"
            >
              <Search className="h-4 w-4" />
              <span>Fact Check Another Statement</span>
            </Link>
          </div>

          {/* Right Button: Optional Deep Research Lab */}
          <Link
            href="/research"
            className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 text-xs sm:text-sm font-mono font-bold text-amber-300 transition-all"
          >
            <BarChart3 className="h-4 w-4 text-amber-400" />
            <span>Go to Research Lab (Advanced) &rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
