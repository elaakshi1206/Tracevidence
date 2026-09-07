import React from 'react';
import { PipelineProgressUpdate } from '@/lib/engine/pipelineOrchestrator';
import ContextHelpTooltip from '../common/ContextHelpTooltip';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { CheckCircle2, Loader2, GitBranch, Search, Network, ShieldCheck, Scale, HelpCircle } from 'lucide-react';

interface PipelineProgressProps {
  progress: PipelineProgressUpdate | null;
  isAnalyzing: boolean;
}

export default function PipelineProgress({ progress, isAnalyzing }: PipelineProgressProps) {
  const { plainEnglishMode } = useAnalysisStore();

  if (!isAnalyzing && !progress) return null;

  const STAGES = [
    {
      id: 'claim_extraction',
      name: plainEnglishMode ? '1. Split into Facts' : '1. Claim Extraction',
      icon: Scale,
      desc: plainEnglishMode ? 'Separates statements' : 'Atomic decomposition',
      tooltip: 'Splits complex text into individual verifiable facts with identified subject entities.',
    },
    {
      id: 'evidence_retrieval',
      name: plainEnglishMode ? '2. Search Sources' : '2. Evidence Retrieval',
      icon: Search,
      desc: plainEnglishMode ? 'Queries papers & news' : 'Hybrid search & tiering',
      tooltip: 'Queries academic databases, regulatory archives, and wire agencies for primary records.',
    },
    {
      id: 'provenance_clustering',
      name: plainEnglishMode ? '3. Trace Origins' : '3. TRACE-X Provenance',
      icon: GitBranch,
      desc: plainEnglishMode ? 'Collapses copycats' : 'Origin & independence',
      tooltip: 'Traces citation lineage and collapses syndicated reprints down to the root origin seed.',
    },
    {
      id: 'signal_verification',
      name: plainEnglishMode ? '4. Check Disputes' : '4. Signal Verification',
      icon: Network,
      desc: plainEnglishMode ? 'Age & contradictions' : 'Freshness & conflict',
      tooltip: 'Checks publication dates and flags opposing research polarities or debunking studies.',
    },
    {
      id: 'trust_decision',
      name: plainEnglishMode ? '5. Compute Trust' : '5. Trust Engine',
      icon: ShieldCheck,
      desc: plainEnglishMode ? 'TRUST / VERIFY / ABSTAIN' : 'Selective prediction',
      tooltip: 'Computes calibrated trust scores and assigns TRUST, VERIFY, or ABSTAIN.',
    },
  ];

  const currentIdx = progress ? progress.stageIndex - 1 : 0;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          )}
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
            {plainEnglishMode ? 'Live Verification Progress (5 Steps)' : 'Multi-Stage Research Pipeline'}
          </span>
          <ContextHelpTooltip
            title="5-Stage Pipeline"
            simpleExplanation="TRACEVIDENCE executes 5 rigorous verification layers before issuing any trust verdict."
            size="xs"
          />
        </div>
        <span className="font-mono text-xs sm:text-sm font-bold text-slate-800">
          {progress ? `${progress.progressPercent}%` : '0%'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-blue-600 via-emerald-500 to-sky-400 transition-all duration-500"
          style={{ width: `${progress ? progress.progressPercent : 15}%` }}
        />
      </div>

      {/* Stage Nodes */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={st.id}
              className={`flex flex-col rounded-xl p-3 transition-all ${
                isCurrent
                  ? 'border border-blue-300 bg-blue-50/90 shadow-xs'
                  : isDone
                  ? 'border border-emerald-200 bg-emerald-50/70 text-emerald-800'
                  : 'border border-slate-200/70 bg-slate-50/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
              </div>
              <div className="mt-2 text-xs font-bold text-slate-900 leading-tight">{st.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Current Step Detail */}
      {progress && (
        <div className="mt-3.5 space-y-2">
          <div className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800 border border-slate-200">
            <span className="text-blue-700 font-bold">STATUS:</span> {progress.detail}
          </div>
          {progress.uncertaintyEstimate && (
            <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>Intermediate Epistemic Track:</strong> {progress.uncertaintyEstimate}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
