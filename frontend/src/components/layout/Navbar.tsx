'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { BENCHMARK_CASES } from '@/lib/benchmarks/demoCases';
import {
  ShieldCheck,
  GitBranch,
  Network,
  BarChart3,
  Sparkles,
  Search,
  Award,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    judgeMode,
    toggleJudgeMode,
    loadBenchmarkCase,
    currentAnalysis,
    openTour,
    plainEnglishMode,
    togglePlainEnglishMode,
  } = useAnalysisStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navLinks = [
    { href: '/analyze', label: 'Analyze Workspace', icon: Search },
    { href: '/graph', label: 'Evidence Graph', icon: Network },
    { href: '/research', label: 'Research Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="group flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0d111c]">
                <GitBranch className="h-4 w-4 text-cyan-400 transition-transform group-hover:rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-lg font-black tracking-tight text-white">
                  TRACE<span className="text-cyan-400">VIDENCE</span>
                </span>
                <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 border border-cyan-800/60">
                  v2.4
                </span>
              </div>
              <p className="hidden text-[10px] text-slate-400 sm:block">
                TRACE-X Provenance · AIVIDENCE Trust Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-lg bg-slate-900/60 p-1 border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Interactive Tour, Plain English Toggle, Benchmarks, Judge Mode */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Interactive Tour Button */}
          <button
            onClick={() => openTour(0)}
            className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-2.5 py-1.5 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-900/60 shadow-sm shadow-cyan-500/10 transition-all"
            title="Launch comprehensive guided tutorial"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Interactive Tour</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* Quick Demo Case Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-700/80 transition-colors"
            >
              <span className="hidden sm:inline">Benchmarks</span>
              <span className="sm:hidden">Cases</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#0d111c] p-2 shadow-2xl backdrop-blur-xl z-50"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
                  Peer-Reviewed Benchmark Cases
                </div>
                <div className="mt-1 space-y-1">
                  {BENCHMARK_CASES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => loadBenchmarkCase(b.id)}
                      className={`w-full text-left rounded-lg p-2 transition-all ${
                        currentAnalysis?.id === b.data.id
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{b.tag}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            b.expectedOutcome === 'TRUST'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : b.expectedOutcome === 'VERIFY'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          }`}
                        >
                          {b.expectedOutcome}
                        </span>
                      </div>
                      <div className="mt-0.5 font-medium text-xs text-white truncate">{b.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{b.highlightSignal}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avishkar Judge Mode Badge */}
          <button
            onClick={toggleJudgeMode}
            title="Toggle Research Judge & Evaluation Mode"
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border ${
              judgeMode
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Judge Mode</span>
            <span className="sm:hidden">Judge</span>
          </button>
        </div>
      </div>
    </header>
  );
}
