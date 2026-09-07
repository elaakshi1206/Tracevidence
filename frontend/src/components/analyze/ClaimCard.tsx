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
    TRUST: isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-emerald-500/30 hover:border-emerald-500/60',
    VERIFY: isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-amber-500/30 hover:border-amber-500/60',
    ABSTAIN: isSelected ? 'border-rose-500 shadow-lg shadow-rose-500/10' : 'border-rose-500/30 hover:border-rose-500/60',
  };

  const bgColors = {
    TRUST: 'bg-gradient-to-br from-emerald-950/20 via-[#121826] to-[#0d111c]',
    VERIFY: 'bg-gradient-to-br from-amber-950/20 via-[#121826] to-[#0d111c]',
    ABSTAIN: 'bg-gradient-to-br from-rose-950/20 via-[#121826] to-[#0d111c]',
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-xl border p-5 transition-all duration-200 ${borderColors[claim.decision]} ${bgColors[claim.decision]}`}
    >
      {/* Top Header: Decision & Trust Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DecisionBadge decision={claim.decision} size="sm" />
          <span className="font-mono text-[11px] font-semibold text-slate-400">
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

        <div className="flex items-center space-x-1.5 rounded-md bg-slate-900/80 px-2.5 py-1 border border-white/5 font-mono text-xs">
          <span className="text-slate-400">
            {plainEnglishMode ? 'Trust Level:' : 'Trust Score:'}
          </span>
          <span
            className={`font-bold ${
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
      <div className="mt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
          Target: {claim.targetEntity}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-100 leading-relaxed">
          &ldquo;{claim.text}&rdquo;
        </p>
      </div>

      {/* Research Signals Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 border-t border-white/5 pt-3">
        {/* Source Independence Factor */}
        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <GitFork className="h-3 w-3 text-cyan-400" />
              <span>{plainEnglishMode ? 'Originality' : 'Independence'}</span>
            </div>
            <ContextHelpTooltip
              title="Origin Independence"
              simpleExplanation={`${claim.apparentSourcesCount} different websites reported this, but they trace back to only ${claim.independentOriginsCount} primary origin seed.`}
              whyItMatters="Prevents you from being tricked when 10 news sites copy 1 tweet."
              size="xs"
            />
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-white">
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
          <div className="text-[9px] text-slate-500">
            Ratio: {(claim.independenceRatio * 100).toFixed(0)}%
          </div>
        </div>

        {/* Temporal Freshness */}
        <div className="rounded-lg bg-black/20 p-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Clock className="h-3 w-3 text-indigo-400" />
              <span>{plainEnglishMode ? 'Age' : 'Freshness'}</span>
            </div>
            <ContextHelpTooltip
              title="Temporal Freshness"
              simpleExplanation={`Status: ${claim.temporalStatus}. Recent publications score higher than outdated studies.`}
              whyItMatters="Protects against citing obsolete science that has since been corrected."
              size="xs"
            />
          </div>
          <div className="mt-1 font-mono text-xs font-bold">
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
          <div className="text-[9px] text-slate-500">
            Decay Factor: {claim.freshnessScore}
          </div>
        </div>

        {/* Contradiction Alert */}
        <div className="rounded-lg bg-black/20 p-2 border border-white/5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
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
          <div className="mt-1 font-mono text-xs font-bold">
            {claim.contradictionDetected ? (
              <span className="text-rose-400">Detected</span>
            ) : (
              <span className="text-emerald-400">None Flagged</span>
            )}
          </div>
          <div className="text-[9px] text-slate-500">
            Evidence polarities
          </div>
        </div>
      </div>

      {/* Decision Justification */}
      <div className="mt-3 rounded-lg bg-slate-900/60 p-2.5 text-xs text-slate-300 border border-white/5">
        <span className="font-semibold text-white">Reasoning: </span>
        {claim.decisionReason}
      </div>

      {/* Action footer */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2">
        <span className="text-[11px] text-slate-400 italic truncate max-w-[70%]">
          Protocol: {claim.recommendedAction}
        </span>
        <Link
          href={`/claims/${claim.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Inspect Details & Math</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
