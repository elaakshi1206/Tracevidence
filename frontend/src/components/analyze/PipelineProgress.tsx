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
    <div className="w-full rounded-2xl border border-white/20 bg-gradient-to-b from-[#10182c] to-[#0d1424] p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <div className="flex items-center space-x-2.5">
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          )}
          <span className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white">
            Multi-Stage Research Pipeline Execution
          </span>
          <ContextHelpTooltip
            title="5-Stage Pipeline"
            simpleExplanation="TRACEVIDENCE executes 5 rigorous verification layers before issuing any trust verdict."
            whyItMatters="Transparent processing ensures you can see and trust every step."
            size="xs"
          />
        </div>
        <span className="font-mono text-sm sm:text-base font-extrabold text-white">
          {progress ? `${progress.progressPercent}%` : '0%'}
        </span>
      </div>

      {/* Progress Bar with Red-Blue-Green-White Gradient */}
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-800/90 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-blue-500 via-emerald-400 to-white transition-all duration-500 shadow-md"
          style={{ width: `${progress ? progress.progressPercent : 15}%` }}
        />
      </div>

      {/* Stage Nodes */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={st.id}
              className={`flex flex-col rounded-xl p-3.5 transition-all ${
                isCurrent
                  ? 'border border-blue-400 bg-blue-950/50 shadow-lg shadow-blue-500/20'
                  : isDone
                  ? 'border border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border border-white/5 bg-slate-900/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : isCurrent
                      ? 'bg-blue-500/30 text-white border border-blue-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-blue-300 animate-pulse' : 'text-slate-400'}`} />
              </div>
              <div className="mt-2.5 text-xs sm:text-sm font-bold text-white leading-tight">{st.name}</div>
              <div className="text-xs text-slate-300 mt-0.5">{st.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Current Step Detail */}
      {progress && (
        <div className="mt-4 rounded-xl bg-slate-900/90 px-4 py-2.5 text-xs sm:text-sm font-mono text-white border border-white/10 shadow-sm">
          <span className="text-blue-400 font-bold">STATUS:</span> {progress.detail}
        </div>
      )}
    </div>
  );
}
