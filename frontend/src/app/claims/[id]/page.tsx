'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import DecisionBadge from '@/components/common/DecisionBadge';
import SourceBadge from '@/components/common/SourceBadge';
import ProvenanceTree from '@/components/graph/ProvenanceTree';
import EvidenceSnippetCard from '@/components/claims/EvidenceSnippetCard';
import TrustMathAudit from '@/components/claims/TrustMathAudit';
import PageTutorialBanner from '@/components/common/PageTutorialBanner';
import ContextHelpTooltip from '@/components/common/ContextHelpTooltip';
import {
  ArrowLeft,
  ShieldCheck,
  GitFork,
  Clock,
  AlertTriangle,
  BrainCircuit,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentAnalysis, plainEnglishMode } = useAnalysisStore();
  const [showRawReasoning, setShowRawReasoning] = React.useState(true);

  const claimId = params?.id as string;

  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">No Active Analysis Found</h2>
        <p className="text-base sm:text-lg text-slate-300">
          Please run an analysis or select a benchmark case first.
        </p>
        <Link
          href="/analyze"
          className="btn-gradient-rbgw inline-flex items-center space-x-2 rounded-xl px-6 py-3 text-sm sm:text-base font-bold text-white shadow-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go to Analyze Workspace</span>
        </Link>
      </div>
    );
  }

  const claim = currentAnalysis.claims.find((c) => c.id === claimId) || currentAnalysis.claims[0];

  if (!claim) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Claim Not Found</h2>
        <Link
          href="/analyze"
          className="btn-gradient-rbgw inline-flex items-center space-x-2 rounded-xl px-6 py-3 text-sm sm:text-base font-bold text-white shadow-xl"
        >
          <span>Return to Workspace</span>
        </Link>
      </div>
    );
  }

  const claimEvidences = currentAnalysis.evidences.filter((e) =>
    claim.evidenceIds.includes(e.id)
  );
  const sourceMap = new Map(currentAnalysis.sources.map((s) => [s.id, s]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/12 pb-5">
        <Link
          href="/analyze"
          className="flex items-center space-x-2 text-sm sm:text-base font-mono font-bold text-blue-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Analysis Results</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="font-mono text-sm text-slate-300 font-semibold">Claim Identifier:</span>
          <span className="rounded-xl bg-slate-800 px-3 py-1 font-mono text-sm text-white font-black border border-white/15">
            {claim.id}
          </span>
          <ContextHelpTooltip
            title="Claim Identifier"
            simpleExplanation="A unique tracking ID assigned to this atomic assertion during the deconstruction stage."
            size="xs"
          />
        </div>
      </div>

      {/* Tutorial & Guidance Banner */}
      <PageTutorialBanner
        pageKey="claim_detail"
        title="Claim Inspection Guide"
        subtitle="How to trace origins, inspect quotes, and review mathematical audits"
        empathyNote="Conflicting claims can feel dizzying. We break down the exact lineage so you can see whether a statement came from a verified study or an echo chamber."
        steps={[
          {
            number: 1,
            title: 'Examine Provenance Tree',
            description: 'Scroll down to the TRACE-X Lineage Tree to see who published this first (Distance 0) and who syndicated it.',
            highlightAction: 'Spot the primary seed study',
          },
          {
            number: 2,
            title: 'Read Evidence Quotations',
            description: 'Inspect direct excerpts from peer-reviewed journals, government reports, or news wire agencies.',
            highlightAction: 'Check "Supports" vs "Contradicts" tags',
          },
          {
            number: 3,
            title: 'Audit Decision Mathematics',
            description: 'Switch between "Plain English Walkthrough" and "Formal Math" to see exactly why this score was assigned.',
            highlightAction: 'Toggle math view mode',
          },
        ]}
        commonConfusion={{
          question: 'What if different articles quote the exact same study with different numbers?',
          answer: 'Journalists often round numbers or confuse units. TRACEVIDENCE extracts the exact figure from the primary DOI origin so you get the original empirical truth.',
        }}
      />

      {/* Hero: Claim Decision Banner */}
      <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-[#121c2e] via-[#0d1424] to-[#0a0e18] p-7 sm:p-9 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <DecisionBadge decision={claim.decision} size="lg" />
              <span className="font-mono text-sm sm:text-base text-slate-200 font-bold">
                Confidence: {(claim.confidence * 100).toFixed(0)}%
              </span>
              <ContextHelpTooltip
                title={`${claim.decision} Decision`}
                simpleExplanation={
                  claim.decision === 'TRUST'
                    ? 'Rigorous independent corroboration with no unresolved contradictions.'
                    : claim.decision === 'VERIFY'
                    ? 'Plausible, but caution advised due to single-source reliance or older publication.'
                    : 'System abstains to prevent misleading you under high uncertainty or severe conflict.'
                }
              />
            </div>
            <div className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400 font-mono">
              Entity Target: {claim.targetEntity}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-black/50 px-5 py-3.5 text-right shadow-md">
            <div className="flex items-center justify-end space-x-1.5">
              <div className="text-xs sm:text-sm font-mono text-slate-300">
                {plainEnglishMode ? 'Source Originality' : 'Independence Ratio'}
              </div>
              <ContextHelpTooltip
                title="Independence Ratio"
                simpleExplanation={`${claim.apparentSourcesCount} sources collapsed to ${claim.independentOriginsCount} origin.`}
                whyItMatters="Protects you against repetition bias."
                size="xs"
              />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-blue-300 mt-0.5">
              {claim.apparentSourcesCount} sources &rarr; {claim.independentOriginsCount} origin
              {claim.independentOriginsCount > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {(claim.independenceRatio * 100).toFixed(1)}% Independent
            </div>
          </div>
        </div>

        {/* Claim Text */}
        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-white leading-relaxed">
            &ldquo;{claim.text}&rdquo;
          </h1>
        </div>

        {/* Decision Rationale */}
        <div className="mt-6 rounded-2xl border border-blue-500/35 bg-blue-950/30 p-5 shadow-md">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-blue-300">
              Why was this decision reached?
            </h3>
            <ContextHelpTooltip
              title="Decision Rationale"
              simpleExplanation="An automated natural language summary explaining the key factual strengths and weaknesses found."
              size="xs"
            />
          </div>
          <p className="mt-2.5 text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
            {claim.decisionReason}
          </p>
          <div className="mt-4 pt-3 border-t border-blue-500/25 text-xs sm:text-sm font-mono text-amber-300 font-semibold">
            <span className="font-bold">RECOMMENDED PROTOCOL:</span> {claim.recommendedAction}
          </div>
        </div>

        {/* Signal Indicators Row */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900/80 p-4 border border-white/10 flex items-center space-x-3.5 shadow-sm">
            <GitFork className="h-6 w-6 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Corroboration Structure
              </div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {claim.apparentSourcesCount} Visible / {claim.independentOriginsCount} Independent
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-4 border border-white/10 flex items-center space-x-3.5 shadow-sm">
            <Clock className="h-6 w-6 text-blue-300 shrink-0" />
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Temporal Freshness
              </div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {claim.temporalStatus} (Score: {claim.freshnessScore})
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/80 p-4 border border-white/10 flex items-center space-x-3.5 shadow-sm">
            <AlertTriangle
              className={`h-6 w-6 shrink-0 ${
                claim.contradictionDetected ? 'text-rose-400' : 'text-emerald-400'
              }`}
            />
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Contradiction Alert
              </div>
              <div className="text-sm font-bold font-mono mt-0.5">
                {claim.contradictionDetected ? (
                  <span className="text-rose-400">Conflict Detected</span>
                ) : (
                  <span className="text-emerald-400">No Conflict</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contradiction Alert Box (If present) */}
      {claim.contradictionDetected && claim.contradictionDetails && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-5 text-rose-200 shadow-xl">
          <div className="flex items-center space-x-2.5 font-bold text-base text-rose-300 font-mono">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <span>EMPIRICAL CONTRADICTION ALERT</span>
          </div>
          <p className="mt-2 text-sm text-rose-100/90 leading-relaxed">
            {claim.contradictionDetails}
          </p>
        </div>
      )}

      {/* Mathematical Audit Card */}
      <TrustMathAudit claim={claim} />

      {/* TRACE-X Provenance Tree */}
      <ProvenanceTree
        provenanceChain={claim.provenanceChain}
        sources={currentAnalysis.sources}
      />

      {/* Evidence Quotations Breakdown */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Layers className="h-5 w-5 text-blue-400" />
            <h3 className="font-mono text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Corroborating & Contradicting Evidence Snippets ({claimEvidences.length})
            </h3>
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-semibold">Direct snippet inspection</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {claimEvidences.map((evidence) => (
            <EvidenceSnippetCard
              key={evidence.id}
              evidence={evidence}
              source={sourceMap.get(evidence.sourceId)}
            />
          ))}
        </div>
      </div>

      {/* Deep LLM & Algorithmic Reasoning */}
      <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#10182c] to-[#0d1424] p-6 shadow-2xl">
        <button
          onClick={() => setShowRawReasoning(!showRawReasoning)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2.5">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
            <span className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              Epistemic Synthesis & LLM Trace
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-300 transition-transform ${
              showRawReasoning ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showRawReasoning && (
          <div className="mt-5 pt-4 border-t border-white/10 text-sm sm:text-base text-slate-200 leading-relaxed space-y-3 font-mono">
            <p>{claim.llmReasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
