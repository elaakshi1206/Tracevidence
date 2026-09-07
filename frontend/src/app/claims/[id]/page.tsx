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
  Quote,
  Scale,
  FlaskConical,
  Search,
  Shield,
  Info,
} from 'lucide-react';

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentAnalysis, plainEnglishMode } = useAnalysisStore();
  const [showRawReasoning, setShowRawReasoning] = React.useState(true);

  const claimId = params?.id as string;

  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">No Active Analysis Found</h2>
        <p className="text-sm text-slate-600">
          Please run an analysis or select a benchmark case first.
        </p>
        <Link
          href="/analyze"
          className="btn-gradient-rbgw inline-flex items-center space-x-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md"
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
      <div className="mx-auto max-w-5xl px-4 py-16 text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Claim Not Found</h2>
        <Link
          href="/analyze"
          className="btn-gradient-rbgw inline-flex items-center space-x-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md"
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link
          href="/analyze"
          className="flex items-center space-x-2 text-xs sm:text-sm font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Analysis Results</span>
        </Link>

        <div className="flex items-center space-x-2.5">
          {/* Analysis Mode Badge */}
          <span
            className={`flex items-center space-x-1 rounded-md px-2.5 py-1 font-mono text-xs font-bold border ${
              currentAnalysis.analysisMode === 'live'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            {currentAnalysis.analysisMode === 'live' ? (
              <Search className="h-3 w-3 text-blue-600" />
            ) : (
              <FlaskConical className="h-3 w-3 text-indigo-600" />
            )}
            <span>
              {currentAnalysis.modeBadgeLabel ||
                (currentAnalysis.analysisMode === 'live' ? 'Live Retrieval' : 'Curated Benchmark')}
            </span>
          </span>

          <span className="font-mono text-xs text-slate-500 font-semibold">Claim ID:</span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-800 font-bold border border-slate-200">
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <DecisionBadge decision={claim.decision} size="lg" />
              <span className="font-mono text-xs sm:text-sm text-slate-600 font-semibold">
                Calibrated Confidence: {(claim.confidence * 100).toFixed(0)}%
              </span>
              {claim.reliabilityIndicator && (
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold border ${
                    claim.reliabilityIndicator === 'High Rigor'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : claim.reliabilityIndicator === 'Moderate Reliability'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {claim.reliabilityIndicator}
                </span>
              )}
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
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-700 font-mono">
              Entity Target: {claim.targetEntity}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right shadow-2xs">
            <div className="flex items-center justify-end space-x-1">
              <div className="text-xs font-mono text-slate-600">
                {plainEnglishMode ? 'Source Originality' : 'Independence Ratio'}
              </div>
              <ContextHelpTooltip
                title="Independence Ratio"
                simpleExplanation={`${claim.apparentSourcesCount} sources collapsed to ${claim.independentOriginsCount} origin.`}
                whyItMatters="Protects you against repetition bias."
                size="xs"
              />
            </div>
            <div className="font-mono text-base sm:text-lg font-black text-blue-700 mt-0.5">
              {claim.apparentSourcesCount} sources &rarr; {claim.independentOriginsCount} origin
              {claim.independentOriginsCount > 1 ? 's' : ''}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {(claim.independenceRatio * 100).toFixed(1)}% Independent · Conf: {claim.independenceConfidence || 'High'}
            </div>
          </div>
        </div>

        {/* Claim Text */}
        <div className="mt-5">
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-slate-900 leading-relaxed">
            &ldquo;{claim.text}&rdquo;
          </h1>
        </div>

        {/* Verbatim Supporting Quote from Input */}
        {claim.inputQuote && claim.inputQuote !== claim.text && (
          <div className="mt-3 flex items-start space-x-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
            <Quote className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                Original Supporting Sentence from Input:
              </span>
              <p className="mt-0.5 italic text-slate-600">&ldquo;{claim.inputQuote}&rdquo;</p>
            </div>
          </div>
        )}

        {/* Decision Rationale */}
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900">
              Why was this decision reached?
            </h3>
            <ContextHelpTooltip
              title="Decision Rationale"
              simpleExplanation="An automated natural language summary explaining the key factual strengths and weaknesses found."
              size="xs"
            />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {claim.decisionReason}
          </p>
          <div className="mt-3 pt-2 border-t border-blue-200 text-xs font-mono text-amber-800 font-semibold">
            <span className="font-bold">RECOMMENDED PROTOCOL:</span> {claim.recommendedAction}
          </div>
        </div>

        {/* Signal Indicators Row */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center space-x-3">
            <GitFork className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Corroboration Structure
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                {claim.apparentSourcesCount} Visible / {claim.independentOriginsCount} Independent
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Temporal Freshness
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                {claim.temporalStatus} (Score: {claim.freshnessScore})
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center space-x-3">
            <AlertTriangle
              className={`h-5 w-5 shrink-0 ${
                claim.contradictionDetected ? 'text-rose-600' : 'text-emerald-600'
              }`}
            />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Contradiction Alert
              </div>
              <div className="text-xs font-bold font-mono mt-0.5">
                {claim.contradictionDetected ? (
                  <span className="text-rose-700">Conflict Detected</span>
                ) : (
                  <span className="text-emerald-700">No Conflict</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapse Evidence Snippets Callout (When apparent sources > independent origins) */}
        {claim.collapseEvidence && claim.apparentSourcesCount > claim.independentOriginsCount && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs font-mono text-indigo-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 uppercase">
                TRACE-X Source Collapse Justification:
              </span>
              {claim.collapseEvidence.derivationProbability && (
                <span className="rounded bg-indigo-100 px-2 py-0.5 font-bold text-indigo-800">
                  Derivation Probability: {claim.collapseEvidence.derivationProbability}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-indigo-900/90 leading-relaxed">
              {claim.collapseEvidence.rationale}
            </p>
            {claim.collapseEvidence.sharedFigures && claim.collapseEvidence.sharedFigures.length > 0 && (
              <div className="mt-2 text-xs text-indigo-800">
                <span className="font-bold">Shared Numerical Anchors:</span>{' '}
                {claim.collapseEvidence.sharedFigures.join(', ')}
              </div>
            )}
            {claim.collapseEvidence.overlapSnippet && (
              <div className="mt-1 text-[11px] text-indigo-700/80">
                {claim.collapseEvidence.overlapSnippet}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explicit Numerical Conflict Alert Box (If present) */}
      {claim.numericalConflict && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/90 p-4 text-rose-950 shadow-2xs font-mono">
          <div className="flex items-center space-x-2 font-bold text-sm text-rose-800">
            <Scale className="h-4 w-4 text-rose-600" />
            <span>EXPLICIT NUMERICAL CONFLICT AUDIT</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-lg bg-white p-3 border border-rose-200">
              <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
                Asserted in Stated Claim:
              </span>
              <span className="text-base font-bold text-rose-700 mt-1 block">
                {claim.numericalConflict.claimedValue}
              </span>
            </div>
            <div className="rounded-lg bg-white p-3 border border-emerald-200">
              <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
                Authoritative Literature Rebuttal:
              </span>
              <span className="text-base font-bold text-emerald-700 mt-1 block">
                {claim.numericalConflict.rebuttalValue}
              </span>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-rose-900/90 leading-relaxed">
            {claim.numericalConflict.deltaNote}
          </p>
        </div>
      )}

      {/* Contradiction Alert Box (If present) */}
      {claim.contradictionDetected && claim.contradictionDetails && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-4 text-rose-900 shadow-2xs">
          <div className="flex items-center space-x-2 font-bold text-sm text-rose-800 font-mono">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>EMPIRICAL CONTRADICTION ALERT</span>
          </div>
          <p className="mt-1.5 text-xs text-rose-950/80 leading-relaxed">
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
            <Layers className="h-4 w-4 text-blue-600" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-900">
              Corroborating & Contradicting Evidence Snippets ({claimEvidences.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Direct snippet inspection</span>
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <button
          onClick={() => setShowRawReasoning(!showRawReasoning)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Epistemic Synthesis & LLM Trace
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${
              showRawReasoning ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showRawReasoning && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 font-mono">
            <p>{claim.llmReasoning}</p>
          </div>
        )}
      </div>

      {/* Epistemic Boundaries & Academic Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-2 text-xs font-mono text-amber-950">
        <div className="flex items-center space-x-2 font-bold text-amber-900 uppercase">
          <Shield className="h-4 w-4 text-amber-700" />
          <span>Epistemic Boundaries & Limitations of This Run</span>
        </div>
        <p className="leading-relaxed text-amber-900/90">
          “TRACEVIDENCE does not ask users to trust the system blindly. It makes evidence provenance, source independence, and uncertainty visible so that users can decide how much to trust the information.”
        </p>
        <p className="text-[11px] text-amber-800">
          Research prototype for investigating evidence provenance and selective prediction. Not an infallible truth oracle. Always verify important claims with primary sources.
        </p>
      </div>
    </div>
  );
}
