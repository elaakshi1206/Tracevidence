'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import EvidenceGraph from '@/components/graph/EvidenceGraph';
import PageTutorialBanner from '@/components/common/PageTutorialBanner';
import ContextHelpTooltip from '@/components/common/ContextHelpTooltip';
import WorkflowStepper from '@/components/common/WorkflowStepper';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import { Network, ArrowLeft, ArrowRight, Sparkles, Info, ShieldCheck, Layers, HelpCircle } from 'lucide-react';

export default function GraphPage() {
  const { currentAnalysis, loadBenchmarkCase, plainEnglishMode } = useAnalysisStore();

  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">No Graph Data Available</h2>
        <p className="text-sm text-[#475569]">
          Run an analysis or select a benchmark case to construct the evidence provenance graph.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center space-x-2 rounded-xl bg-[#0f766e] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#115e59]"
        >
          <span>Go to Step 1: Fact Check</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 3-Step Guided Journey Ribbon */}
      <WorkflowStepper currentStep={2} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-[#0f766e]">
              <Network className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#0f172a]">
              {plainEnglishMode ? 'Evidence Graph' : 'Interactive Provenance Graph'}
            </h1>
            <ContextHelpTooltip
              title="Interactive Graph"
              simpleExplanation="A visual map showing how claims connect to original studies, news reports, and debunking citations."
              whyItMatters="Lets you visually spot echo chambers and circular reporting at a single glance."
            />
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            {plainEnglishMode
              ? 'Follow the lines from left to right: Left = Original Seed Studies, Center = Media Articles, Right = Evaluated Statements.'
              : 'TRACE-X node-link visualization mapping claims, primary seeds, and syndicated copies.'}
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-mono text-[#0f172a] font-bold">Case Study:</span>
          <select
            value={currentAnalysis.id}
            onChange={(e) => {
              const matched = BENCHMARK_CASES.find((b) => b.data.id === e.target.value);
              if (matched) loadBenchmarkCase(matched.id);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs text-[#0f172a] outline-none focus:border-[#0f766e] shadow-2xs font-semibold"
          >
            {BENCHMARK_CASES.map((b) => (
              <option key={b.data.id} value={b.data.id}>
                {b.tag} - {b.title.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tutorial & Guidance Banner */}
      <PageTutorialBanner
        pageKey="graph_view"
        title="Graph Navigation Tutorial"
        subtitle="How to trace information flow and spot single points of failure"
        empathyNote="Graphs can seem complex at first glance. Think of it like a family tree of information: follow the lines from right to left to find who originally said it!"
        steps={[
          {
            number: 1,
            title: 'Read Left to Right',
            description: 'Left (Teal) = Original Studies. Middle (Slate) = News Re-reporters. Right (Decision Colors) = Evaluated Statements.',
            highlightAction: 'Notice the 3-column layout',
          },
          {
            number: 2,
            title: 'Spot the Echo Chamber',
            description: 'Look for yellow dashed arrows. If 5 news sites all connect to 1 study, that is syndication, NOT 5 independent verifications.',
            highlightAction: 'Watch for yellow dashed links',
          },
          {
            number: 3,
            title: 'Click Any Node to Inspect',
            description: 'Clicking any circle or box opens its complete source credentials, publication year, and direct quotes in the side drawer.',
            highlightAction: 'Click any node on canvas',
          },
        ]}
        commonConfusion={{
          question: 'What does the flashing red line mean?',
          answer: 'The pulsing red line is a Contradiction Edge. It shows where a credible scientific study or fact-check directly refutes the claim.',
        }}
      />

      {/* Legend and Guidance Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded-full border-2 border-[#14b8a6] bg-[#0f766e] shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a] flex items-center space-x-1">
              <span>Primary Origin Node</span>
              <ContextHelpTooltip
                title="Primary Origin Node"
                simpleExplanation="The first published study, trial, or official data release."
                size="xs"
              />
            </div>
            <div className="text-[11px] text-[#475569]">First-published root data / study</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded-md border-2 border-slate-400 bg-slate-200 shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a] flex items-center space-x-1">
              <span>Intermediate Source</span>
              <ContextHelpTooltip
                title="Intermediate Source"
                simpleExplanation="Secondary outlets like newspapers, wire services, or blogs that report on the primary origin."
                size="xs"
              />
            </div>
            <div className="text-[11px] text-[#475569]">Reprint, wire agency, or blog</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded-md border-2 border-[#059669] bg-emerald-100 shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a] flex items-center space-x-1">
              <span>Claim Statement</span>
              <ContextHelpTooltip
                title="Claim Statement"
                simpleExplanation="The specific factual assertion being verified."
                size="xs"
              />
            </div>
            <div className="text-[11px] text-[#475569]">Evaluated atomic statement</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="h-1.5 w-7 bg-[#e11d48] animate-pulse rounded shrink-0" />
          <div>
            <div className="font-bold text-[#e11d48] flex items-center space-x-1">
              <span>Contradiction Edge</span>
              <ContextHelpTooltip
                title="Contradiction Edge"
                simpleExplanation="A direct disagreement or refutation link between two nodes."
                size="xs"
              />
            </div>
            <div className="text-[11px] text-[#475569]">Direct refutation link</div>
          </div>
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <EvidenceGraph analysis={currentAnalysis} />

      {/* Step Transition Footer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/analyze"
          className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Analyze Workspace</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-[#475569] hidden sm:inline">
            Want to see academic proofs, ECE calibration & statistical benchmarks?
          </span>
          <Link
            href="/research"
            className="flex items-center space-x-2 rounded-xl bg-[#0f766e] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#115e59] transition-all"
          >
            <span>Proceed to Research Lab</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
