'use client';

import React from 'react';
import { Claim } from '@/types';
import { Calculator, Sparkles, Scale, Info } from 'lucide-react';

interface TrustMathAuditProps {
  claim: Claim;
}

export default function TrustMathAudit({ claim }: TrustMathAuditProps) {
  const { mathBreakdown } = claim;

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-[#0d1424] p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            AIVIDENCE Mathematical Decision Audit
          </h4>
        </div>
        <span className="font-mono text-xs text-cyan-400">Formal Formulation</span>
      </div>

      {/* Formula Display */}
      <div className="mt-3 rounded-lg bg-black/40 p-3 text-center font-mono text-xs sm:text-sm text-cyan-300 border border-cyan-500/20">
        {'T(c) = max(0, (S(c) · √I(c) · F(c)) - λ·C(c))'}
      </div>

      {/* Factor Breakdown Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Support Factor */}
        <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
          <div className="text-[10px] font-mono text-slate-400">Support S(c)</div>
          <div className="mt-1 font-mono text-base font-bold text-emerald-400">
            {mathBreakdown.supportScore.toFixed(2)}
          </div>
          <div className="text-[9px] text-slate-500">Weighted polarity sum</div>
        </div>

        {/* Independence Factor */}
        <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
          <div className="text-[10px] font-mono text-slate-400">Independence I(c)</div>
          <div className="mt-1 font-mono text-base font-bold text-cyan-400">
            {mathBreakdown.independenceFactor.toFixed(3)}
          </div>
          <div className="text-[9px] text-slate-500">
            {claim.independentOriginsCount} / {claim.apparentSourcesCount} origins
          </div>
        </div>

        {/* Freshness Factor */}
        <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
          <div className="text-[10px] font-mono text-slate-400">Freshness F(c)</div>
          <div className="mt-1 font-mono text-base font-bold text-indigo-400">
            {mathBreakdown.freshnessDecay.toFixed(2)}
          </div>
          <div className="text-[9px] text-slate-500">Exponential decay exp(-λΔt)</div>
        </div>

        {/* Contradiction Penalty */}
        <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5">
          <div className="text-[10px] font-mono text-slate-400">Penalty λ·C(c)</div>
          <div className="mt-1 font-mono text-base font-bold text-rose-400">
            {mathBreakdown.contradictionPenalty.toFixed(2)}
          </div>
          <div className="text-[9px] text-slate-500">Dispute & refutation scale</div>
        </div>
      </div>

      {/* Synthesis Summary */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-cyan-950/30 p-3 border border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <Scale className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Calculated Trust Score:
          </span>
        </div>
        <span className="font-mono text-base font-black text-cyan-300">
          {(mathBreakdown.finalTrustScore * 100).toFixed(1)}% &rarr; Decision: {claim.decision}
        </span>
      </div>
    </div>
  );
}
