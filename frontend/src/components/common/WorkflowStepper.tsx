'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { Search, Network, BarChart3, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface WorkflowStepperProps {
  currentStep: 1 | 2 | 3;
}

export default function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const pathname = usePathname();
  const { plainEnglishMode, currentAnalysis } = useAnalysisStore();

  const steps = [
    {
      number: 1,
      path: '/analyze',
      title: plainEnglishMode ? '1. Fact Check' : '1. Claim Analysis',
      subtitle: plainEnglishMode ? 'Extract & verify statements' : 'Deconstruct & score propositions',
      icon: Search,
    },
    {
      number: 2,
      path: '/graph',
      title: plainEnglishMode ? '2. Evidence Map' : '2. Provenance Graph',
      subtitle: plainEnglishMode ? 'See root sources & echo chambers' : 'TRACE-X origin seed collapse',
      icon: Network,
    },
    {
      number: 3,
      path: '/research',
      title: plainEnglishMode ? '3. Research Lab' : '3. Research Benchmark',
      subtitle: plainEnglishMode ? 'Accuracy proofs & test scores' : 'Avishkar validation & ECE metrics',
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 sm:p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Step Progression Breadcrumb */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 shrink-0 hidden md:inline">
            Workflow:
          </span>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <Link
                  href={step.path}
                  className={`group flex items-center space-x-2 rounded-xl px-2.5 sm:px-3 py-1.5 transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                      : isCompleted
                      ? 'text-emerald-700 hover:bg-emerald-50/70 border border-transparent'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.number}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-none">{step.title}</div>
                    <div className="text-[10px] text-slate-500 hidden lg:block mt-0.5 font-normal">
                      {step.subtitle}
                    </div>
                  </div>
                </Link>

                {idx < steps.length - 1 && (
                  <span className="text-slate-300 select-none text-xs">&rarr;</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Transition Action Button */}
        <div className="flex items-center space-x-2 shrink-0 border-t border-slate-100 sm:border-t-0 pt-2 sm:pt-0 justify-end">
          {currentStep === 1 && (
            <Link
              href="/graph"
              className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-all"
            >
              <span>Next: Visual Evidence Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {currentStep === 2 && (
            <>
              <Link
                href="/analyze"
                className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Fact Check</span>
              </Link>
              <Link
                href="/research"
                className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-all"
              >
                <span>Next: Research Lab</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Link
                href="/graph"
                className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Evidence Map</span>
              </Link>
              <Link
                href="/analyze"
                className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-all"
              >
                <span>Test New Claim</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
