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
      <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs backdrop-blur-md shadow-2xs">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="font-mono text-blue-900 font-bold">{title}:</span>
          <span className="text-slate-600 hidden sm:inline">Guide is minimized.</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => openTour(0)}
            className="text-xs text-blue-700 hover:text-blue-900 font-mono font-medium underline underline-offset-2"
          >
            Start Full Tour
          </button>
          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all border border-slate-200 shadow-2xs"
          >
            <span>Show Tutorial</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 shadow-sm">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 font-mono text-[11px] font-bold text-blue-800">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>{badge}</span>
          </div>
          <h2 className="mt-2 text-lg sm:text-xl font-bold font-mono tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlainEnglishMode}
            className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold border transition-all ${
              plainEnglishMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggles conversational plain English labels throughout the app"
          >
            {plainEnglishMode ? '✓ Plain English: ON' : 'Plain English Mode'}
          </button>

          <button
            onClick={() => togglePageTutorial(pageKey)}
            className="flex items-center space-x-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Minimize tutorial"
          >
            <span className="text-[11px]">Minimize</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Empathy Statement: Meeting the User Where They Are */}
      <div className="mt-3.5 flex items-start space-x-2.5 rounded-xl bg-blue-50/80 p-3 border border-blue-200 text-xs sm:text-sm">
        <Lightbulb className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <div className="text-slate-700 leading-relaxed">
          <strong className="text-blue-900 font-bold">Feeling overwhelmed? </strong>
          {empathyNote}
        </div>
      </div>

      {/* 3-Step Guided Walkthrough */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((st) => (
          <div
            key={st.number}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col justify-between hover:border-blue-300 hover:bg-white transition-all shadow-2xs"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600 font-mono text-xs font-bold text-white shadow-2xs">
                  {st.number}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{st.title}</h4>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {st.description}
              </p>
            </div>
            {st.highlightAction && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 font-mono text-[11px] text-blue-700 font-semibold flex items-center space-x-1">
                <span>Action:</span>
                <span className="text-slate-800">{st.highlightAction}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Confusion Solved (If provided) */}
      {commonConfusion && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
          <div className="flex items-center space-x-1.5 font-mono font-bold text-amber-800 text-xs">
            <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>COMMON QUESTION: &ldquo;{commonConfusion.question}&rdquo;</span>
          </div>
          <p className="mt-1 text-xs text-slate-700 leading-relaxed pl-5">
            {commonConfusion.answer}
          </p>
        </div>
      )}

      {/* Footer / Tour launcher CTA */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="text-slate-500">
          Want a guided click-by-click walkthrough of the entire system?
        </div>
        <button
          onClick={() => openTour(0)}
          className="btn-gradient-rbgw flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold shadow-2xs"
        >
          <span>Launch Interactive Tour</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
