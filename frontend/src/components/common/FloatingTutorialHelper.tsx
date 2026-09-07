'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  HelpCircle,
  Sparkles,
  Lightbulb,
  X,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  ChevronRight,
  MessageCircleQuestion,
  Gamepad2,
} from 'lucide-react';

export default function FloatingTutorialHelper() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const {
    openTour,
    openPrologue,
    plainEnglishMode,
    togglePlainEnglishMode,
    currentAnalysis,
  } = useAnalysisStore();

  const faqs = [
    {
      q: 'Why does it say ABSTAIN instead of False?',
      a: 'Most fact-checkers guess a binary "False" even when evidence is simply missing or conflicting. TRACEVIDENCE uses Selective Prediction: if uncertainty is high or contradictory claims cancel each other out, it abstains to protect you from being misled by AI hallucinations.',
    },
    {
      q: 'What is an "Echo Chamber Collapse"?',
      a: 'If 10 different newspapers all report the same statistic, but they all cite 1 single press release, that is NOT 10 independent sources! Our TRACE-X engine collapses those 10 copies into 1 origin seed so repetition doesn\'t fool you.',
    },
    {
      q: 'How do I present this to judges at Avishkar?',
      a: 'Click "Avishkar Judge Mode" in the top navbar or visit the Research Dashboard. Emphasize: (1) Deep provenance vs naive citation, (2) Mathematical transparency with T(c), and (3) Selective prediction that drops false-confidence from 31% to 3.2%.',
    },
    {
      q: 'Can I test my own custom statements?',
      a: 'Yes! Go to the "Analyze Workspace", click the "Paste Text / AI Output" tab, type or paste any assertion, and click "Analyze Information".',
    },
  ];

  const getPageSpecificAdvice = () => {
    if (pathname === '/analyze') {
      return {
        title: 'You are in the Workspace',
        tip: 'Click any claim card below to open its line-by-line Mathematical Audit and Provenance Tree!',
        action: 'Inspect a Claim',
      };
    }
    if (pathname === '/graph') {
      return {
        title: 'You are on the Evidence Graph',
        tip: 'Origin seeds are on the left (Cyan), intermediate re-reporters in the middle (Indigo), and end propositions on the right (Emerald). Look for pulsing red links for direct contradictions.',
        action: 'Explore Graph',
      };
    }
    if (pathname === '/research') {
      return {
        title: 'You are on the Research Dashboard',
        tip: 'This page proves the mathematical rigor of TRACEVIDENCE with ablation studies, Macro F1, and ECE calibration curves.',
        action: 'View Metrics',
      };
    }
    return {
      title: 'Welcome to TRACEVIDENCE',
      tip: 'Click any benchmark case to test our deep provenance and decision intelligence pipeline.',
      action: 'Start Exploring',
    };
  };

  const pageAdvice = getPageSpecificAdvice();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Drawer / Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-cyan-500/40 bg-[#0c1322]/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-white">
                  Tutorial & Assistance Hub
                </h4>
                <p className="text-[10px] text-slate-400">
                  Making complex evidence intelligence crystal clear
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                openPrologue(0);
              }}
              className="w-full flex items-center justify-between rounded-xl border-2 border-amber-400 bg-amber-50 p-3 font-mono text-xs font-black text-amber-950 shadow-sm hover:bg-amber-100 transition-all"
            >
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4 text-amber-600 animate-pulse" />
                <span>🎮 Play Training Mission</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                openTour(0);
              }}
              className="w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 font-mono text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-white" />
                <span>Quick Feature Walkthrough</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Plain English Mode Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-black/40 p-3 border border-white/10">
              <div>
                <div className="font-mono text-xs font-semibold text-white">
                  Plain English Mode
                </div>
                <div className="text-[10px] text-slate-400">
                  Swaps formulas with friendly conversational language
                </div>
              </div>
              <button
                onClick={togglePlainEnglishMode}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all border ${
                  plainEnglishMode
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-white/10'
                }`}
              >
                {plainEnglishMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Current Page Context Tip */}
          <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3 text-xs">
            <div className="flex items-center space-x-1.5 font-mono font-bold text-cyan-300 text-[11px]">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span>{pageAdvice.title}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-200 leading-relaxed">
              {pageAdvice.tip}
            </p>
          </div>

          {/* Common Questions Accordion */}
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Common Questions Answered
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-white/5 bg-black/20">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-2 text-left text-[11px] font-medium text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="text-cyan-400 text-xs ml-1">
                      {activeFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div className="p-2 pt-0 text-[10px] text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 rounded-full border border-cyan-500/40 bg-gradient-to-r from-[#0d1424] via-[#101b33] to-[#0d1424] px-4 py-2.5 shadow-xl shadow-cyan-500/20 backdrop-blur-md hover:border-cyan-400 hover:scale-105 transition-all text-white"
        aria-label="Help & Tutorial Hub"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
        </span>
        <span className="font-mono text-xs font-bold tracking-tight text-cyan-300">
          Tutorial & Help
        </span>
        <HelpCircle className="h-4 w-4 text-cyan-400 transition-transform group-hover:rotate-12" />
      </button>
    </div>
  );
}
