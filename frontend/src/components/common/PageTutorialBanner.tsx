'use client';

import React from 'react';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export interface PageTutorialStep {
  number: number;
  title: string;
  description: string;
  highlightAction?: string;
}

export interface PageTutorialBannerProps {
  pageKey: string;
  badge?: string;
  title: string;
  subtitle: string;
  empathyNote: string;
  steps: PageTutorialStep[];
  commonConfusion?: {
    question: string;
    answer: string;
  };
}

export default function PageTutorialBanner({
  pageKey,
  badge = 'Interactive Guide & Tutorial',
  title,
  subtitle,
  empathyNote,
  steps,
  commonConfusion,
}: PageTutorialBannerProps) {
  const {
    dismissedPageTutorials,
    togglePageTutorial,
    openTour,
    plainEnglishMode,
    togglePlainEnglishMode,
  } = useAnalysisStore();

  const isCollapsed = !!dismissedPageTutorials[pageKey];

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-xs backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-cyan-300 font-semibold">{title}:</span>
          <span className="text-slate-400 hidden sm:inline">Guide is minimized.</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openTour(0)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-medium underline underline-offset-2"
          >
            Start Full Tour
          </button>
          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all border border-cyan-500/30"
          >
            <span>Show Tutorial</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1322] via-[#0d172b] to-[#070b14] p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 shadow-sm shadow-cyan-500/10">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>{badge}</span>
          </div>
          <h2 className="mt-2 text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-300">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlainEnglishMode}
            className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold border transition-all ${
              plainEnglishMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
            title="Toggles conversational plain English labels throughout the app"
          >
            {plainEnglishMode ? '✓ Plain English: ON' : 'Plain English Mode'}
          </button>

          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1 rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Minimize tutorial"
          >
            <span className="text-[11px]">Minimize</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Empathy Statement: Meeting the User Where They Are */}
      <div className="mt-3 flex items-start space-x-2.5 rounded-xl bg-cyan-950/40 p-3 border border-cyan-500/20 text-xs">
        <Lightbulb className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
        <div className="text-slate-200 leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Feeling overwhelmed? </strong>
          {empathyNote}
        </div>
      </div>

      {/* 3-Step Guided Walkthrough */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((st) => (
          <div
            key={st.number}
            className="rounded-xl border border-white/10 bg-black/30 p-3.5 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300">
                  {st.number}
                </span>
                <h4 className="text-xs font-bold text-white font-mono">{st.title}</h4>
              </div>
              <p className="mt-2 text-[11px] text-slate-300 leading-relaxed">
                {st.description}
              </p>
            </div>
            {st.highlightAction && (
              <div className="mt-2.5 pt-2 border-t border-white/5 font-mono text-[10px] text-cyan-400 font-semibold flex items-center space-x-1">
                <span>Action:</span>
                <span className="text-slate-200">{st.highlightAction}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Confusion Solved (If provided) */}
      {commonConfusion && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200/90">
          <div className="flex items-center space-x-2 font-mono font-bold text-amber-300 text-[11px]">
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>COMMON QUESTION: &ldquo;{commonConfusion.question}&rdquo;</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300 leading-relaxed pl-5">
            {commonConfusion.answer}
          </p>
        </div>
      )}

      {/* Footer / Tour launcher CTA */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
        <div className="text-[11px] text-slate-400">
          Want a guided click-by-click walkthrough of the entire system?
        </div>
        <button
          onClick={() => openTour(0)}
          className="flex items-center space-x-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition-all"
        >
          <span>Launch Interactive System Tour</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
