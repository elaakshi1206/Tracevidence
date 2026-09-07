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
  ExternalLink,
  ChevronDown,
  Lightbulb,
} from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function ClaimCard({ claim, isSelected, onSelect }: ClaimCardProps) {
  const { plainEnglishMode } = useAnalysisStore();
  const [showInsight, setShowInsight] = useState(false);

  const borderColors = {
    TRUST: isSelected
      ? 'border-emerald-400 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-400/40'
      : 'border-emerald-500/40 hover:border-emerald-400/70',
    VERIFY: isSelected
      ? 'border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/40'
      : 'border-amber-500/40 hover:border-amber-400/70',
    ABSTAIN: isSelected
      ? 'border-rose-400 shadow-xl shadow-rose-500/20 ring-1 ring-rose-400/40'
      : 'border-rose-500/40 hover:border-rose-400/70',
  };

  const bgColors = {
    TRUST: 'bg-gradient-to-br from-emerald-950/30 via-[#101728] to-[#0c1220]',
    VERIFY: 'bg-gradient-to-br from-amber-950/30 via-[#101728] to-[#0c1220]',
    ABSTAIN: 'bg-gradient-to-br from-rose-950/30 via-[#101728] to-[#0c1220]',
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 shadow-lg ${borderColors[claim.decision]} ${bgColors[claim.decision]}`}
    >
      {/* Top Header: Decision & Trust Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <DecisionBadge decision={claim.decision} size="sm" />
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-300">
            {claim.id}
          </span>
          <ContextHelpTooltip
            title={`${claim.decision} Decision Explained`}
            simpleExplanation={
              claim.decision === 'TRUST'
                ? 'Supported by multiple genuinely independent primary origins without contradiction.'
                : claim.decision === 'VERIFY'
                ? 'Contains plausible evidence, but relies on a single source or secondary coverage.'
                : 'Evidence is conflicted, circular, or outdated. The system abstains to avoid false confidence.'
            }
            whyItMatters="Tells you right away whether this statement is safe to believe or needs investigation."
            size="xs"
          />
        </div>

        <div className="flex items-center space-x-2 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-white/10 font-mono text-xs sm:text-sm">
          <span className="text-slate-300 font-semibold">
            {plainEnglishMode ? 'Trust Level:' : 'Trust Score:'}
          </span>
          <span
            className={`font-black text-sm sm:text-base ${
              claim.decision === 'TRUST'
                ? 'text-emerald-400'
                : claim.decision === 'VERIFY'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {(claim.confidence * 100).toFixed(0)}%
          </span>
          <ContextHelpTooltip
            title="Mathematical Trust Score T(c)"
            simpleExplanation="The mathematical confidence combining evidence strength, origin diversity, freshness, and contradictions."
            whyItMatters="Unlike black-box AI, every percent is mathematically audited."
            size="xs"
          />
        </div>
      </div>

      {/* Target Entity & Claim Text */}
      <div className="mt-4">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 font-mono">
          Target: {claim.targetEntity}
        </div>
        <p className="mt-1.5 text-base sm:text-lg font-semibold text-white leading-relaxed">
          &ldquo;{claim.text}&rdquo;
        </p>
      </div>

      {/* Research Signals Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-white/10 pt-4">
        {/* Source Independence Factor */}
        <div className="rounded-xl bg-black/30 p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
              <GitFork className="h-3.5 w-3.5 text-blue-400" />
              <span>{plainEnglishMode ? 'Originality' : 'Independence'}</span>
            </div>
            <ContextHelpTooltip
              title="Origin Independence"
              simpleExplanation={`${claim.apparentSourcesCount} different websites reported this, but they trace back to only ${claim.independentOriginsCount} primary origin seed.`}
              whyItMatters="Prevents you from being tricked when 10 news sites copy 1 tweet."
              size="xs"
            />
          </div>
          <div className="mt-1.5 font-mono text-xs sm:text-sm font-bold text-white">
            {claim.apparentSourcesCount} sources &rarr;{' '}
            <span
              className={
                claim.independenceRatio >= 0.6
                  ? 'text-emerald-400'
                  : claim.independenceRatio >= 0.35
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            >
              {claim.independentOriginsCount} origin{claim.independentOriginsCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Ratio: {(claim.independenceRatio * 100).toFixed(0)}%
          </div>
        </div>

        {/* Temporal Freshness */}
        <div className="rounded-xl bg-black/30 p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-300" />
              <span>{plainEnglishMode ? 'Age' : 'Freshness'}</span>
            </div>
            <ContextHelpTooltip
              title="Temporal Freshness"
              simpleExplanation={`Status: ${claim.temporalStatus}. Recent publications score higher than outdated studies.`}
              whyItMatters="Protects against citing obsolete science that has since been corrected."
              size="xs"
            />
          </div>
          <div className="mt-1.5 font-mono text-xs sm:text-sm font-bold">
            <span
              className={
                claim.temporalStatus === 'Current'
                  ? 'text-emerald-400'
                  : claim.temporalStatus === 'Outdated'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }
            >
              {claim.temporalStatus}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Decay Factor: {claim.freshnessScore}
          </div>
        </div>

        {/* Contradiction Alert */}
        <div className="rounded-xl bg-black/30 p-3 border border-white/5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>{plainEnglishMode ? 'Dispute' : 'Contradiction'}</span>
            </div>
            <ContextHelpTooltip
              title="Contradiction Signal"
              simpleExplanation={
                claim.contradictionDetected
                  ? 'Credible literature directly disagrees with or debunks this proposition.'
                  : 'No contradictory evidence was found in the retrieved literature.'
              }
              whyItMatters="Alerts you immediately when a statement is actively contested."
              size="xs"
            />
          </div>
          <div className="mt-1.5 font-mono text-xs sm:text-sm font-bold">
            {claim.contradictionDetected ? (
              <span className="text-rose-400">Detected</span>
            ) : (
              <span className="text-emerald-400">None Flagged</span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Evidence polarities
          </div>
        </div>
      </div>

      {/* Decision Justification */}
      <div className="mt-4 rounded-xl bg-slate-900/80 p-3.5 text-xs sm:text-sm text-slate-200 border border-white/10 leading-relaxed">
        <span className="font-bold text-white">Reasoning: </span>
        {claim.decisionReason}
      </div>

      {/* Action footer */}
      <div className="mt-4 flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-white/10">
        <span className="text-xs sm:text-sm text-slate-300 italic truncate max-w-[65%]">
          Protocol: {claim.recommendedAction}
        </span>
        <Link
          href={`/claims/${claim.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1.5 font-bold text-white hover:text-blue-300 transition-colors"
        >
          <span>Inspect Details & Math</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-blue-400" />
        </Link>
      </div>
    </div>
  );
}
