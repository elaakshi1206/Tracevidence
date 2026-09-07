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
  } = useAnalysisStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navLinks = [
    { href: '/analyze', label: 'Analyze Workspace', icon: Search },
    { href: '/graph', label: 'Evidence Graph', icon: Network },
    { href: '/research', label: 'Research Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/12 bg-[#0a0e1a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="group flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-blue-500 to-emerald-400 p-[2px] shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#0d1322]">
                <GitBranch className="h-5 w-5 text-white transition-transform group-hover:rotate-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white">
                  TRACE<span className="text-gradient-rbgw font-extrabold">VIDENCE</span>
                </span>
                <span className="rounded-full bg-gradient-to-r from-rose-500/20 via-blue-500/20 to-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-white border border-white/20">
                  v2.4
                </span>
              </div>
              <p className="hidden text-xs text-slate-300 font-medium sm:block">
                TRACE-X Provenance · AIVIDENCE Trust Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1.5 rounded-xl bg-slate-900/80 p-1.5 border border-white/10 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2.5 rounded-lg px-4 py-2 text-sm sm:text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500/20 via-blue-500/25 to-emerald-500/20 text-white border border-white/30 shadow-md shadow-blue-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Interactive Tour, Benchmarks, Judge Mode */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          {/* Interactive Tour Button */}
          <button
            onClick={() => openTour(0)}
            className="flex items-center space-x-2 rounded-xl border border-white/20 bg-gradient-to-r from-rose-500/15 via-blue-500/15 to-emerald-500/15 px-3.5 py-2 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/10 shadow-md transition-all"
            title="Launch comprehensive guided tutorial"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Interactive Tour</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* Quick Demo Case Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-xl border border-white/15 bg-slate-800/90 px-3.5 py-2 text-sm font-semibold text-slate-100 hover:border-white/30 hover:bg-slate-700/90 transition-colors shadow-sm"
            >
              <span className="hidden sm:inline">Benchmarks</span>
              <span className="sm:hidden">Cases</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/15 bg-[#0f172a] p-2.5 shadow-2xl backdrop-blur-2xl z-50"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10">
                  Peer-Reviewed Benchmark Cases
                </div>
                <div className="mt-1.5 space-y-1">
                  {BENCHMARK_CASES.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => loadBenchmarkCase(b.id)}
                      className={`w-full text-left rounded-xl p-2.5 transition-all ${
                        currentAnalysis?.id === b.data.id
                          ? 'bg-blue-950/70 border border-blue-500/50 text-white shadow-sm'
                          : 'hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-blue-400 font-bold">{b.tag}</span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                            b.expectedOutcome === 'TRUST'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : b.expectedOutcome === 'VERIFY'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          }`}
                        >
                          {b.expectedOutcome}
                        </span>
                      </div>
                      <div className="mt-1 font-semibold text-sm text-white truncate">{b.title}</div>
                      <div className="text-xs text-slate-400 truncate">{b.highlightSignal}</div>
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
            className={`flex items-center space-x-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all border ${
              judgeMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 border-white/10 hover:text-white hover:border-white/25'
            }`}
          >
            <Award className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Judge Mode</span>
            <span className="sm:hidden">Judge</span>
          </button>
        </div>
      </div>
    </header>
  );
}
