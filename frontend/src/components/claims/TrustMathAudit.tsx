'use client';

import React, { useState } from 'react';
import { Claim } from '@/types';
import ContextHelpTooltip from '../common/ContextHelpTooltip';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  Calculator,
  Sparkles,
  Scale,
  Info,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface TrustMathAuditProps {
  claim: Claim;
}

export default function TrustMathAudit({ claim }: TrustMathAuditProps) {
  const { plainEnglishMode } = useAnalysisStore();
  const [viewMode, setViewMode] = useState<'plain' | 'formal'>(plainEnglishMode ? 'plain' : 'plain');
  const { mathBreakdown } = claim;

  const sqrtIndependence = Math.sqrt(mathBreakdown.independenceFactor);
  const rawSupportProduct = mathBreakdown.supportScore * sqrtIndependence * mathBreakdown.freshnessDecay;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#0d1424] p-5 sm:p-6 shadow-2xl">
      {/* Header with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                AIVIDENCE Decision Intelligence Audit
              </h4>
              <ContextHelpTooltip
                title="Mathematical Transparency"
                simpleExplanation="Unlike black-box chatbots that just guess a verdict, TRACEVIDENCE proves its work using an audited mathematical formula."
                whyItMatters="You can defend and verify this result to professors, judges, or editors."
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic calculation without hidden parameters or hallucinations
            </p>
          </div>
        </div>

        {/* Switcher: Plain English vs Formal Formula */}
        <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setViewMode('plain')}
            className={`flex items-center space-x-1 rounded-md px-3 py-1 font-semibold transition-all ${
              viewMode === 'plain'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>Plain English Walkthrough</span>
          </button>
          <button
            onClick={() => setViewMode('formal')}
            className={`flex items-center space-x-1 rounded-md px-3 py-1 font-semibold transition-all ${
              viewMode === 'formal'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="h-3 w-3" />
            <span>Formal Academic Math</span>
          </button>
        </div>
      </div>

      {/* PLAIN ENGLISH MODE VIEW */}
      {viewMode === 'plain' ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>How This Score Was Calculated (In 4 Simple Steps)</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              We know mathematical formulas can be intimidating. Here is the exact human logic behind this claim&apos;s score:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Step 1 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 font-bold">1. Base Evidence Agreement</span>
                <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  {mathBreakdown.supportScore.toFixed(2)} / 1.0
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We gathered credible studies and articles supporting the claim and weighted them by source authority.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold">2. Echo Chamber Filter (√I)</span>
                <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  &times; {sqrtIndependence.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {claim.apparentSourcesCount} websites reported this, but they trace back to only {claim.independentOriginsCount} original seed. The square root dampens echo chamber inflation!
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-indigo-400 font-bold">3. Information Freshness</span>
                <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  &times; {mathBreakdown.freshnessDecay.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Status is marked as <strong>{claim.temporalStatus}</strong>. Outdated research is gently discounted because scientific reality evolves.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-rose-400 font-bold">4. Contradiction Penalty</span>
                <span className="font-mono text-xs text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  - {mathBreakdown.contradictionPenalty.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {claim.contradictionDetected
                  ? 'Opposing studies were flagged, triggering an immediate safety penalty.'
                  : 'Zero credible studies contradicted this proposition, so no penalty was deducted.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* FORMAL ACADEMIC VIEW */
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-black/40 p-3 text-center font-mono text-xs sm:text-sm text-cyan-300 border border-cyan-500/20">
            {'T(c) = max(0, (S(c) · √I(c) · F(c)) - λ·C(c))'}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Support Factor */}
            <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">Support S(c)</div>
                <ContextHelpTooltip
                  title="Support Score S(c)"
                  simpleExplanation="Normalized polarity sum of all affirmative evidence snippets weighted by source credibility."
                  size="xs"
                />
              </div>
              <div className="mt-1 font-mono text-base font-bold text-emerald-400">
                {mathBreakdown.supportScore.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-500">Weighted polarity sum</div>
            </div>

            {/* Independence Factor */}
            <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">Independence I(c)</div>
                <ContextHelpTooltip
                  title="Independence Ratio I(c)"
                  simpleExplanation="Ratio of true origin seeds to visible citations. Under square-root dampening, repetition delivers diminishing returns."
                  size="xs"
                />
              </div>
              <div className="mt-1 font-mono text-base font-bold text-cyan-400">
                {mathBreakdown.independenceFactor.toFixed(3)}
              </div>
              <div className="text-[9px] text-slate-500">
                {claim.independentOriginsCount} / {claim.apparentSourcesCount} origins
              </div>
            </div>

            {/* Freshness Factor */}
            <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">Freshness F(c)</div>
                <ContextHelpTooltip
                  title="Temporal Freshness F(c)"
                  simpleExplanation="Exponential decay factor exp(-λΔt) reflecting knowledge obsolescence since original publication date."
                  size="xs"
                />
              </div>
              <div className="mt-1 font-mono text-base font-bold text-indigo-400">
                {mathBreakdown.freshnessDecay.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-500">Decay factor exp(-λΔt)</div>
            </div>

            {/* Contradiction Penalty */}
            <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">Penalty λ·C(c)</div>
                <ContextHelpTooltip
                  title="Contradiction Penalty λ·C(c)"
                  simpleExplanation="Strict penalty subtraction triggered when opposing or debunking evidence snippets are detected."
                  size="xs"
                />
              </div>
              <div className="mt-1 font-mono text-base font-bold text-rose-400">
                {mathBreakdown.contradictionPenalty.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-500">Dispute refutation scale</div>
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Summary Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cyan-950/40 p-4 border border-cyan-500/40">
        <div className="flex items-center space-x-2">
          <Scale className="h-5 w-5 text-cyan-400" />
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Final Mathematical Trust Verdict:
            </div>
            <div className="text-[10px] text-slate-400">
              Confidence &gt;75% &rarr; TRUST | 45-75% &rarr; VERIFY | &lt;45% &rarr; ABSTAIN
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-lg font-black text-cyan-300">
            {(mathBreakdown.finalTrustScore * 100).toFixed(1)}%
          </span>
          <span
            className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${
              claim.decision === 'TRUST'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : claim.decision === 'VERIFY'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-rose-950 text-rose-300 border border-rose-500/50'
            }`}
          >
            {claim.decision}
          </span>
        </div>
      </div>
    </div>
  );
}
