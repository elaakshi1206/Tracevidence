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
        text: 'Direct Scientific Disagreement: Independent authoritative audits refute or strongly contradict this figure.',
        icon: AlertTriangle,
        color: 'text-[#e11d48] bg-rose-50 border-rose-200',
      };
    }
    if (claim.independenceRatio < 0.4 && claim.apparentSourcesCount > 1) {
      return {
        text: `Echo Chamber Detected: ${claim.apparentSourcesCount} different websites all copy 1 single original source.`,
        icon: GitFork,
        color: 'text-[#d97706] bg-amber-50 border-amber-200',
      };
    }
    if (claim.decision === 'TRUST') {
      return {
        text: 'Multi-Origin Verification: Confirmed by genuine, independent primary studies with no conflicts.',
        icon: CheckCircle2,
        color: 'text-[#059669] bg-emerald-50 border-emerald-200',
      };
    }
    return {
      text: 'Preliminary Evidence: Plausible statement, but requires corroboration from more recent or diverse origins.',
      icon: Lightbulb,
      color: 'text-[#0f766e] bg-teal-50 border-teal-200',
    };
  };

  const takeaway = getFriendlyTakeaway();
  const TakeawayIcon = takeaway.icon;

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
            {plainEnglishMode ? 'Trust Level:' : 'Trust Score:'}
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
            title="Calibrated Trust Score"
            simpleExplanation="A mathematical score combining origin independence, evidence quality, source age, and contradictory studies."
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
            <span>NUMERICAL CONFLICT DETECTED</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-white p-2 border border-rose-200">
              <span className="text-slate-500 block">Claimed in News:</span>
              <span className="font-bold text-[#e11d48]">{claim.numericalConflict.claimedValue}</span>
            </div>
            <div className="rounded-lg bg-white p-2 border border-emerald-200">
              <span className="text-slate-500 block">Verified Lab Audit:</span>
              <span className="font-bold text-[#059669]">{claim.numericalConflict.rebuttalValue}</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-rose-900/90 leading-relaxed font-sans">{claim.numericalConflict.deltaNote}</p>
        </div>
      )}

      {/* Clean Metric Boxes */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3.5 border-t border-slate-100">
        {/* Independence Metric Box */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              {plainEnglishMode ? 'Original Sources' : 'Independence'}
            </span>
            <GitFork className="h-3.5 w-3.5 text-[#0f766e]" />
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-[#0f172a]">
            {claim.apparentSourcesCount} citing &rarr;{' '}
            <span
              className={
                claim.independenceRatio >= 0.6
                  ? 'text-[#059669]'
                  : claim.independenceRatio >= 0.35
                  ? 'text-[#d97706]'
                  : 'text-[#e11d48]'
              }
            >
              {claim.independentOriginsCount} origin{claim.independentOriginsCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {claim.apparentSourcesCount > claim.independentOriginsCount
              ? `${claim.apparentSourcesCount - claim.independentOriginsCount} duplicate echoes`
              : 'Independent voices'}
          </div>
        </div>

        {/* Source Freshness Metric Box */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              {plainEnglishMode ? 'Freshness' : 'Temporal Status'}
            </span>
            <Clock className="h-3.5 w-3.5 text-[#0f766e]" />
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
              {claim.temporalStatus}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Score: {(claim.freshnessScore * 100).toFixed(0)}%
          </div>
        </div>

        {/* Contradiction Status Box */}
        <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-200/80 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">
              {plainEnglishMode ? 'Disputes' : 'Contradiction'}
            </span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-1 font-mono text-xs font-bold">
            {claim.contradictionDetected ? (
              <span className="text-[#e11d48]">Contradicted</span>
            ) : (
              <span className="text-[#059669]">No Conflict</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Academic Consensus
          </div>
        </div>
      </div>

      {/* "Why this decision?" Prominent Box */}
      <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-[#475569] leading-relaxed">
        <div className="flex items-center space-x-1.5 font-bold text-[#0f172a] mb-1">
          <Sparkles className="h-3.5 w-3.5 text-[#0f766e]" />
          <span>Why this decision?</span>
        </div>
        <p>{claim.decisionReason}</p>
        <div className="mt-2 pt-2 border-t border-slate-200/70 text-[11px] font-mono text-slate-600">
          <span className="font-bold text-[#0f766e]">Recommended Action:</span> {claim.recommendedAction}
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <Link
          href="/graph"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 px-3 py-1.5 text-[#0f766e] font-semibold transition-colors border border-teal-200"
        >
          <Network className="h-3.5 w-3.5" />
          <span>View on Graph</span>
        </Link>

        <Link
          href={`/claims/${claim.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1 font-bold text-[#0f766e] hover:text-[#115e59] transition-colors"
        >
          <span>Inspect Proof & Math Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
