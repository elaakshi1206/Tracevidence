import React from 'react';
import { PipelineProgressUpdate } from '@/lib/engine/pipelineOrchestrator';
import ContextHelpTooltip from '../common/ContextHelpTooltip';
import { CheckCircle2, Loader2, GitBranch, Search, Network, ShieldCheck, Scale, HelpCircle } from 'lucide-react';

interface PipelineProgressProps {
  progress: PipelineProgressUpdate | null;
  isAnalyzing: boolean;
}

const STAGES = [
  {
    id: 'claim_extraction',
    name: 'Claim Extraction',
    icon: Scale,
    desc: 'Atomic decomposition',
    tooltip: 'Splits complex text into individual verifiable facts with identified subject entities.',
  },
  {
    id: 'evidence_retrieval',
    name: 'Evidence Retrieval',
    icon: Search,
    desc: 'Hybrid search & tiering',
    tooltip: 'Queries academic databases, regulatory archives, and wire agencies for primary records.',
  },
  {
    id: 'provenance_clustering',
    name: 'TRACE-X Provenance',
    icon: GitBranch,
    desc: 'Origin & independence',
    tooltip: 'Traces citation lineage and collapses syndicated reprints down to the root origin seed.',
  },
  {
    id: 'signal_verification',
    name: 'Signal Verification',
    icon: Network,
    desc: 'Freshness & contradiction',
    tooltip: 'Checks temporal publication dates and flags opposing research polarities.',
  },
  {
    id: 'trust_decision',
    name: 'AIVIDENCE Trust Engine',
    icon: ShieldCheck,
    desc: 'Selective prediction',
    tooltip: 'Computes calibrated trust scores and assigns TRUST, VERIFY, or ABSTAIN.',
  },
];

export default function PipelineProgress({ progress, isAnalyzing }: PipelineProgressProps) {
  if (!isAnalyzing && !progress) return null;

  const currentIdx = progress ? progress.stageIndex - 1 : 0;

  return (
    <div className="w-full rounded-xl border border-cyan-500/30 bg-[#0d1424]/90 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
            Multi-Stage Research Pipeline Execution
          </span>
          <ContextHelpTooltip
            title="5-Stage Pipeline"
            simpleExplanation="TRACEVIDENCE executes 5 rigorous verification layers before issuing any trust verdict."
            whyItMatters="Transparent processing ensures you can see and trust every step."
            size="xs"
          />
        </div>
        <span className="font-mono text-xs font-semibold text-slate-400">
          {progress ? `${progress.progressPercent}%` : '0%'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${progress ? progress.progressPercent : 15}%` }}
        />
      </div>

      {/* Stage Nodes */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={st.id}
              className={`flex flex-col rounded-lg p-2.5 transition-all ${
                isCurrent
                  ? 'border border-cyan-400/50 bg-cyan-950/40 shadow-sm shadow-cyan-500/20'
                  : isDone
                  ? 'border border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                  : 'border border-white/5 bg-slate-900/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <Icon className={`h-3.5 w-3.5 ${isCurrent ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              </div>
              <div className="mt-2 text-[11px] font-bold text-white leading-tight">{st.name}</div>
              <div className="text-[10px] text-slate-400">{st.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Current Step Detail */}
      {progress && (
        <div className="mt-3 rounded-lg bg-slate-900/80 px-3 py-2 text-xs font-mono text-cyan-300/90 border border-cyan-500/20">
          <span className="text-slate-400">STATUS:</span> {progress.detail}
        </div>
      )}
    </div>
  );
}
