'use client';

import React from 'react';
import { ProvenanceChain, Source } from '@/types';
import SourceBadge from '../common/SourceBadge';
import { GitBranch, Clock, ArrowDown, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface ProvenanceTreeProps {
  provenanceChain?: ProvenanceChain;
  sources: Source[];
}

export default function ProvenanceTree({ provenanceChain, sources }: ProvenanceTreeProps) {
  if (!provenanceChain || provenanceChain.steps.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
        No provenance trace detected for this claim.
      </div>
    );
  }

  const sourceMap = new Map<string, Source>(sources.map((s) => [s.id, s]));
  const originSource = sourceMap.get(provenanceChain.originSourceId);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1424] p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-mono tracking-tight">
              TRACE-X Provenance Lineage Tree
            </h4>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Inferring origin propagation, citation distance, and syndication echoes
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`rounded px-2 py-0.5 font-mono text-xs font-bold border ${
              provenanceChain.level === 'Directly Traceable'
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                : provenanceChain.level === 'Partially Traceable'
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                : 'bg-rose-950/70 text-rose-300 border-rose-500/40'
            }`}
          >
            {provenanceChain.level}
          </span>
        </div>
      </div>

      {/* Circularity Warning Banner */}
      {provenanceChain.circularityDetected && (
        <div className="mt-4 flex items-start space-x-2.5 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200">
          <AlertOctagon className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">Circular Syndication Detected</div>
            <div className="mt-0.5 text-[11px] text-amber-200/90 leading-relaxed">
              {provenanceChain.circularityDetails ||
                'Multiple media publications reproduce unverified numbers derived from a single working paper, creating an artificial illusion of scientific consensus.'}
            </div>
          </div>
        </div>
      )}

      {/* Hierarchical Node Tree */}
      <div className="mt-6 relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-slate-700">
        {provenanceChain.steps.map((step, index) => {
          const src = sourceMap.get(step.sourceId);
          if (!src) return null;

          const isOrigin = step.distanceFromOrigin === 0 || src.isPrimaryOrigin;

          return (
            <div key={step.sourceId} className="relative group">
              {/* Timeline Marker */}
              <div
                className={`absolute -left-[30px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isOrigin
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-sm shadow-cyan-400/50'
                    : 'border-slate-600 bg-slate-900 text-slate-300'
                }`}
              >
                {step.distanceFromOrigin}
              </div>

              {/* Node Card */}
              <div
                className={`rounded-lg border p-4 transition-all ${
                  isOrigin
                    ? 'border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-900/60 shadow-lg shadow-cyan-500/5'
                    : 'border-white/5 bg-slate-900/50 hover:border-white/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isOrigin
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.role}
                    </span>
                    <SourceBadge tier={src.tier} size="sm" />
                  </div>

                  <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-400">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{step.timestamp}</span>
                  </div>
                </div>

                <h5 className="mt-2 text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {src.title}
                </h5>

                <div className="mt-1 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{src.publisher}</span>
                  {src.authorOrOrg && <span> · {src.authorOrOrg}</span>}
                  {src.doi && (
                    <span className="font-mono text-cyan-400 ml-2">DOI: {src.doi}</span>
                  )}
                </div>

                <p className="mt-2 text-xs italic text-slate-300/90 rounded bg-black/30 p-2 border border-white/5">
                  &ldquo;{src.snippet}&rdquo;
                </p>

                {src.verbatimOverlapRatio && src.verbatimOverlapRatio > 0 && (
                  <div className="mt-2 flex items-center space-x-2 text-[11px] font-mono text-amber-300">
                    <span>Verbatim overlap with root origin:</span>
                    <span className="font-bold">{(src.verbatimOverlapRatio * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
