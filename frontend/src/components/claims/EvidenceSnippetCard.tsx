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
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      border: 'border-emerald-200',
    },
    PARTIAL: {
      label: 'PARTIAL / CONDITIONAL',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      border: 'border-amber-200',
    },
    CONTRADICT: {
      label: 'CONTRADICTS CLAIM',
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: XCircle,
      border: 'border-rose-200',
    },
    IRRELEVANT: {
      label: 'NOT DIRECTLY RELEVANT',
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: AlertTriangle,
      border: 'border-slate-200',
    },
  };

  const config = polarityConfigs[evidence.polarity] || polarityConfigs.PARTIAL;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 bg-white ${config.border} shadow-xs transition-all hover:border-slate-300`}>
      {/* Header: Polarity & Source Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold border ${config.bg}`}>
            <Icon className="h-3 w-3" />
            <span>{config.label}</span>
          </span>

          {source && <SourceBadge tier={source.tier} size="sm" />}
        </div>

        <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-500">
          <span>Relevance:</span>
          <span className="font-bold text-blue-700">{(evidence.relevanceScore * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Direct Evidence Quotation */}
      <div className="mt-3 relative pl-4 border-l-2 border-blue-400">
        <Quote className="absolute -left-2.5 -top-1 h-3.5 w-3.5 text-blue-600 bg-white" />
        <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
          &ldquo;{evidence.quote}&rdquo;
        </p>
      </div>

      {/* Verification Reasoning */}
      <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200">
        <span className="font-semibold text-slate-900">Algorithmic Alignment: </span>
        {evidence.verificationReasoning}
      </div>

      {/* Source Citation Footer */}
      {source && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 truncate max-w-[80%]">
            <Compass className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{source.publisher}</span>
            <span>·</span>
            <span className="truncate">{source.title}</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span>{source.publishedDate}</span>
            {source.doi && (
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700 border border-blue-200 font-semibold">
                {source.doi}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
