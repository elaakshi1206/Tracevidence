import React, { useState } from 'react';
import Link from 'next/link';
import { Claim } from '@/types';
import DecisionBadge from '../common/DecisionBadge';
import ContextHelpTooltip from '../common/ContextHelpTooltip';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  GitFork,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Network,
  CheckCircle2,
  Quote,
  Scale,
  Sparkles,
} from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function ClaimCard({ claim, isSelected, onSelect }: ClaimCardProps) {
  const { plainEnglishMode } = useAnalysisStore();
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  // Exact color scheme mappings:
  // TRUST: Emerald Green (#059669)
  // VERIFY: Amber (#D97706)
  // ABSTAIN: Soft Rose (#E11D48)
  const borderColors = {
    TRUST: isSelected
      ? 'border-[#059669] ring-2 ring-emerald-400/40 shadow-md'
      : 'border-emerald-200 hover:border-[#059669]',
    VERIFY: isSelected
      ? 'border-[#d97706] ring-2 ring-amber-400/40 shadow-md'
      : 'border-amber-200 hover:border-[#d97706]',
    ABSTAIN: isSelected
      ? 'border-[#e11d48] ring-2 ring-rose-400/40 shadow-md'
      : 'border-rose-200 hover:border-[#e11d48]',
  };

  const bgColors = {
    TRUST: 'bg-white',
    VERIFY: 'bg-white',
    ABSTAIN: 'bg-white',
  };

  // Student-friendly takeaway
  const getFriendlyTakeaway = () => {
    if (claim.contradictionDetected) {
      return {
        text: 'Scientists Disagree: Independent research studies have found evidence that directly contradicts this claim.',
        icon: AlertTriangle,
        color: 'text-[#e11d48] bg-rose-50 border-rose-200',
      };
    }
    if (claim.independenceRatio < 0.4 && claim.apparentSourcesCount > 1) {
      return {
        text: `Echo Chamber: ${claim.apparentSourcesCount} different websites all copied 1 single original source. That is NOT ${claim.apparentSourcesCount} separate proofs — it is 1 proof repeated ${claim.apparentSourcesCount} times.`,
        icon: GitFork,
        color: 'text-[#d97706] bg-amber-50 border-amber-200',
      };
    }
    if (claim.decision === 'TRUST') {
      return {
        text: 'Confirmed by Multiple Independent Sources: Different research teams — with no connection to each other — all reached the same conclusion. That is a strong sign of reliability.',
        icon: CheckCircle2,
        color: 'text-[#059669] bg-emerald-50 border-emerald-200',
      };
    }
    return {
      text: 'Possible but Unconfirmed: This claim is plausible, but we need more evidence from different, independent research groups before it can be considered settled.',
      icon: Lightbulb,
      color: 'text-[#0f766e] bg-teal-50 border-teal-200',
    };
  };

  const takeaway = getFriendlyTakeaway();
  const TakeawayIcon = takeaway.icon;

  // Plain-English reason for the independence score
  const getIndependenceReason = () => {
    if (claim.independentOriginsCount === 1 && claim.apparentSourcesCount > 2)
      return `All ${claim.apparentSourcesCount} sources trace back to a single original publication. When many websites repeat one source, it only counts as 1 real proof — not many.`;
    if (claim.independenceRatio >= 0.6)
      return `${claim.independentOriginsCount} genuinely separate research teams confirmed this independently. Independent confirmation is the gold standard of evidence.`;
    return `Some of the ${claim.apparentSourcesCount} sources appear to be copying from each other. We count only the truly independent ones.`;
  };

  // Plain-English reason for freshness
  const getFreshnessReason = () => {
    if (claim.temporalStatus === 'Current')
      return 'The sources are recent. New data is less likely to have been overturned by more recent science.';
    if (claim.temporalStatus === 'Outdated')
      return 'The sources are old. Science and facts can change — newer studies may paint a different picture.';
    return 'The sources are moderately recent. Worth verifying with newer publications if possible.';
  };

  // Plain-English reason for contradiction
  const getContradictionReason = () => {
    if (claim.contradictionDetected)
      return 'At least one peer-reviewed scientific study was found that directly refutes this claim. This means there is a genuine dispute among experts — you should read both sides.';
    return 'No published scientific study was found that directly contradicts this claim. The absence of contradiction adds to its trustworthiness, though it does not guarantee truth.';
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 shadow-xs hover:shadow-md ${borderColors[claim.decision]} ${bgColors[claim.decision]}`}
    >
      {/* Top Header: Decision & Trust Score */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-2">
          <DecisionBadge decision={claim.decision} size="sm" />
          <span className="font-mono text-xs font-semibold text-slate-400">
            {claim.id}
          </span>
          {claim.reliabilityIndicator && (
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold ${
                claim.reliabilityIndicator === 'High Rigor'
                  ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                  : claim.reliabilityIndicator === 'Moderate Reliability'
                  ? 'bg-teal-50 text-[#0f766e] border border-teal-200'
                  : 'bg-amber-50 text-[#d97706] border border-amber-200'
              }`}
            >
              {claim.reliabilityIndicator}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 rounded-xl bg-slate-50 px-3 py-1 border border-slate-200/80 font-mono text-xs">
          <span className="text-[#475569] font-medium">
            Trust Score:
          </span>
          <span
            className={`font-black text-sm ${
              claim.decision === 'TRUST'
                ? 'text-[#059669]'
                : claim.decision === 'VERIFY'
                ? 'text-[#d97706]'
                : 'text-[#e11d48]'
            }`}
          >
            {(claim.confidence * 100).toFixed(0)}%
          </span>
          <ContextHelpTooltip
            title="How is the Trust Score calculated?"
            simpleExplanation="This % is calculated from 4 things combined: (1) how many sources are truly independent, (2) how fresh/recent the data is, (3) whether expert studies contradict it, and (4) how strong the overall evidence is."
            whyItMatters="A higher score means more reliable. But even a 95% score doesn't mean 100% certain — always check primary sources for important decisions."
            example="If 5 independent labs all confirm the same result AND the data is recent AND no expert disputes it, the score will be very high (e.g. 88%)."
            size="xs"
          />
        </div>
      </div>

      {/* Target Entity & Claim Statement */}
      <div className="mt-4 space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#0f766e] font-mono">
          Topic: {claim.targetEntity}
        </div>
        <h3 className="text-base font-bold text-[#0f172a] leading-snug">
          &ldquo;{claim.text}&rdquo;
        </h3>
      </div>

      {/* Supporting Quote */}
      {claim.inputQuote && claim.inputQuote !== claim.text && (
        <div className="mt-3 flex items-start space-x-2 rounded-xl bg-slate-50 p-3 text-xs text-[#475569] border border-slate-200/70">
          <Quote className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="italic line-clamp-2">&ldquo;{claim.inputQuote}&rdquo;</span>
        </div>
      )}

      {/* Friendly Takeaway Banner */}
      <div className={`mt-3.5 flex items-start space-x-2.5 rounded-xl p-3 text-xs font-medium border ${takeaway.color}`}>
        <TakeawayIcon className="h-4 w-4 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{takeaway.text}</span>
      </div>

      {/* Explicit Numerical Conflict Box (If detected) */}
      {claim.numericalConflict && (
        <div className="mt-3.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-950 font-mono">
          <div className="flex items-center space-x-1.5 font-bold text-[#e11d48]">
            <Scale className="h-4 w-4 text-[#e11d48]" />
            <span>NUMBER CONFLICT DETECTED — Two sources give different figures!</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-white p-2 border border-rose-200">
              <span className="text-slate-500 block">What the news says:</span>
              <span className="font-bold text-[#e11d48]">{claim.numericalConflict.claimedValue}</span>
            </div>
            <div className="rounded-lg bg-white p-2 border border-emerald-200">
              <span className="text-slate-500 block">What verified research found:</span>
              <span className="font-bold text-[#059669]">{claim.numericalConflict.rebuttalValue}</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-rose-900/90 leading-relaxed font-sans">{claim.numericalConflict.deltaNote}</p>
        </div>
      )}

      {/* Clean Metric Boxes */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3.5 border-t border-slate-100">

        {/* Source Diversity (formerly Independence) */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              Source Diversity
            </span>
            <div className="flex items-center space-x-1">
              <GitFork className="h-3.5 w-3.5 text-[#0f766e]" />
              <ContextHelpTooltip
                title="What is Source Diversity?"
                simpleExplanation="This checks if the sources confirming this claim are truly separate research teams, or if they are all just copying from one original report."
                whyItMatters="10 news sites repeating 1 study = 1 real proof. 3 truly independent labs confirming the same thing = 3 real proofs. Only independent sources count."
                example="If BBC, CNN, and Times all reported the same NASA press release, that counts as 1 independent origin (NASA), not 3."
                size="xs"
              />
            </div>
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-[#0f172a]">
            {claim.apparentSourcesCount} found →{' '}
            <span
              className={
                claim.independenceRatio >= 0.6
                  ? 'text-[#059669]'
                  : claim.independenceRatio >= 0.35
                  ? 'text-[#d97706]'
                  : 'text-[#e11d48]'
              }
            >
              {claim.independentOriginsCount} truly independent
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {claim.apparentSourcesCount > claim.independentOriginsCount
              ? `${claim.apparentSourcesCount - claim.independentOriginsCount} are copies of the same source`
              : 'All sources are genuinely independent'}
          </div>
          <div className="mt-1.5 text-[10px] text-slate-600 bg-white rounded-md px-2 py-1.5 border border-slate-200/60 leading-snug">
            <span className="font-semibold text-slate-700">Why this score: </span>
            {getIndependenceReason()}
          </div>
        </div>

        {/* Source Freshness (formerly Temporal Status) */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              How Old Is This Data?
            </span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-[#0f766e]" />
              <ContextHelpTooltip
                title="Why does the age of data matter?"
                simpleExplanation="Science and facts can change over time. A study from 10 years ago might have been overturned by newer research. Fresh data is generally more reliable."
                whyItMatters="Old data about fast-changing fields (medicine, technology, climate) may be completely wrong today, even if it was accurate when published."
                example="A 2010 study saying 'smartphones cause no harm' may be outdated — newer 2024 studies have much better data."
                size="xs"
              />
            </div>
          </div>
          <div className="mt-1 font-mono text-xs font-bold">
            <span
              className={
                claim.temporalStatus === 'Current'
                  ? 'text-[#059669]'
                  : claim.temporalStatus === 'Outdated'
                  ? 'text-[#e11d48]'
                  : 'text-[#d97706]'
              }
            >
              {claim.temporalStatus === 'Current'
                ? '✓ Recent Data'
                : claim.temporalStatus === 'Outdated'
                ? '⚠ Old Data'
                : '~ Moderately Recent'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Freshness: {(claim.freshnessScore * 100).toFixed(0)}% (100% = very recent)
          </div>
          <div className="mt-1.5 text-[10px] text-slate-600 bg-white rounded-md px-2 py-1.5 border border-slate-200/60 leading-snug">
            <span className="font-semibold text-slate-700">Why this score: </span>
            {getFreshnessReason()}
          </div>
        </div>

        {/* Expert Disagreement (formerly Contradiction) */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              Do Experts Disagree?
            </span>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <ContextHelpTooltip
                title="What does 'Expert Disagreement' mean?"
                simpleExplanation="This checks whether any peer-reviewed scientific paper (checked by other experts before publishing) directly says this claim is wrong or inaccurate."
                whyItMatters="If multiple credible scientists disagree with a claim, it means the claim is either false, exaggerated, or part of an ongoing scientific debate — and you should not treat it as settled fact."
                example="Claim: 'Coffee is bad for you'. If 3 major studies say it is fine and 2 say it is harmful, that is a contradiction — the science is not settled."
                size="xs"
              />
            </div>
          </div>
          <div className="mt-1 font-mono text-xs font-bold">
            {claim.contradictionDetected ? (
              <span className="text-[#e11d48]">🚫 Yes — Experts Dispute This</span>
            ) : (
              <span className="text-[#059669]">✓ No Disputes Found</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Based on published peer-reviewed research
          </div>
          <div className="mt-1.5 text-[10px] text-slate-600 bg-white rounded-md px-2 py-1.5 border border-slate-200/60 leading-snug">
            <span className="font-semibold text-slate-700">Why this score: </span>
            {getContradictionReason()}
          </div>
        </div>
      </div>

      {/* "Why this decision?" Prominent Box with True/False Explanation */}
      <div
        className={`mt-4 rounded-xl p-4 border text-xs leading-relaxed ${
          claim.decision === 'ABSTAIN'
            ? 'bg-rose-50/80 border-rose-300 text-rose-950'
            : claim.decision === 'VERIFY'
            ? 'bg-amber-50/80 border-amber-300 text-amber-950'
            : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex items-center space-x-1.5 font-bold mb-1.5">
          {claim.decision === 'ABSTAIN' ? (
            <>
              <ShieldAlert className="h-4 w-4 text-[#e11d48]" />
              <span className="text-[#e11d48] uppercase tracking-wider font-mono text-[11px]">
                Why the system says: DO NOT CITE THIS
              </span>
            </>
          ) : claim.decision === 'VERIFY' ? (
            <>
              <AlertTriangle className="h-4 w-4 text-[#d97706]" />
              <span className="text-[#d97706] uppercase tracking-wider font-mono text-[11px]">
                Why the system says: DOUBLE-CHECK BEFORE USING
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 text-[#059669]" />
              <span className="text-[#059669] uppercase tracking-wider font-mono text-[11px]">
                Why the system says: SAFE TO USE (with citation)
              </span>
            </>
          )}
        </div>
        <p className="font-medium text-slate-800">{claim.decisionReason}</p>
        <div
          className={`mt-2 pt-2 border-t text-[11px] font-mono ${
            claim.decision === 'ABSTAIN'
              ? 'border-rose-200 text-rose-800'
              : claim.decision === 'VERIFY'
              ? 'border-amber-200 text-amber-800'
              : 'border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="font-bold">WHAT YOU SHOULD DO:</span> {claim.recommendedAction}
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-2">
          <Link
            href="/graph"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 px-3 py-1.5 text-[#0f766e] font-semibold transition-colors border border-teal-200"
          >
            <Network className="h-3.5 w-3.5" />
            <span>See Source Map (Graph)</span>
          </Link>

          <Link
            href={`/claims/${claim.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 px-3 py-1.5 text-[#ea580c] font-bold transition-colors border border-orange-200"
            title="See what each source actually says vs what was claimed"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Compare Claim vs Sources</span>
          </Link>
        </div>

        <Link
          href={`/claims/${claim.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1 font-bold text-[#0f766e] hover:text-[#115e59] transition-colors"
        >
          <span>See All Evidence & Calculations</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
