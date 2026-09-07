'use client';

import React from 'react';
import { Evidence, Source } from '@/types';
import SourceBadge from '../common/SourceBadge';
import { CheckCircle2, AlertTriangle, XCircle, Quote, ExternalLink, Compass } from 'lucide-react';

interface EvidenceSnippetCardProps {
  evidence: Evidence;
  source?: Source;
}

export default function EvidenceSnippetCard({ evidence, source }: EvidenceSnippetCardProps) {
  const polarityConfigs = {
    SUPPORT: {
      label: 'SUPPORTS CLAIM',
      bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
    },
    PARTIAL: {
      label: 'PARTIAL / CONDITIONAL',
      bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      border: 'border-amber-500/30',
    },
    CONTRADICT: {
      label: 'CONTRADICTS CLAIM',
      bg: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
      icon: XCircle,
      border: 'border-rose-500/30',
    },
  };

  const config = polarityConfigs[evidence.polarity];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 bg-[#0f1523] ${config.border} shadow-lg transition-all hover:border-white/20`}>
      {/* Header: Polarity & Source Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold border ${config.bg}`}>
            <Icon className="h-3 w-3" />
            <span>{config.label}</span>
          </span>

          {source && <SourceBadge tier={source.tier} size="sm" />}
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
          <span>Relevance:</span>
          <span className="font-bold text-cyan-400">{(evidence.relevanceScore * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Direct Evidence Quotation */}
      <div className="mt-3 relative pl-4 border-l-2 border-cyan-500/40">
        <Quote className="absolute -left-2.5 -top-1 h-3.5 w-3.5 text-cyan-400 bg-[#0f1523]" />
        <p className="text-sm font-serif italic text-slate-200 leading-relaxed">
          &ldquo;{evidence.quote}&rdquo;
        </p>
      </div>

      {/* Verification Reasoning */}
      <div className="mt-3 rounded-lg bg-black/30 p-2.5 text-xs text-slate-300 border border-white/5">
        <span className="font-semibold text-white">Algorithmic Alignment: </span>
        {evidence.verificationReasoning}
      </div>

      {/* Source Citation Footer */}
      {source && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 truncate max-w-[80%]">
            <Compass className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="font-semibold text-slate-300 truncate">{source.publisher}</span>
            <span>·</span>
            <span className="truncate">{source.title}</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span>{source.publishedDate}</span>
            {source.doi && (
              <span className="rounded bg-cyan-950/60 px-1.5 py-0.5 text-cyan-400 border border-cyan-800/40">
                {source.doi}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
