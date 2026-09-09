'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  FileText,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import ContextHelpTooltip from '../common/ContextHelpTooltip';

interface MajorStepConclusionsProps {
  analysis: AnalysisResult;
}

export default function MajorStepConclusions({ analysis }: MajorStepConclusionsProps) {
  const { plainEnglishMode } = useAnalysisStore();

  const claimsCount = analysis.claims.length;
  const sourcesCount = analysis.sources.length;
  const m = analysis.aggregateMetrics;
  const independencePct = Math.round(m.averageIndependence * 100);
  const echoChamber = independencePct < 40;
  const contradictionRate = Math.round(m.contradictionRate * 100);
  const hasContradiction = m.contradictionRate > 0.3;

  const claims = analysis.claims;
  const { trust, verify, abstain } = analysis.overallDecisionCounts;
  const total = trust + verify + abstain;

  // Primary decision
  let primaryVerdict: 'TRUST' | 'VERIFY' | 'ABSTAIN' = 'VERIFY';
  if (total === 1) {
    primaryVerdict = claims[0]?.decision || (abstain > 0 ? 'ABSTAIN' : trust > 0 ? 'TRUST' : 'VERIFY');
  } else if (abstain > 0 && (abstain >= trust || m.contradictionRate > 0.2 || claims.some((c: any) => c.decision === 'ABSTAIN' && c.contradictionDetected))) {
    primaryVerdict = 'ABSTAIN';
  } else if (trust > verify && trust > abstain) {
    primaryVerdict = 'TRUST';
  } else {
    primaryVerdict = 'VERIFY';
  }

  // 1. Claim Extraction Conclusion
  const claimConclusion = {
    title: plainEnglishMode ? 'Step 1: Claim Extraction Conclusion' : 'Stage 1: Atomic Claim Extraction Conclusion',
    status: 'pass',
    badge: `${claimsCount} Claim${claimsCount !== 1 ? 's' : ''} Isolated`,
    text:
      claimsCount === 1
        ? 'A single clear fact was extracted from your text. Isolating the main claim allows us to verify it against primary data without distractions.'
        : `Deconstructed the paragraph into ${claimsCount} distinct testable claims. Each statement is tested individually so that a misleading sentence cannot hide behind truthful ones.`,
    note: plainEnglishMode
      ? 'Why this matters: Big paragraphs often mix true facts with false rumors. Breaking them up ensures every claim is independently audited.'
      : 'Eliminates compound proposition masking via atomic propositional decomposition.',
  };

  // 2. Evidence & Provenance Conclusion
  const evidenceConclusion = {
    title: plainEnglishMode ? 'Step 2: Evidence & Provenance Conclusion' : 'Stage 2: Evidence Lineage & Provenance Conclusion',
    status: echoChamber || hasContradiction ? 'warn' : 'pass',
    badge: echoChamber
      ? 'Echo Chamber Detected'
      : hasContradiction
      ? 'Dispute Detected'
      : `${sourcesCount} Sources Traced`,
    text: echoChamber
      ? `We found ${sourcesCount} sources, but they trace back to only a single root origin. What looks like wide agreement is actually websites repeating the same original claim.`
      : hasContradiction
      ? `Authoritative scientific sources disagree on this topic (${contradictionRate}% contradiction rate). When studies conflict, information cannot be accepted as settled fact.`
      : `Found ${sourcesCount} independent sources from reputable publications. Evidence comes from separate origins with no sign of circular copying.`,
    note: echoChamber
      ? 'Student Tip: Just because 5 websites say the same thing does not make it true if they all copied each other!'
      : hasContradiction
      ? 'Student Tip: Always check if newer studies overturned what older articles reported.'
      : 'Verified multi-origin corroboration without syndication collapse.',
  };

  // 3. Final Trust Decision Conclusion
  const finalConclusion = {
    title: plainEnglishMode ? 'Step 3: Final Trust Decision Conclusion' : 'Stage 3: Calibrated Decision Conclusion',
    status: primaryVerdict === 'TRUST' ? 'pass' : primaryVerdict === 'VERIFY' ? 'warn' : 'fail',
    badge: `Verdict: ${primaryVerdict}`,
    text:
      primaryVerdict === 'TRUST'
        ? `Result: TRUST (${trust}/${total} claims verified). Multiple independent scientific sources confirm the statements with high freshness and zero major contradictions.`
        : primaryVerdict === 'VERIFY'
        ? `Result: VERIFY (${verify}/${total} claims pending verification). The statements have partial support, but rely on older data, secondary news reports, or an echo chamber.`
        : `Result: ABSTAIN (${abstain}/${total} claims rejected). Serious scientific contradictions or circular citations were found. The system refuses to endorse this claim to prevent spreading falsehoods.`,
    action:
      primaryVerdict === 'TRUST'
        ? '✓ Safe to use in homework, school projects, or research. Always cite the primary study.'
        : primaryVerdict === 'VERIFY'
        ? '⚠ Do not rely on this alone. Look for at least 2 primary academic studies before quoting.'
        : '🚫 Do not cite this claim. Consult verified scientific guidelines or an expert teacher.',
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-[#0f766e]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0f766e]">
              Transparency Audit
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
              Conclusions After Each Major Step
            </h3>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Clear, simple findings written for students &amp; teachers
        </div>
      </div>

      {/* 3 Prominent Step Conclusion Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Claim Extraction Conclusion */}
        <div className="flex flex-col justify-between rounded-xl border border-blue-200 bg-blue-50/40 p-4.5 transition-all hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5 font-mono text-xs font-bold text-blue-800">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>1. Claim Extraction</span>
              </span>
              <span className="rounded bg-blue-100 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800">
                {claimConclusion.badge}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] mb-1.5">
              {claimConclusion.title}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {claimConclusion.text}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-blue-200/80 text-[11px] text-blue-900 bg-white/80 rounded-lg p-2 leading-snug">
            💡 {claimConclusion.note}
          </div>
        </div>

        {/* Box 2: Evidence & Provenance Conclusion */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all hover:shadow-xs ${
            evidenceConclusion.status === 'pass'
              ? 'border-emerald-200 bg-emerald-50/40'
              : 'border-amber-200 bg-amber-50/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[#0f172a]">
                <GitBranch className="h-4 w-4 text-[#0f766e]" />
                <span>2. Evidence &amp; Provenance</span>
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${
                  evidenceConclusion.status === 'pass'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                {evidenceConclusion.badge}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] mb-1.5">
              {evidenceConclusion.title}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {evidenceConclusion.text}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-800 bg-white/80 rounded-lg p-2 leading-snug">
            💡 {evidenceConclusion.note}
          </div>
        </div>

        {/* Box 3: Final Trust Decision Conclusion */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all hover:shadow-xs ${
            finalConclusion.status === 'pass'
              ? 'border-emerald-200 bg-emerald-50/50'
              : finalConclusion.status === 'warn'
              ? 'border-amber-200 bg-amber-50/50'
              : 'border-rose-200 bg-rose-50/50'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[#0f172a]">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    finalConclusion.status === 'pass'
                      ? 'text-[#059669]'
                      : finalConclusion.status === 'warn'
                      ? 'text-[#d97706]'
                      : 'text-[#e11d48]'
                  }`}
                />
                <span>3. Final Trust Decision</span>
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${
                  finalConclusion.status === 'pass'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : finalConclusion.status === 'warn'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {finalConclusion.badge}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] mb-1.5">
              {finalConclusion.title}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {finalConclusion.text}
            </p>
          </div>
          <div
            className={`mt-3 pt-2.5 border-t rounded-lg p-2 text-[11px] font-semibold leading-snug ${
              finalConclusion.status === 'pass'
                ? 'bg-emerald-100/70 text-emerald-900 border-emerald-200'
                : finalConclusion.status === 'warn'
                ? 'bg-amber-100/70 text-amber-900 border-amber-200'
                : 'bg-rose-100/70 text-rose-900 border-rose-200'
            }`}
          >
            {finalConclusion.action}
          </div>
        </div>
      </div>
    </div>
  );
}
