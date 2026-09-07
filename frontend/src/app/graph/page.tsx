'use client';

import React from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import EvidenceGraph from '@/components/graph/EvidenceGraph';
import PageTutorialBanner from '@/components/common/PageTutorialBanner';
import ContextHelpTooltip from '@/components/common/ContextHelpTooltip';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import { Network, ArrowLeft, Sparkles, Info, ShieldCheck, Layers, HelpCircle } from 'lucide-react';

export default function GraphPage() {
  const { currentAnalysis, loadBenchmarkCase, plainEnglishMode } = useAnalysisStore();

  if (!currentAnalysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">No Graph Data Available</h2>
        <p className="mt-2 text-sm text-slate-400">
          Run an analysis or select a benchmark case to construct the evidence provenance graph.
        </p>
        <Link
          href="/analyze"
          className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950"
        >
          <span>Go to Analyze Workspace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-cyan-400" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              {plainEnglishMode ? 'Visual Evidence & Rumor Map' : 'Interactive Evidence & Provenance Graph'}
            </h1>
            <ContextHelpTooltip
              title="Interactive Graph"
              simpleExplanation="A 2-dimensional visual map showing how claims connect to sources, origin papers, and debunking citations."
              whyItMatters="Lets you visually spot echo chambers and circular reporting at a single glance."
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {plainEnglishMode
              ? 'Trace where facts come from: Left = Original Seeds, Center = Re-reporting Media, Right = Checked Claims.'
              : 'TRACE-X node-link visualization mapping claims, primary seeds, and syndicated copies.'}
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Dataset:</span>
          <select
            value={currentAnalysis.id}
            onChange={(e) => {
              const matched = BENCHMARK_CASES.find((b) => b.data.id === e.target.value);
              if (matched) loadBenchmarkCase(matched.id);
            }}
            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 font-mono text-xs text-cyan-300 outline-none focus:border-cyan-500"
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
            description: 'Left (Cyan) = Original Studies. Middle (Indigo) = News Re-reporters. Right (Emerald) = The Checked Statements.',
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 rounded-xl border border-white/10 bg-[#0d1424] p-4 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-cyan-400 bg-cyan-950 shrink-0" />
          <div>
            <div className="font-bold text-white flex items-center space-x-1">
              <span>Primary Origin Node</span>
              <ContextHelpTooltip
                title="Primary Origin Node"
                simpleExplanation="The first published study, trial, or official data release."
                size="xs"
              />
            </div>
            <div className="text-[10px] text-slate-400">First-published seed data / study</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-indigo-500 bg-indigo-950 shrink-0" />
          <div>
            <div className="font-bold text-white flex items-center space-x-1">
              <span>Intermediate Source</span>
              <ContextHelpTooltip
                title="Intermediate Source"
                simpleExplanation="Secondary outlets like newspapers, wire services, or blogs that report on the primary origin."
                size="xs"
              />
            </div>
            <div className="text-[10px] text-slate-400">Reprint, wire agency, or media</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-emerald-500 bg-slate-900 shrink-0" />
          <div>
            <div className="font-bold text-white flex items-center space-x-1">
              <span>Claim Proposition</span>
              <ContextHelpTooltip
                title="Claim Proposition"
                simpleExplanation="The specific factual assertion being verified."
                size="xs"
              />
            </div>
            <div className="text-[10px] text-slate-400">Target atomic statement evaluated</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-0.5 w-6 bg-rose-500 animate-pulse shrink-0" />
          <div>
            <div className="font-bold text-rose-400 flex items-center space-x-1">
              <span>Contradiction Edge</span>
              <ContextHelpTooltip
                title="Contradiction Edge"
                simpleExplanation="A direct disagreement or refutation link between two nodes."
                size="xs"
              />
            </div>
            <div className="text-[10px] text-slate-400">Direct refutation link</div>
          </div>
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <EvidenceGraph analysis={currentAnalysis} />
    </div>
  );
}
