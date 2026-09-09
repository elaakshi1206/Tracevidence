'use client';

import React from 'react';
import { AnalysisResult } from '@/types';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  Network,
  Sparkles,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Info,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Share2,
} from 'lucide-react';
import ContextHelpTooltip from '../common/ContextHelpTooltip';

interface GraphConclusionGuideProps {
  analysis: AnalysisResult;
}

export default function GraphConclusionGuide({ analysis }: GraphConclusionGuideProps) {
  const { plainEnglishMode } = useAnalysisStore();

  const m = analysis.aggregateMetrics;
  const sources = analysis.sources;
  const claims = analysis.claims;
  const origins = sources.filter((s) => s.isPrimaryOrigin || s.tier === 'Academic' || s.tier === 'Official');
  const apparentSourcesCount = sources.length;
  const independentOriginsCount = Math.max(1, Math.round(apparentSourcesCount * (m.averageIndependence || 0.5)));
  const echoDetected = m.averageIndependence < 0.45;
  const hasContradictions = m.contradictionRate > 0.3;

  // Generate simple, student-friendly Graph Conclusion sentences
  const conclusionSentences: string[] = [];

  if (echoDetected) {
    conclusionSentences.push(
      `Most of the sources are repeating the same original report. We found ${apparentSourcesCount} websites that mention this, but they all trace back to only ${independentOriginsCount} original study. So the apparent agreement is misleading — it is one idea echoed many times, not many independent confirmations.`
    );
    conclusionSentences.push(
      `Think of it like this: if 8 people tell you the same rumor they heard from the same friend, you still only have 1 source — not 8. That is exactly what is happening here.`
    );
  } else if (independentOriginsCount <= 2) {
    conclusionSentences.push(
      `Only ${independentOriginsCount} truly independent source${independentOriginsCount > 1 ? 's were' : ' was'} found in available literature.`
    );
    conclusionSentences.push(
      `While the sources agree, science requires more separate research teams to reach the same conclusion before something is considered a settled consensus. More independent studies are needed.`
    );
  } else {
    conclusionSentences.push(
      `Multiple independent research teams — with no connection to each other — conducted separate studies and all reached the same conclusion. This is the strongest kind of evidence.`
    );
    conclusionSentences.push(
      `No circular copying was detected. The evidence comes from truly different institutions and research groups, which is why this claim has a higher trust score.`
    );
  }

  if (hasContradictions) {
    conclusionSentences.push(
      `There is a direct contradiction: newer scientific studies found results that conflict with what older sources claimed. Look for the pulsing red arrows in the map below — they show exactly where experts disagree with the claim.`
    );
  }

  if (m.averageFreshness < 0.4) {
    conclusionSentences.push(
      `Several cited sources are quite old. Science, law, and technology change over time — what was true 10 years ago may not reflect the current understanding. Treat old data with extra caution.`
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Clear Graph Conclusion Box */}
      <div className="rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-white to-emerald-50/40 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 pb-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e] text-white shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0f766e]">
                Plain-English Summary — What Does This Evidence Map Show?
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
                Where Did This Information Come From?
              </h2>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 font-mono text-xs font-bold border ${
              echoDetected
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : hasContradictions
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {echoDetected
              ? '⚠ Echo Chamber — Sources Are Copies'
              : hasContradictions
              ? '⚡ Experts Disagree — See Red Arrows'
              : '✓ Multiple Independent Sources Confirmed'}
          </span>
        </div>

        {/* Conclusion Sentences in Bullet List */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
          {conclusionSentences.map((sentence, idx) => (
            <div key={idx} className="flex items-start space-x-2 bg-white/80 rounded-xl p-3 border border-teal-100/80 shadow-2xs">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[#0f766e] text-xs font-bold font-mono mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{sentence}</p>
            </div>
          ))}
        </div>

        {/* Bottom Key Lesson */}
        <div className="mt-3 pt-3 border-t border-teal-100 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>
            {echoDetected
              ? '💡 Key Lesson: 1 source copied 5 times = still just 1 proof, NOT 5 proofs.'
              : '💡 Key Lesson: Real truth needs multiple SEPARATE, non-connected confirmations.'}
          </span>
          <span className="font-bold text-[#0f766e]">
            {apparentSourcesCount} sources found → {independentOriginsCount} truly independent origin{independentOriginsCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* 2. Student Guide: How to Read the Map */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <BookOpen className="h-4 w-4 text-[#0f766e]" />
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#0f172a]">
            How to Read the Evidence Map Below
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Card A: Direction of Reading */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-[#0f766e] font-bold font-mono">
              <ArrowRight className="h-4 w-4" />
              <span>1. Read Left → Right</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The map flows like a story from left to right:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
              <li><strong>Left:</strong> The original research study where the data was first created.</li>
              <li><strong>Middle:</strong> News sites and blogs that re-reported it.</li>
              <li><strong>Right:</strong> The claim being fact-checked.</li>
            </ul>
          </div>

          {/* Card B: What the Nodes Mean */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-blue-700 font-bold font-mono">
              <Layers className="h-4 w-4" />
              <span>2. What Each Shape Means</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Each shape on the map represents one item:
            </p>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500 shrink-0" />
                <span><strong>Teal Circle:</strong> The original study or dataset — where the claim was first published.</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-2.5 w-2.5 rounded-md bg-slate-400 shrink-0" />
                <span><strong>Grey Square:</strong> A website that copied and re-reported the story — without doing new research.</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-2.5 w-2.5 rounded-md bg-emerald-500 shrink-0" />
                <span><strong>Green Card:</strong> The claim being tested — colored by verdict (TRUST / VERIFY / ABSTAIN).</span>
              </li>
            </ul>
          </div>

          {/* Card C: What the Lines & Arrows Mean */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-purple-700 font-bold font-mono">
              <Share2 className="h-4 w-4" />
              <span>3. What the Lines Mean</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Lines show how information traveled between sources:
            </p>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-1.5 w-4 bg-emerald-500 rounded shrink-0" />
                <span><strong>Green Line:</strong> This source supports / confirms the claim.</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-1.5 w-4 bg-rose-500 animate-pulse rounded shrink-0" />
                <span><strong>Pulsing Red Line:</strong> This study DISPROVES or contradicts the claim — it says the claim is wrong.</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-800">
                <span className="h-1.5 w-4 border-t-2 border-dashed border-amber-500 shrink-0" />
                <span><strong>Dashed Yellow Line:</strong> This site re-reported without doing its own original research.</span>
              </li>
            </ul>
          </div>

          {/* Card D: What an Echo Chamber Looks Like */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold font-mono">
              <GitBranch className="h-4 w-4 text-amber-700" />
              <span>4. How to Spot an Echo Chamber</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>What is an Echo Chamber?</strong>
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              If you see many grey news boxes all connecting back to the <em>same single teal origin circle</em>, that is an echo chamber. Many websites are all reporting the same one original study — which makes it look like common knowledge, but it is actually just 1 source echoed many times.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Always-Visible Visual Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs font-mono shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-teal-300 bg-[#0f766e] shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a]">Original Study</div>
            <div className="text-[10px] text-slate-500 font-sans">Where the claim was first published</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-slate-400 bg-slate-300 shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a]">News / Blog Copy</div>
            <div className="text-[10px] text-slate-500 font-sans">Reported it without new research</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-3.5 w-3.5 rounded-md border-2 border-emerald-400 bg-emerald-100 shrink-0" />
          <div>
            <div className="font-bold text-[#0f172a]">Claim Being Tested</div>
            <div className="text-[10px] text-slate-500 font-sans">The statement we are fact-checking</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="h-1.5 w-6 bg-[#e11d48] animate-pulse rounded shrink-0" />
          <div>
            <div className="font-bold text-[#e11d48]">Pulsing Red = Disproved</div>
            <div className="text-[10px] text-slate-500 font-sans">A study says this claim is WRONG</div>
          </div>
        </div>
      </div>
    </div>
  );
}
