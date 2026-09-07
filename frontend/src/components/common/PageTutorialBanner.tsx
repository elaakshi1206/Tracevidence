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
      <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-gradient-to-r from-blue-950/40 to-emerald-950/40 px-5 py-3 text-sm backdrop-blur-xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <Lightbulb className="h-4 w-4 text-amber-300" />
          <span className="font-mono text-white font-bold">{title}:</span>
          <span className="text-slate-300 hidden sm:inline">Guide is minimized.</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => openTour(0)}
            className="text-xs sm:text-sm text-blue-300 hover:text-white font-mono font-semibold underline underline-offset-2"
          >
            Start Full Tour
          </button>
          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <span>Show Tutorial</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#121b30] via-[#0f172a] to-[#0a0e1a] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/12 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/25 bg-gradient-to-r from-rose-500/20 via-blue-500/20 to-emerald-500/20 px-3.5 py-1 font-mono text-xs font-bold text-white shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{badge}</span>
          </div>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-300">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlainEnglishMode}
            className={`rounded-xl px-3.5 py-2 font-mono text-xs sm:text-sm font-bold border transition-all ${
              plainEnglishMode
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 shadow-md'
                : 'bg-slate-800 text-slate-200 border-white/15 hover:bg-slate-700'
            }`}
            title="Toggles conversational plain English labels throughout the app"
          >
            {plainEnglishMode ? '✓ Plain English: ON' : 'Plain English Mode'}
          </button>

          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-slate-300 hover:text-white border border-white/15 transition-colors"
            title="Minimize tutorial"
          >
            <span>Minimize</span>
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Empathy Statement: Meeting the User Where They Are */}
      <div className="mt-4 flex items-start space-x-3 rounded-2xl bg-blue-950/40 p-4 border border-blue-500/30 text-sm sm:text-base">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-300 mt-0.5" />
        <div className="text-slate-200 leading-relaxed">
          <strong className="text-white font-bold">Feeling overwhelmed? </strong>
          {empathyNote}
        </div>
      </div>

      {/* 3-Step Guided Walkthrough */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((st) => (
          <div
            key={st.number}
            className="rounded-2xl border border-white/12 bg-black/40 p-5 flex flex-col justify-between hover:border-white/30 transition-all shadow-md"
          >
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-blue-500 to-emerald-400 font-mono text-xs font-black text-white shadow-md">
                  {st.number}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white font-mono">{st.title}</h4>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {st.description}
              </p>
            </div>
            {st.highlightAction && (
              <div className="mt-3.5 pt-2.5 border-t border-white/10 font-mono text-xs text-blue-300 font-bold flex items-center space-x-1.5">
                <span>Action:</span>
                <span className="text-white">{st.highlightAction}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Confusion Solved (If provided) */}
      {commonConfusion && (
        <div className="mt-5 rounded-2xl border border-amber-500/35 bg-amber-950/25 p-4 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
          <div className="flex items-center space-x-2 font-mono font-bold text-amber-300 text-xs sm:text-sm">
            <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>COMMON QUESTION: &ldquo;{commonConfusion.question}&rdquo;</span>
          </div>
          <p className="mt-1.5 pl-6 text-slate-200">
            {commonConfusion.answer}
          </p>
        </div>
      )}

      {/* Footer / Tour launcher CTA */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/12 text-sm">
        <div className="text-xs sm:text-sm text-slate-300">
          Want a guided click-by-click walkthrough of the entire system?
        </div>
        <button
          onClick={() => openTour(0)}
          className="btn-gradient-rbgw flex items-center space-x-2 rounded-xl px-5 py-2.5 font-mono text-xs sm:text-sm font-bold shadow-md"
        >
          <span>Launch Interactive System Tour</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
