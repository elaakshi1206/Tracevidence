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
    (s) => s.tier === 'Reputable Media' || s.tier === 'Aggregator/Blog'
  ).length;
  const totalSources = sources.length;

  // Step 3: Independence
  const independencePct = Math.round(m.averageIndependence * 100);
  const echoDetected = independencePct < 40;

  // Step 4: Freshness & Contradictions
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
      name: 'Step 1: Breaking Your Text Into Individual Facts',
      whyItMatters: 'A paragraph may contain 3 true statements and 1 false one. By splitting it apart, we can test each statement on its own — so one false claim cannot hide behind the true ones.',
      finding: `${totalClaims} individual statement${totalClaims !== 1 ? 's' : ''} found in your text.`,
      conclusion:
        totalClaims === 1
          ? 'Only one statement was identified, making it easy to audit directly.'
          : `${totalClaims} separate statements were extracted and each will be evaluated individually.`,
      status: stepStatus(true),
    },
    {
      num: 2,
      icon: Search,
      name: 'Step 2: Finding Scientific Sources That Mention This',
      whyItMatters: 'We look for sources in order of quality: academic papers (highest) → government reports → news/media (lowest). More peer-reviewed sources = more reliable results.',
      finding: `${totalSources} source${totalSources !== 1 ? 's' : ''} found — ${academicSources} academic papers, ${govSources} government documents, ${mediaSources} news/media articles.`,
      conclusion:
        academicSources > 0
          ? `Found peer-reviewed academic papers — these carry the most weight because other scientists checked them before publishing.`
          : `No academic papers found — results depend on secondary sources like news or blogs, which are less reliable.`,
      status: stepStatus(academicSources > 0, totalSources > 0 && academicSources === 0),
    },
    {
      num: 3,
      icon: GitBranch,
      name: 'Step 3: Checking If Sources Are Truly Independent',
      whyItMatters: 'If 10 news websites all copied the same single study, that is NOT 10 separate proofs — it is 1 proof repeated 10 times. This step collapses all the copies to count only the real, unique origins.',
      finding: `${independencePct}% of sources are genuinely independent${echoDetected ? ' — echo chamber detected!' : ' — sources come from different origins.'}`,
      conclusion: echoDetected
        ? `⚠ Several sources were traced back to the same single original publication. What looks like widespread agreement is actually one idea being repeated many times. This inflates apparent confidence.`
        : `Sources come from genuinely separate research groups — no copying detected.`,
      status: stepStatus(!echoDetected, independencePct < 60 && independencePct >= 40),
    },
    {
      num: 4,
      icon: Clock,
      name: 'Step 4: Checking How Old the Data Is & Whether Experts Disagree',
      whyItMatters: 'Old data can be wrong — science updates constantly. Also, if expert studies directly contradict a claim, it means scientists disagree, and you should read both sides before accepting it as fact.',
      finding: `Data freshness: ${freshnessPct}% · Expert contradictions found: ${contradictionPct}%`,
      conclusion: hasContradictions
        ? `⚠ Scientific studies that directly contradict this claim were found. This is an active scientific debate — experts do not agree. Do not treat it as a settled fact.`
        : isStale
        ? `The sources are older. Newer research may have changed our understanding of this topic.`
        : `No contradictions found, and sources are reasonably recent — a good sign.`,
      status: stepStatus(
        !hasContradictions && !isStale,
        (isStale && !hasContradictions) || (!isStale && hasContradictions)
      ),
    },
    {
      num: 5,
      icon: ShieldCheck,
      name: 'Step 5: Computing the Final Trust Decision',
      whyItMatters: 'The system combines all 4 previous steps into one final score using a formula. It weighs source independence, data freshness, and contradictions together. If the evidence is genuinely conflicted, it says ABSTAIN rather than guess.',
      finding: `Result: ${trust} TRUST · ${verify} VERIFY · ${abstain} ABSTAIN across ${totalClaims} statement${totalClaims !== 1 ? 's' : ''}.`,
      conclusion: `After weighing source diversity, data age, and expert disagreements, the system gave each statement a final verdict. See below for the overall result.`,
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
        'Multiple genuinely independent sources confirmed this from different research groups.',
        'You can use this information confidently in academic or research contexts.',
        'Always cite the original primary source — never just say "AI said so".',
        'For high-stakes decisions (medical, legal), verify directly with the original published study.',
      ],
      action: '✅ You can proceed — but always cite the primary source and double-check it yourself before submitting academic work.',
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
          ? 'An echo chamber was detected — many sources are actually repeating one original publication, so apparent agreement is misleading.'
          : 'Evidence is plausible but may rely on secondary or older sources that have not been independently verified.',
        hasContradictions ? 'Scientific studies exist that contradict this claim — experts have not reached consensus.' : '',
        'Do not use this as a standalone fact. Find at least 2–3 independent peer-reviewed papers first.',
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
        'The evidence is strongly contradicted, circular (all copies of one source), or severely outdated.',
        'The system refuses to give a verdict because the risk of being wrong is too high.',
        'Competing studies directly contradict each other — this is an active scientific controversy with no settled answer.',
        'A reliable conclusion cannot be drawn from available public literature alone.',
      ],
      action: '🚫 Do NOT cite this claim. The evidence is disputed or unreliable. Consult a domain expert or find primary research from official scientific bodies.',
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
              TRACEVIDENCE — Full Audit Summary
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              What Did We Find? Here Is How We Decided.
            </h2>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          Every step the system ran is shown below — what was found, why it matters, and how it all leads to the final verdict. Nothing is hidden.
        </p>

        {/* Quick Verdict Legend */}
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-mono font-bold">
          <span className="flex items-center space-x-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1 border border-emerald-400/30">
            <span className="text-emerald-400">🟢 TRUST</span>
            <span className="text-slate-300 font-normal">= Safe to cite (with source)</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 border border-amber-400/30">
            <span className="text-amber-400">🟡 VERIFY</span>
            <span className="text-slate-300 font-normal">= Double-check first</span>
          </span>
          <span className="flex items-center space-x-1.5 rounded-lg bg-rose-500/20 px-2.5 py-1 border border-rose-400/30">
            <span className="text-rose-400">🔴 ABSTAIN</span>
            <span className="text-slate-300 font-normal">= Do NOT cite</span>
          </span>
        </div>
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
                    {step.name}
                  </span>
                  {statusIcon(step.status)}
                </div>
                {/* Why this step matters */}
                <div className="text-[11px] text-[#0f766e] bg-teal-50 rounded-lg px-2.5 py-1.5 border border-teal-100 leading-snug font-medium">
                  💡 Why this step: {step.whyItMatters}
                </div>
                <div className="text-[11px] font-mono text-[#475569] bg-white/70 rounded-lg px-2.5 py-1.5 border border-slate-200/60">
                  📊 What we found: {step.finding}
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
        <div className="text-xs font-mono font-bold text-[#475569] uppercase tracking-wider mb-1">
          How many of your {total} statement{total !== 1 ? 's' : ''} got each result?
        </div>
        <div className="text-[11px] text-slate-500 mb-2 font-sans">
          Green = TRUST (safe to use) · Amber = VERIFY (double-check) · Red = ABSTAIN (do not cite)
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
          <span className="text-[#059669]">■ {trustPct}% TRUST — {trust} statement{trust !== 1 ? 's' : ''} safe to use</span>
          <span className="text-[#d97706]">■ {verifyPct}% VERIFY — {verify} need checking</span>
          <span className="text-[#e11d48]">■ {abstainPct}% ABSTAIN — {abstain} should NOT be cited</span>
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
            Overall Final Verdict
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
            What Should You Do Next?
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
            <span>See the Source Map (Evidence Graph)</span>
          </Link>
          <Link
            href="/research"
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>View Detailed Research Stats</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
