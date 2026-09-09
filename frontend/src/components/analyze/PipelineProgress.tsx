import React from 'react';
import { PipelineProgressUpdate } from '@/lib/engine/pipelineOrchestrator';
import ContextHelpTooltip from '../common/ContextHelpTooltip';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  CheckCircle2,
  Loader2,
  GitBranch,
  Search,
  Clock,
  ShieldCheck,
  Scale,
} from 'lucide-react';

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
      name: plainEnglishMode ? '1. Break into Facts' : '1. Claim Extraction',
      icon: Scale,
      desc: plainEnglishMode ? 'Splits your text into individual statements' : 'Atomic decomposition of propositions',
      conclusion: plainEnglishMode
        ? '✓ Each statement is now isolated so it can be checked separately.'
        : '✓ Atomic claims extracted and queued for independent verification.',
    },
    {
      id: 'evidence_retrieval',
      name: plainEnglishMode ? '2. Find Sources' : '2. Evidence Retrieval',
      icon: Search,
      desc: plainEnglishMode ? 'Searches academic papers and news' : 'Hybrid multi-backend knowledge retrieval',
      conclusion: plainEnglishMode
        ? '✓ Sources found across journals, government sites, and news — being ranked by reliability.'
        : '✓ Sources retrieved and tier-classified (Academic · Government · News).',
    },
    {
      id: 'provenance_clustering',
      name: plainEnglishMode ? '3. Trace Origins' : '3. TRACE-X Provenance',
      icon: GitBranch,
      desc: plainEnglishMode ? 'Finds the original root source' : 'Origin clustering & independence scoring',
      conclusion: plainEnglishMode
        ? '✓ Checked whether all sources lead back to one original claim (echo chamber) or are truly independent.'
        : '✓ Source independence matrix computed — derivative probability scored.',
    },
    {
      id: 'signal_verification',
      name: plainEnglishMode ? '4. Check Age & Disputes' : '4. Signal Verification',
      icon: Clock,
      desc: plainEnglishMode ? 'Looks for contradictions and old data' : 'Freshness decay & contradiction polarity',
      conclusion: plainEnglishMode
        ? '✓ Checked when the data was published and whether any studies directly disagree with it.'
        : '✓ Temporal freshness decay and contradiction polarity signals evaluated.',
    },
    {
      id: 'trust_decision',
      name: plainEnglishMode ? '5. Compute Trust Score' : '5. Trust Engine',
      icon: ShieldCheck,
      desc: plainEnglishMode ? 'Makes the TRUST / VERIFY / ABSTAIN decision' : 'Selective prediction calibration',
      conclusion: plainEnglishMode
        ? '✓ All signals combined. A trust score was computed for each individual statement.'
        : '✓ Selective prediction confidence score computed — verdict assigned.',
    },
  ];

  const currentIdx = progress ? progress.stageIndex - 1 : 0;
  const isComplete = !isAnalyzing && progress?.progressPercent === 100;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
        <div className="flex items-center space-x-2">
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#0f766e]" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          )}
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0f172a]">
            {plainEnglishMode ? 'Live Verification — 5 Steps' : 'Multi-Stage Research Pipeline'}
          </span>
          <ContextHelpTooltip
            title="5-Stage Pipeline"
            simpleExplanation="TRACEVIDENCE runs 5 verification steps. After each step completes, you will see what was found and what it means."
            size="xs"
          />
        </div>
        <span
          className={`font-mono text-xs sm:text-sm font-bold ${
            isComplete ? 'text-emerald-600' : 'text-[#0f172a]'
          }`}
        >
          {progress ? `${progress.progressPercent}%` : '0%'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <div
          className={`h-full transition-all duration-700 ${
            isComplete
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-[#0f766e] via-[#f97316] to-[#0f766e] bg-[length:200%] animate-gradient'
          }`}
          style={{ width: `${progress ? progress.progressPercent : 5}%` }}
        />
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < currentIdx || isComplete;
          const isCurrent = !isComplete && idx === currentIdx;

          return (
            <div
              key={st.id}
              className={`flex flex-col p-4 transition-all ${
                isCurrent
                  ? 'bg-teal-50/80'
                  : isDone
                  ? 'bg-emerald-50/50'
                  : 'bg-white opacity-50'
              }`}
            >
              {/* Step Badge + Icon Row */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold border ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : isCurrent
                      ? 'bg-[#0f766e] text-white border-[#0f766e]'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <Icon
                  className={`h-4 w-4 ${
                    isCurrent
                      ? 'text-[#0f766e] animate-pulse'
                      : isDone
                      ? 'text-emerald-600'
                      : 'text-slate-300'
                  }`}
                />
              </div>

              {/* Step Name */}
              <div className="text-xs font-bold text-[#0f172a] leading-tight">{st.name}</div>

              {/* While running: show desc; when done: show conclusion */}
              <div
                className={`mt-1 text-[11px] leading-snug ${
                  isDone ? 'text-emerald-700 font-medium' : 'text-slate-400'
                }`}
              >
                {isDone ? st.conclusion : isCurrent ? st.desc : st.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Step Live Detail */}
      {progress && isAnalyzing && (
        <div className="border-t border-slate-100 px-5 py-3 space-y-2 bg-[#f8fafc]">
          <div className="rounded-lg bg-white px-3 py-2 text-xs font-mono text-[#0f172a] border border-slate-200">
            <span className="text-[#0f766e] font-bold">RUNNING: </span>
            {progress.detail}
          </div>
          {progress.uncertaintyEstimate && (
            <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>Uncertainty signal:</strong> {progress.uncertaintyEstimate}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Completed footer */}
      {isComplete && (
        <div className="border-t border-emerald-100 bg-emerald-50/70 px-5 py-3 text-xs font-mono text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>All 5 steps complete.</strong>{' '}
            {plainEnglishMode
              ? 'Scroll down to see what was found at each step and the final verdict.'
              : 'Full pipeline executed — see the Verdict Scoreboard below for the synthesised result.'}
          </span>
        </div>
      )}
    </div>
  );
}
