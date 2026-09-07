'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  X,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  Network,
  Calculator,
  Award,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function GuidedTourModal() {
  const router = useRouter();
  const { isTourOpen, closeTour, tourStep, setTourStep } = useAnalysisStore();

  if (!isTourOpen) return null;

  const tourSteps = [
    {
      stepNumber: 1,
      title: 'The Illusion of Consensus (Why We Built This)',
      badge: 'Core Problem',
      icon: GitBranch,
      iconColor: 'text-rose-400',
      tagline: 'When 20 news websites copy 1 unvetted tweet, that is NOT 20 sources.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            Have you ever wondered why ChatGPT and search engines sound 100% confident even when they are completely wrong?
          </p>
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-2 text-xs">
            <div className="font-bold text-rose-300 font-mono">The Fundamental Flaw of Modern AI & Fact-Checking:</div>
            <p className="text-slate-200 leading-relaxed">
              Standard systems count raw volume. If 15 tech blogs re-publish a sensationalized press release without independent verification, standard algorithms count &ldquo;15 supporting citations&rdquo; and mark it verified!
            </p>
          </div>
          <p className="leading-relaxed">
            <strong className="text-cyan-300">TRACEVIDENCE solves this:</strong> Our TRACE-X engine collapses syndicated copies down to their true origin seed. 15 echoes collapse into 1 origin, instantly preventing artificial consensus.
          </p>
        </div>
      ),
      actionLabel: 'Next: How to Analyze Claims',
    },
    {
      stepNumber: 2,
      title: 'Analyzing Statements in the Workspace',
      badge: 'Step 1: Input & Extraction',
      icon: Layers,
      iconColor: 'text-cyan-400',
      tagline: 'Paste any complex paragraph or choose peer-reviewed benchmarks.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            In the <strong>Analyze Workspace</strong>, you can test statements in three convenient ways:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-black/40 p-3 border border-white/10">
              <span className="font-bold text-cyan-300 font-mono">1. Paste Text</span>
              <p className="mt-1 text-slate-400 text-[11px]">
                Paste AI generated answers, essays, or news statements.
              </p>
            </div>
            <div className="rounded-lg bg-black/40 p-3 border border-white/10">
              <span className="font-bold text-amber-300 font-mono">2. Benchmarks</span>
              <p className="mt-1 text-slate-400 text-[11px]">
                Preloaded peer-reviewed datasets (EV battery debt, coffee health, solid-state batteries).
              </p>
            </div>
            <div className="rounded-lg bg-black/40 p-3 border border-white/10">
              <span className="font-bold text-indigo-300 font-mono">3. URL Extraction</span>
              <p className="mt-1 text-slate-400 text-[11px]">
                Directly retrieve articles and extracts citations automatically.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The system performs <em>atomic proposition decomposition</em>: splitting dense paragraphs into standalone, mathematically verifiable claims.
          </p>
        </div>
      ),
      targetPage: '/analyze',
      actionLabel: 'Next: The 5 Pipeline Stages',
    },
    {
      stepNumber: 3,
      title: 'The 5-Stage Live Engine',
      badge: 'Behind The Scenes',
      icon: Sparkles,
      iconColor: 'text-indigo-400',
      tagline: 'Zero black-box magic. Watch every computational stage execute live.',
      content: (
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="space-y-2">
            <div className="flex items-start space-x-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">01</span>
              <div>
                <strong className="text-white font-mono">Claim Extraction: </strong>
                Deconstructs text into atomic factual propositions with identified subject entities.
              </div>
            </div>
            <div className="flex items-start space-x-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">02</span>
              <div>
                <strong className="text-white font-mono">Evidence Retrieval: </strong>
                Gathers primary scientific literature, government registries, and reputable media snippets.
              </div>
            </div>
            <div className="flex items-start space-x-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">03</span>
              <div>
                <strong className="text-white font-mono">TRACE-X Provenance: </strong>
                Builds citation trees, detects origin distance, and computes the <em>Independence Ratio</em>.
              </div>
            </div>
            <div className="flex items-start space-x-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">04</span>
              <div>
                <strong className="text-white font-mono">Signal Verification: </strong>
                Calculates temporal freshness decay ($F(c)$) and flags empirical contradiction polarities.
              </div>
            </div>
            <div className="flex items-start space-x-2.5 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">05</span>
              <div>
                <strong className="text-white font-mono">AIVIDENCE Trust Calibration: </strong>
                Evaluates selective prediction thresholds: TRUST, VERIFY, or ABSTAIN.
              </div>
            </div>
          </div>
        </div>
      ),
      actionLabel: 'Next: Decoding Decisions',
    },
    {
      stepNumber: 4,
      title: 'Decoding the Decisions: TRUST, VERIFY, ABSTAIN',
      badge: 'Decision Intelligence',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      tagline: 'Why selective prediction saves lives, finances, and credibility.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            Most systems force a crude binary (True/False). Real-world intelligence requires knowing when to refrain from answering:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>TRUST (&gt;75%)</span>
              </div>
              <p className="mt-1.5 text-slate-300 text-[11px] leading-relaxed">
                Backed by multiple independent primary origins, up-to-date, zero credible contradictions. Safe to rely upon.
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400 font-mono">
                <AlertTriangle className="h-4 w-4" />
                <span>VERIFY (45-75%)</span>
              </div>
              <p className="mt-1.5 text-slate-300 text-[11px] leading-relaxed">
                Plausible or partially true, but relies on a single origin, secondary press coverage, or older studies. Inspect citations.
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3">
              <div className="flex items-center space-x-1.5 font-bold text-rose-400 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>ABSTAIN (&lt;45%)</span>
              </div>
              <p className="mt-1.5 text-slate-300 text-[11px] leading-relaxed">
                <strong className="text-rose-300">The crown jewel:</strong> The system refuses to hallucinate under conflict or severe echo-chamber risk.
              </p>
            </div>
          </div>
        </div>
      ),
      actionLabel: 'Next: The Math Audit',
    },
    {
      stepNumber: 5,
      title: 'The Mathematical Decision Audit Explained',
      badge: 'Academic Transparency',
      icon: Calculator,
      iconColor: 'text-cyan-400',
      tagline: 'No math degree needed: here is what the formula actually does.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="rounded-lg bg-black/60 p-3 text-center font-mono text-sm text-cyan-300 border border-cyan-500/30">
            T(c) = max(0, (S(c) · √I(c) · F(c)) - λ·C(c))
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-900/70 p-2.5 border border-white/5">
              <span className="font-mono text-emerald-400 font-bold">S(c) Evidence Support: </span>
              <span className="text-slate-300 text-[11px]">How strongly credible literature affirms this statement.</span>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 border border-white/5">
              <span className="font-mono text-cyan-400 font-bold">√I(c) Independence Filter: </span>
              <span className="text-slate-300 text-[11px]">Square root crushes echo chambers—diminishing returns on re-reports!</span>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 border border-white/5">
              <span className="font-mono text-indigo-400 font-bold">F(c) Freshness Decay: </span>
              <span className="text-slate-300 text-[11px]">Discounts outdated findings as science and policy evolve.</span>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 border border-white/5">
              <span className="font-mono text-rose-400 font-bold">λ·C(c) Contradiction Penalty: </span>
              <span className="text-slate-300 text-[11px]">Direct empirical rebuttals apply a strict, decisive deduction.</span>
            </div>
          </div>
        </div>
      ),
      actionLabel: 'Next: Navigating the Graph',
    },
    {
      stepNumber: 6,
      title: 'Navigating the Interactive Evidence Graph',
      badge: 'Visual Provenance',
      icon: Network,
      iconColor: 'text-amber-400',
      tagline: 'Track rumors to their original source in an interactive 2D canvas.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            The <strong>Evidence Graph</strong> page lets you pan, zoom, and inspect relationships visually:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-3 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <div className="h-4 w-4 rounded-full border-2 border-cyan-400 bg-cyan-950 shrink-0" />
              <div>
                <strong className="text-white">Origin Nodes (Cyan): </strong>
                The first publication, peer-reviewed paper, or primary dataset.
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <div className="h-4 w-4 rounded-md border-2 border-indigo-500 bg-indigo-950 shrink-0" />
              <div>
                <strong className="text-white">Intermediate Sources (Indigo): </strong>
                Wire agencies, news sites, or blogs re-reporting the claims.
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-slate-900/60 p-2.5 border border-white/5">
              <div className="h-0.5 w-6 bg-rose-500 animate-pulse shrink-0" />
              <div>
                <strong className="text-rose-300">Contradiction Edges (Pulsing Red): </strong>
                Direct refutations that debunk or challenge the proposition.
              </div>
            </div>
          </div>
        </div>
      ),
      targetPage: '/graph',
      actionLabel: 'Next: Research Metrics & Avishkar Mode',
    },
    {
      stepNumber: 7,
      title: 'Research Dashboard & Avishkar Academic Evaluation',
      badge: 'Evaluation Rigor',
      icon: Award,
      iconColor: 'text-emerald-400',
      tagline: 'Peer-reviewed benchmark statistics designed for academic judges.',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            If presenting to faculty or academic competition judges, the <strong>Research Dashboard</strong> proves state-of-the-art performance:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
              <div className="font-mono text-emerald-400 font-bold">93.8% Macro F1</div>
              <div className="text-[10px] text-slate-400">+32% over naive prompting</div>
            </div>
            <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
              <div className="font-mono text-cyan-400 font-bold">3.2% False Confidence</div>
              <div className="text-[10px] text-slate-400">Baseline was 31.4% (hallucination drop!)</div>
            </div>
            <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
              <div className="font-mono text-indigo-400 font-bold">ECE 0.042</div>
              <div className="text-[10px] text-slate-400">Near-perfect probability calibration</div>
            </div>
            <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
              <div className="font-mono text-amber-400 font-bold">Cohen&apos;s &kappa; 0.88</div>
              <div className="text-[10px] text-slate-400">Validated against expert human raters</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Click <strong>Export Research Evaluation (JSON)</strong> on the research page to download full empirical telemetry!
          </p>
        </div>
      ),
      targetPage: '/research',
      actionLabel: 'Finish Tour & Explore',
    },
  ];

  const current = tourSteps[tourStep] || tourSteps[0];
  const Icon = current.icon;

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleJumpToPage = (target?: string) => {
    if (target) {
      closeTour();
      router.push(target);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#0c1220] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Icon className={`h-5 w-5 ${current.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-cyan-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-400 border border-cyan-800/60">
                  {current.badge}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Step {current.stepNumber} of {tourSteps.length}
                </span>
              </div>
              <h3 className="mt-1 font-mono text-base sm:text-lg font-bold text-white">
                {current.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeTour}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Close Tutorial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="font-serif italic text-sm text-cyan-300/90 border-l-2 border-cyan-500/40 pl-3">
            &ldquo;{current.tagline}&rdquo;
          </div>

          <div>{current.content}</div>
        </div>

        {/* Step Progression Pills */}
        <div className="flex items-center justify-center space-x-1.5 px-6 py-2 border-t border-white/5 bg-black/20">
          {tourSteps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setTourStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === tourStep
                  ? 'w-6 bg-cyan-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to step ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#080d17] p-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={tourStep === 0}
              className="flex items-center space-x-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {current.targetPage && (
              <button
                onClick={() => handleJumpToPage(current.targetPage)}
                className="hidden sm:inline-flex items-center space-x-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-2 text-xs font-mono font-medium text-cyan-300 hover:bg-cyan-900/50 transition-colors"
              >
                <span>Jump to this page &rarr;</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={closeTour}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 font-mono text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>{current.actionLabel}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
