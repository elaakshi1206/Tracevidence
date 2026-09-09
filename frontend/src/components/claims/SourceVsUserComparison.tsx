'use client';

import React, { useState } from 'react';
import { Claim, Evidence, Source } from '@/types';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  ArrowRight,
  GitCompare,
  Building2,
  Quote,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ExternalLink,
  Info,
} from 'lucide-react';
import ContextHelpTooltip from '../common/ContextHelpTooltip';

interface SourceVsUserComparisonProps {
  claim: Claim;
  evidences: Evidence[];
  sources: Source[];
}

function MatchMeter({ score, polarity }: { score: number; polarity: string }) {
  const pct = Math.round(score * 100);

  const isContradict = polarity === 'CONTRADICT';
  const isPartial = polarity === 'PARTIAL';

  // Color theme based on polarity
  const barColor = isContradict
    ? 'bg-rose-500'
    : isPartial
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  const bgColor = isContradict
    ? 'bg-rose-100'
    : isPartial
    ? 'bg-amber-100'
    : 'bg-emerald-100';

  const textColor = isContradict
    ? 'text-rose-700'
    : isPartial
    ? 'text-amber-700'
    : 'text-emerald-700';

  const label = isContradict
    ? 'Conflict Match'
    : isPartial
    ? 'Partial Match'
    : 'Statement Match';

  return (
    <div className="flex items-center gap-3 w-full">
      <span className={`text-[11px] font-mono font-bold uppercase tracking-wide whitespace-nowrap ${textColor}`}>
        {label}
      </span>
      <div className={`flex-1 h-2 rounded-full ${bgColor} overflow-hidden`}>
        <div
          className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-black font-mono ${textColor} min-w-[3.2rem] text-right`}>
        {pct}%
      </span>
    </div>
  );
}

export default function SourceVsUserComparison({
  claim,
  evidences,
  sources,
}: SourceVsUserComparisonProps) {
  const { plainEnglishMode } = useAnalysisStore();
  const [filterType, setFilterType] = useState<'ALL' | 'SUPPORT' | 'CONTRADICT' | 'PARTIAL'>('ALL');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  // Build comparison pairs
  const comparisons = evidences
    .map((ev) => {
      const src = sourceMap.get(ev.sourceId);
      if (!src) return null;

      const polarity = ev.polarity;
      const isContradiction = polarity === 'CONTRADICT';
      const isPartial = polarity === 'PARTIAL';

      // --- Match Score Calculation ---
      // For SUPPORT: how closely does the source back the claim → use relevanceScore directly
      // For CONTRADICT: score represents "how strongly it contradicts" (inverted for visual match)
      // For PARTIAL: midpoint of relevance
      let matchScore: number;
      let matchNote: string;

      if (isContradiction) {
        // relevanceScore tells how strongly it contradicts — show as conflict %
        matchScore = ev.relevanceScore;
        matchNote = `This source contradicts the user claim with ${Math.round(ev.relevanceScore * 100)}% relevance to the same topic.`;
      } else if (isPartial) {
        matchScore = ev.relevanceScore * 0.6; // partial support, discounted
        matchNote = `This source partially aligns — it agrees on ${Math.round(matchScore * 100)}% of the claim's specifics.`;
      } else {
        // SUPPORT — relevance shows how closely it matches
        matchScore = ev.relevanceScore;
        if (src.verbatimOverlapRatio) {
          matchNote = `Verbatim text overlap: ${Math.round(src.verbatimOverlapRatio * 100)}%. Topic relevance: ${Math.round(ev.relevanceScore * 100)}%.`;
        } else {
          matchNote = `Statement alignment: ${Math.round(matchScore * 100)}% — the source corroborates this specific assertion.`;
        }
      }

      // Supported Status
      let supportedStatus: 'Supports' | 'Partially Supports' | 'Contradicts' = 'Supports';
      let statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      let StatusIcon = CheckCircle2;

      if (isContradiction) {
        supportedStatus = 'Contradicts';
        statusColor = 'bg-rose-100 text-rose-800 border-rose-300';
        StatusIcon = XCircle;
      } else if (isPartial || ev.relevanceScore < 0.7 || claim.independenceRatio < 0.35) {
        supportedStatus = 'Partially Supports';
        statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
        StatusIcon = AlertTriangle;
      }

      // What the organization actually stated (their own voice)
      // Primary: use the evidence quote (direct excerpt from the source)
      // Fallback: source snippet
      const orgStatement = ev.quote && ev.quote.trim()
        ? ev.quote.trim()
        : src.snippet;

      // Organization identity
      const orgName = src.authorOrOrg || src.publisher;
      const orgYear = src.publishedDate ? src.publishedDate.slice(0, 4) : '';
      const orgDisplay = orgYear ? `${orgName} (${orgYear})` : orgName;
      const orgTier = src.tier;

      // Difference explanation
      let difference = '';
      if (isContradiction) {
        if (claim.numericalConflict) {
          difference = `The user claimed ${claim.numericalConflict.claimedValue}. ${src.publisher} measured ${claim.numericalConflict.rebuttalValue}. ${claim.numericalConflict.deltaNote}`;
        } else {
          difference = `The user stated: "${claim.text.slice(0, 100)}…" — but ${src.publisher} found the opposite: "${orgStatement.slice(0, 120)}…" These are empirically incompatible.`;
        }
      } else if (claim.temporalStatus === 'Outdated' && polarity === 'SUPPORT') {
        difference = `The user claim repeats an older figure from ${orgYear || 'an earlier report'} which was later superseded by updated scientific measurements. The source agrees with the claim, but both are now outdated.`;
      } else if (claim.collapseEvidence && src.originId) {
        difference = `This source does not perform new independent testing — it re-states the original finding from ${claim.collapseEvidence.commonOrigin || 'a primary source'} with ${src.verbatimOverlapRatio ? Math.round(src.verbatimOverlapRatio * 100) + '% text overlap' : 'high similarity'}.`;
      } else {
        difference = `The source directly validates the user's assertion with no discrepancy. Primary data points and conclusions match.`;
      }

      // Final judgment
      let judgment = '';
      let JudgmentIcon = isContradiction ? TrendingDown : isPartial ? Minus : TrendingUp;

      if (isContradiction) {
        judgment = `Source is closer to truth: Backed by ${orgTier.toLowerCase()} research from ${src.publisher}, it refutes the user statement with stronger empirical evidence.`;
      } else if (claim.temporalStatus === 'Outdated' && polarity === 'SUPPORT') {
        judgment = `Neither fully current: The user claim relied on this source, but newer studies supersede this historical estimate.`;
        JudgmentIcon = Minus;
      } else if (orgTier === 'Academic' || orgTier === 'Government' || orgTier === 'Official') {
        judgment = `Both well-supported: The user statement faithfully represents verified findings from ${src.publisher}.`;
      } else {
        judgment = `Partially supported: The source agrees with the user but relies on secondary journalistic reporting, not primary research.`;
        JudgmentIcon = Minus;
      }

      return {
        evidenceId: ev.id,
        polarity,
        source: src,
        orgName,
        orgDisplay,
        orgStatement,
        userClaim: claim.text,
        matchScore,
        matchNote,
        difference,
        supportedStatus,
        statusColor,
        StatusIcon,
        judgment,
        JudgmentIcon,
        verificationReasoning: ev.verificationReasoning,
      };
    })
    .filter(Boolean);

  const filtered = comparisons.filter((c) => {
    if (!c) return false;
    if (filterType === 'ALL') return true;
    return c.polarity === filterType;
  });

  const supportCount = comparisons.filter((c) => c?.polarity === 'SUPPORT').length;
  const contradictCount = comparisons.filter((c) => c?.polarity === 'CONTRADICT').length;
  const partialCount = comparisons.filter((c) => c?.polarity === 'PARTIAL').length;

  return (
    <div className="rounded-2xl border-2 border-[#0f766e]/30 bg-white shadow-sm space-y-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 via-white to-slate-50 px-6 py-5 border-b border-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <GitCompare className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-700 block">
                  Provenance Verification Audit
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  What Each Organisation Actually Claimed
                </h3>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
              {plainEnglishMode
                ? 'Below you can see the exact sentence each organisation or research group originally published — and how closely it matches what you submitted. A match score shows how aligned or opposed they are.'
                : 'Direct semantic comparison between the user-asserted proposition and verbatim primary literature excerpts, with a computed statement-alignment score per source.'}
            </p>
          </div>

          {/* Summary Counts */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-center min-w-[56px]">
              <div className="text-lg font-black text-emerald-700 font-mono leading-none">{supportCount}</div>
              <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Support</div>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-center min-w-[56px]">
              <div className="text-lg font-black text-amber-700 font-mono leading-none">{partialCount}</div>
              <div className="text-[10px] font-mono font-bold text-amber-600 uppercase">Partial</div>
            </div>
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-center min-w-[56px]">
              <div className="text-lg font-black text-rose-700 font-mono leading-none">{contradictCount}</div>
              <div className="text-[10px] font-mono font-bold text-rose-600 uppercase">Contradict</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex items-center space-x-1.5 rounded-xl bg-white border border-slate-200 p-1 w-fit shadow-2xs">
          {(['ALL', 'SUPPORT', 'PARTIAL', 'CONTRADICT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                filterType === t
                  ? t === 'ALL'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : t === 'SUPPORT'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : t === 'PARTIAL'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t === 'ALL' ? 'All Sources' : t === 'SUPPORT' ? '✓ Supporting' : t === 'PARTIAL' ? '~ Partial' : '✕ Contradicting'}
            </button>
          ))}
        </div>
      </div>

      {/* User Claim Reference Bar */}
      <div className="bg-blue-50/70 border-b border-blue-200 px-6 py-3 flex items-start gap-3">
        <BookOpen className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
            Your Submitted Claim (Reference)
          </span>
          <p className="text-xs sm:text-sm font-medium text-blue-900 leading-relaxed mt-0.5">
            &ldquo;{claim.text}&rdquo;
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="divide-y divide-slate-100">
        {filtered.map((item, idx) => {
          if (!item) return null;
          const { StatusIcon, JudgmentIcon } = item;
          const isExpanded = expandedIdx === idx;

          return (
            <div
              key={item.evidenceId || idx}
              className={`px-6 py-5 transition-colors ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'}`}
            >
              {/* Card Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-black shrink-0 mt-0.5 ${
                    item.polarity === 'CONTRADICT'
                      ? 'bg-rose-100 text-rose-700'
                      : item.polarity === 'PARTIAL'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="font-bold text-sm text-slate-900">{item.orgDisplay}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                        item.source.tier === 'Academic' || item.source.tier === 'Government'
                          ? 'bg-blue-100 text-blue-800'
                          : item.source.tier === 'Reputable Media'
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.source.tier}
                      </span>
                      {item.source.isPrimaryOrigin && (
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold bg-teal-100 text-teal-800">
                          Primary Origin
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500 font-mono italic truncate max-w-sm">
                      &quot;{item.source.title}&quot;
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-mono border ${item.statusColor}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span>{item.supportedStatus}</span>
                  </span>
                </div>
              </div>

              {/* ★ MATCH SCORE BAR — the key new feature */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
                    Statement Match Score
                  </span>
                  <ContextHelpTooltip
                    title="Match Score"
                    simpleExplanation="How closely this source's original statement aligns with your submitted claim — as a percentage."
                    whyItMatters="A high match from a contradicting source means the source is directly on-topic and thus a strong refutation."
                    size="xs"
                  />
                </div>
                <MatchMeter score={item.matchScore} polarity={item.polarity} />
                <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed font-mono">
                  {item.matchNote}
                </p>
              </div>

              {/* Side-by-Side: What They Said vs What You Said */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* User's Claim */}
                <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Your Submitted Claim
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Quote className="h-3.5 w-3.5 text-blue-300 shrink-0 mt-1" />
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
                      {item.userClaim}
                    </p>
                  </div>
                </div>

                {/* What the Org Said */}
                <div className={`rounded-xl border p-4 shadow-2xs ${
                  item.polarity === 'CONTRADICT'
                    ? 'bg-rose-50/50 border-rose-200'
                    : item.polarity === 'PARTIAL'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-teal-50/40 border-teal-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${
                        item.polarity === 'CONTRADICT' ? 'bg-rose-400' : item.polarity === 'PARTIAL' ? 'bg-amber-400' : 'bg-teal-400'
                      }`} />
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        item.polarity === 'CONTRADICT' ? 'text-rose-600' : item.polarity === 'PARTIAL' ? 'text-amber-600' : 'text-teal-700'
                      }`}>
                        What {item.orgName} Originally Stated
                      </span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Quote className={`h-3.5 w-3.5 shrink-0 mt-1 ${
                      item.polarity === 'CONTRADICT' ? 'text-rose-300' : item.polarity === 'PARTIAL' ? 'text-amber-300' : 'text-teal-300'
                    }`} />
                    <p className={`text-xs sm:text-sm font-semibold leading-relaxed italic ${
                      item.polarity === 'CONTRADICT' ? 'text-rose-900' : item.polarity === 'PARTIAL' ? 'text-amber-900' : 'text-teal-900'
                    }`}>
                      {item.orgStatement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Difference Note */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Key Difference Between Claims
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{item.difference}</p>
              </div>

              {/* Final Judgment */}
              <div className={`rounded-lg border p-3 flex items-start gap-2 ${
                item.supportedStatus === 'Supports'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : item.supportedStatus === 'Contradicts'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <JudgmentIcon className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-0.5 opacity-70">
                    Verdict — Which Statement is Closer to Truth?
                  </span>
                  <p className="text-xs font-medium leading-relaxed">{item.judgment}</p>
                </div>
              </div>

              {/* Expandable: Verification Reasoning */}
              {item.verificationReasoning && (
                <div className="mt-2">
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="text-[11px] font-mono font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? '▲ Hide' : '▼ Show'} TRACEVIDENCE Verification Reasoning</span>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 rounded-lg bg-slate-100 border border-slate-200 p-3 text-[11px] font-mono text-slate-700 leading-relaxed">
                      {item.verificationReasoning}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400 font-mono">
            No sources found under this filter.
          </div>
        )}
      </div>
    </div>
  );
}
