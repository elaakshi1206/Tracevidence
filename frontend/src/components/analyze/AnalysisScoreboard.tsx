import React from 'react';
import { AnalysisResult } from '@/types';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MinusCircle,
  GitBranch,
  Search,
  Network,
  Clock,
  Scale,
  ArrowRight,
  BookOpen,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

interface AnalysisScoreboardProps {
  analysis: AnalysisResult;
}

export default function AnalysisScoreboard({ analysis }: AnalysisScoreboardProps) {
  const { plainEnglishMode } = useAnalysisStore();

  // Determine overall verdict
  const { trust, verify, abstain } = analysis.overallDecisionCounts;
  const total = trust + verify + abstain;
  const trustPct = total > 0 ? Math.round((trust / total) * 100) : 0;
  const verifyPct = total > 0 ? Math.round((verify / total) * 100) : 0;
  const abstainPct = total > 0 ? Math.round((abstain / total) * 100) : 0;

  // Figure out primary verdict
  let primaryVerdict: 'TRUST' | 'VERIFY' | 'ABSTAIN' = 'VERIFY';
  if (abstain > 0 && analysis.aggregateMetrics.contradictionRate > 0.5) {
    primaryVerdict = 'ABSTAIN';
  } else if (trust > verify && trust > abstain) {
    primaryVerdict = 'TRUST';
  } else if (verify >= trust) {
    primaryVerdict = 'VERIFY';
  }

  const m = analysis.aggregateMetrics;
  const claims = analysis.claims;
  const sources = analysis.sources;

  // Step 1: Claim Extraction
  const totalClaims = claims.length;

  // Step 2: Evidence Retrieval
  const academicSources = sources.filter((s) => s.tier === 'Academic').length;
  const govSources = sources.filter((s) => s.tier === 'Government').length;
  const mediaSources = sources.filter(
    (s) => s.tier === 'News/Media' || s.tier === 'Aggregator'
  ).length;
  const totalSources = sources.length;

  // Step 3: Provenance / Independence
  const independencePct = Math.round(m.averageIndependence * 100);
  const echoDetected = independencePct < 40;

  // Step 4: Signal Verification
  const freshnessPct = Math.round(m.averageFreshness * 100);
  const contradictionPct = Math.round(m.contradictionRate * 100);
  const hasContradictions = m.contradictionRate > 0.3;
  const isStale = freshnessPct < 50;

  // Step 5: Trust Decision
  const corroborationPct = Math.round(m.overallCorroboration * 100);

  // Step-level status
  const stepStatus = (good: boolean, warn?: boolean) =>
    good ? 'pass' : warn ? 'warn' : 'fail';

  const steps = [
    {
      num: 1,
      icon: Scale,
      name: 'Claim Extraction',
      simpleName: 'Breaking into Facts',
      finding: `${totalClaims} distinct statement${totalClaims !== 1 ? 's' : ''} found in your text.`,
      conclusion:
        totalClaims === 1
          ? 'A single focused claim was identified — easier to audit.'
          : `Multiple claims were extracted and evaluated individually so that one false claim cannot hide behind true ones.`,
      status: stepStatus(true),
    },
    {
      num: 2,
      icon: Search,
      name: 'Evidence Retrieval',
      simpleName: 'Finding Sources',
      finding: `${totalSources} source${totalSources !== 1 ? 's' : ''} retrieved — ${academicSources} academic, ${govSources} government, ${mediaSources} news/media.`,
      conclusion:
        academicSources > 0
          ? `Primary academic literature was found. Peer-reviewed sources carry the most weight.`
          : `No academic papers were found — results rely on secondary or media sources only.`,
      status: stepStatus(academicSources > 0, totalSources > 0 && academicSources === 0),
    },
    {
      num: 3,
      icon: GitBranch,
      name: 'Origin Tracing (TRACE-X)',
      simpleName: 'Tracing Where It Came From',
      finding: `Source independence: ${independencePct}%${echoDetected ? ' — echo chamber detected.' : ' — sources appear diverse.'}`,
      conclusion: echoDetected
        ? `⚠ Multiple sources traced to one root origin. What looks like many confirmations is actually one idea being repeated. This inflates apparent confidence.`
        : `Sources come from genuinely independent origins — no echo chamber detected.`,
      status: stepStatus(!echoDetected, independencePct < 60 && independencePct >= 40),
    },
    {
      num: 4,
      icon: Clock,
      name: 'Signal Verification',
      simpleName: 'Checking Age & Disputes',
      finding: `Freshness: ${freshnessPct}% · Contradiction rate: ${contradictionPct}%`,
      conclusion: hasContradictions
        ? `⚠ Scientific studies that directly contradict this claim were found. It means experts disagree — you should read both sides.`
        : isStale
        ? `The sources are old. Older data may no longer reflect the current scientific understanding.`
        : `No contradictions found and sources are reasonably recent.`,
      status: stepStatus(
        !hasContradictions && !isStale,
        (isStale && !hasContradictions) || (!isStale && hasContradictions)
      ),
    },
    {
      num: 5,
      icon: ShieldCheck,
      name: 'Trust Engine',
      simpleName: 'Final Calculation',
      finding: `${trust} TRUST · ${verify} VERIFY · ${abstain} ABSTAIN across ${totalClaims} claims.`,
      conclusion: `Based on origin diversity, contradiction signals, and source freshness — the system computed a weighted trust score for each claim.`,
      status: stepStatus(trust > 0 && abstain === 0, verify > trust || abstain > 0),
    },
  ];

  // Final verdict config
  const verdictConfig = {
    TRUST: {
      bg: 'bg-emerald-50 border-emerald-300',
      icon: ShieldCheck,
      iconColor: 'text-[#059669]',
      title: 'TRUST',
      color: 'text-[#059669]',
      banner: 'bg-emerald-600',
      guidance: [
        'The evidence is well-corroborated by independent primary sources.',
        'You can use this information with confidence in academic or research contexts.',
        'Still cite primary sources — never rely on a single tool as your final authority.',
        'If this is for a high-stakes decision, always verify directly with the original study.',
      ],
      action: '✅ You can proceed — but always double-check primary sources yourself before submitting any academic work.',
    },
    VERIFY: {
      bg: 'bg-amber-50 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-[#d97706]',
      title: 'VERIFY',
      color: 'text-[#d97706]',
      banner: 'bg-amber-500',
      guidance: [
        'The claim has some support but also significant uncertainty.',
        echoDetected
          ? 'An echo chamber was detected — many sources actually repeat one original claim.'
          : 'Evidence is plausible but may rely on secondary or older sources.',
        hasContradictions ? 'Contradicting studies exist — the scientific community has not reached consensus.' : '',
        'Do not use this as a standalone fact. Verify with additional independent sources.',
      ].filter(Boolean),
      action: '⚠️ Do NOT treat this as confirmed. Find at least 2–3 independent peer-reviewed papers before relying on this claim.',
    },
    ABSTAIN: {
      bg: 'bg-rose-50 border-rose-300',
      icon: ShieldAlert,
      iconColor: 'text-[#e11d48]',
      title: 'ABSTAIN',
      color: 'text-[#e11d48]',
      banner: 'bg-rose-600',
      guidance: [
        'Evidence is strongly contradicted, circular, or severely outdated.',
        'The system cannot assign a confident verdict without risking a wrong conclusion.',
        'Competing studies directly oppose each other — this is an active scientific controversy.',
        'A definitive answer is not possible from available public literature alone.',
      ],
      action: '🚫 Do NOT cite this claim. The evidence is disputed or unreliable. Consult a domain expert or seek primary research from official scientific bodies.',
    },
  };

  const config = verdictConfig[primaryVerdict];
  const VerdictIcon = config.icon;

  const statusIcon = (s: string) => {
    if (s === 'pass') return <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0" />;
    if (s === 'warn') return <AlertTriangle className="h-5 w-5 text-[#d97706] shrink-0" />;
    return <XCircle className="h-5 w-5 text-[#e11d48] shrink-0" />;
  };

  const statusBg = (s: string) => {
    if (s === 'pass') return 'bg-emerald-50 border-emerald-200';
    if (s === 'warn') return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f172a] px-6 py-5 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">
              TRACEVIDENCE — Verdict Scoreboard
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {plainEnglishMode ? 'What Did We Find? Full Audit Summary' : 'Research Synthesis & Epistemic Verdict'}
            </h2>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          Below is a transparent breakdown of every step the engine ran, what was found at each stage,
          and how it all leads to the final verdict.
        </p>
      </div>

      {/* 5-Step Breakdown Table */}
      <div className="divide-y divide-slate-100">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <div key={step.num} className={`flex flex-col sm:flex-row gap-3 p-5 ${statusBg(step.status)}`}>
              {/* Left: Step number + icon */}
              <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-1 sm:w-20 shrink-0">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                    step.status === 'pass'
                      ? 'bg-emerald-100 text-[#059669] border border-emerald-300'
                      : step.status === 'warn'
                      ? 'bg-amber-100 text-[#d97706] border border-amber-300'
                      : 'bg-rose-100 text-[#e11d48] border border-rose-300'
                  }`}
                >
                  {step.num}
                </div>
                <StepIcon
                  className={`h-4 w-4 ${
                    step.status === 'pass'
                      ? 'text-[#059669]'
                      : step.status === 'warn'
                      ? 'text-[#d97706]'
                      : 'text-[#e11d48]'
                  }`}
                />
              </div>

              {/* Middle: Step info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#0f172a]">
                    {plainEnglishMode ? step.simpleName : step.name}
                  </span>
                  {statusIcon(step.status)}
                </div>
                <div className="text-[11px] font-mono text-[#475569] bg-white/70 rounded-lg px-2.5 py-1.5 border border-slate-200/60">
                  📊 {step.finding}
                </div>
                <div className="text-xs text-[#0f172a] leading-relaxed font-medium">
                  {step.conclusion}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score bar */}
      <div className="px-6 pt-5 pb-3 bg-slate-50 border-t border-slate-200">
        <div className="text-xs font-mono font-bold text-[#475569] uppercase tracking-wider mb-2">
          Verdict Distribution Across All Claims
        </div>
        <div className="flex h-4 w-full rounded-full overflow-hidden gap-0.5 bg-slate-200">
          {trustPct > 0 && (
            <div
              className="h-full bg-[#059669] transition-all duration-700"
              style={{ width: `${trustPct}%` }}
              title={`${trustPct}% TRUST`}
            />
          )}
          {verifyPct > 0 && (
            <div
              className="h-full bg-[#d97706] transition-all duration-700"
              style={{ width: `${verifyPct}%` }}
              title={`${verifyPct}% VERIFY`}
            />
          )}
          {abstainPct > 0 && (
            <div
              className="h-full bg-[#e11d48] transition-all duration-700"
              style={{ width: `${abstainPct}%` }}
              title={`${abstainPct}% ABSTAIN`}
            />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-mono font-bold">
          <span className="text-[#059669]">■ {trustPct}% TRUST ({trust})</span>
          <span className="text-[#d97706]">■ {verifyPct}% VERIFY ({verify})</span>
          <span className="text-[#e11d48]">■ {abstainPct}% ABSTAIN ({abstain})</span>
        </div>
      </div>

      {/* Final Verdict Banner */}
      <div className={`${config.bg} border-t-2 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5`}>
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${config.banner} text-white shadow-lg`}
        >
          <VerdictIcon className="h-9 w-9" />
        </div>
        <div className="flex-1">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#475569]">
            Final Verdict
          </div>
          <div className={`text-3xl font-extrabold font-mono tracking-wider ${config.color}`}>
            {config.title}
          </div>
          <ul className="mt-2 space-y-1">
            {config.guidance.map((g, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-xs text-[#0f172a]">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* WHAT SHOULD YOU DO? — Prominent Action Box */}
      <div className="px-6 py-5 bg-[#0f172a] border-t border-slate-800">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="h-5 w-5 text-[#f97316] shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f97316]">
            What Should You Do?
          </span>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed">
          {config.action}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/graph"
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all"
          >
            <Network className="h-4 w-4" />
            <span>See the Evidence Graph</span>
          </Link>
          <Link
            href="/research"
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>View Research Metrics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
