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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">No Active Analysis Found</h2>
        <p className="mt-2 text-sm text-slate-400">
          Please run an analysis or select a benchmark case first.
        </p>
        <Link
          href="/analyze"
          className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Claim Not Found</h2>
        <Link
          href="/analyze"
          className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950"
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <Link
          href="/analyze"
          className="flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Analysis Results</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs text-slate-400">Claim Identifier:</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-cyan-300 font-bold border border-white/10">
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
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-[#0e1628] via-[#0d111c] to-[#07090e] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <DecisionBadge decision={claim.decision} size="lg" />
              <span className="font-mono text-xs text-slate-400">
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
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
              Entity Target: {claim.targetEntity}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-right">
            <div className="flex items-center justify-end space-x-1">
              <div className="text-[11px] font-mono text-slate-400">
                {plainEnglishMode ? 'Source Originality' : 'Independence Ratio'}
              </div>
              <ContextHelpTooltip
                title="Independence Ratio"
                simpleExplanation={`${claim.apparentSourcesCount} sources collapsed to ${claim.independentOriginsCount} origin.`}
                whyItMatters="Protects you against repetition bias."
                size="xs"
              />
            </div>
            <div className="font-mono text-lg font-black text-cyan-400">
              {claim.apparentSourcesCount} sources &rarr; {claim.independentOriginsCount} origin
              {claim.independentOriginsCount > 1 ? 's' : ''}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {(claim.independenceRatio * 100).toFixed(1)}% Independent
            </div>
          </div>
        </div>

        {/* Claim Text */}
        <div className="mt-6">
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-white leading-relaxed">
            &ldquo;{claim.text}&rdquo;
          </h1>
        </div>

        {/* Decision Rationale */}
        <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Why was this decision reached?
            </h3>
            <ContextHelpTooltip
              title="Decision Rationale"
              simpleExplanation="An automated natural language summary explaining the key factual strengths and weaknesses found."
              size="xs"
            />
          </div>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            {claim.decisionReason}
          </p>
          <div className="mt-3 pt-2 border-t border-cyan-500/20 text-xs font-mono text-amber-300">
            <span className="font-bold">RECOMMENDED PROTOCOL:</span> {claim.recommendedAction}
          </div>
        </div>

        {/* Signal Indicators Row */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5 flex items-center space-x-3">
            <GitFork className="h-5 w-5 text-cyan-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Corroboration Structure
              </div>
              <div className="text-xs font-bold text-white font-mono">
                {claim.apparentSourcesCount} Visible / {claim.independentOriginsCount} Independent
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5 flex items-center space-x-3">
            <Clock className="h-5 w-5 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Temporal Freshness
              </div>
              <div className="text-xs font-bold text-white font-mono">
                {claim.temporalStatus} (Score: {claim.freshnessScore})
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-3 border border-white/5 flex items-center space-x-3">
            <AlertTriangle
              className={`h-5 w-5 ${
                claim.contradictionDetected ? 'text-rose-400' : 'text-emerald-400'
              }`}
            />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Contradiction Alert
              </div>
              <div className="text-xs font-bold font-mono">
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
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-rose-200">
          <div className="flex items-center space-x-2 font-bold text-sm text-rose-300 font-mono">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>EMPIRICAL CONTRADICTION ALERT</span>
          </div>
          <p className="mt-1 text-xs text-rose-100/90 leading-relaxed">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              Corroborating & Contradicting Evidence Snippets ({claimEvidences.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">Direct snippet inspection</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
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
      <div className="rounded-xl border border-white/10 bg-[#0d1424] p-5 shadow-xl">
        <button
          onClick={() => setShowRawReasoning(!showRawReasoning)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Epistemic Synthesis & LLM Trace
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              showRawReasoning ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showRawReasoning && (
          <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-2 font-mono">
            <p>{claim.llmReasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
