'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  GitBranch,
  Network,
  BarChart3,
  Sparkles,
  Search,
  Award,
  Gamepad2,
  HelpCircle,
  Menu,
  X,
  Languages,
  FlaskConical,
  MoreHorizontal,
  BookOpen,
  Play,
  Map,
  ChevronDown,
  Zap,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    openTour,
    openPrologue,
    plainEnglishMode,
    togglePlainEnglishMode,
  } = useAnalysisStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + TRACEVIDENCE + Version */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link href="/" className="group flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e] text-white shadow-md shadow-teal-900/10 transition-transform group-hover:scale-105">
              <GitBranch className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-lg font-black tracking-tight text-[#0f172a]">
                  TRACE<span className="text-[#0f766e]">VIDENCE</span>
                </span>
                <span className="rounded-md bg-teal-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0f766e] border border-teal-200">
                  v2.4
                </span>
              </div>
              <p className="hidden text-[11px] text-[#475569] sm:block">
                Evidence Provenance &amp; Uncertainty Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/70">
          {/* Step 1: Fact Check */}
          <Link
            href="/analyze"
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === '/analyze'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Search className={`h-3.5 w-3.5 ${pathname === '/analyze' ? 'text-[#0f766e]' : 'text-slate-500'}`} />
            <span>1. Fact Check</span>
          </Link>

          {/* Step 2: Evidence Map */}
          <Link
            href="/graph"
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === '/graph'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Network className={`h-3.5 w-3.5 ${pathname === '/graph' ? 'text-[#0f766e]' : 'text-slate-500'}`} />
            <span>2. Evidence Map</span>
          </Link>

          {/* Step 3: Claim Scoreboard */}
          <Link
            href="/scoreboard"
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === '/scoreboard'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Award className={`h-3.5 w-3.5 ${pathname === '/scoreboard' ? 'text-[#0f766e]' : 'text-slate-500'}`} />
            <span>3. Claim Scoreboard</span>
          </Link>

          {/* Step 4: Research Lab (Advanced) */}
          <Link
            href="/research"
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              pathname === '/research'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className={`h-3.5 w-3.5 ${pathname === '/research' ? 'text-[#0f766e]' : 'text-slate-500'}`} />
            <span>4. Research Lab</span>
            <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-mono font-bold text-amber-800 border border-amber-200">
              Adv
            </span>
          </Link>
        </nav>

        {/* Right Side: Plain English toggle + More ⋯ dropdown */}
        <div className="hidden lg:flex items-center space-x-2 shrink-0">
          <button
            onClick={togglePlainEnglishMode}
            className={`flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
              plainEnglishMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-teal-50 text-[#0f766e] border-teal-300 hover:bg-teal-100'
            }`}
            title="Toggle between everyday Plain English and formal Academic/Technical terminology"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{plainEnglishMode ? 'Plain English' : 'Tech English'}</span>
          </button>

          {/* ⋯ More dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                moreMenuOpen
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="More options: Tour, Training, Benchmarks, Examples"
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>More</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-fade-in">
                {/* Section: Get Started */}
                <div className="px-3 pt-3 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Get Started</span>
                </div>

                <button
                  onClick={() => { openTour(0); setMoreMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-[#0f766e] transition-colors text-left group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 shrink-0 group-hover:bg-teal-100 transition-colors">
                    <Sparkles className="h-4 w-4 text-[#0f766e]" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-[#0f766e]">Tour &amp; Training</div>
                    <div className="text-[11px] text-slate-500 font-normal">Interactive walkthrough &amp; mission</div>
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-slate-100 mx-3 my-1" />

                {/* Section: Research & Evaluation */}
                <div className="px-3 pt-1 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Research &amp; Evaluation</span>
                </div>

                {/* Dedicated Test Lab & Experiment Cases */}
                <Link
                  href="/experiments"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 shrink-0 group-hover:bg-teal-100 transition-colors">
                    <FlaskConical className="h-4 w-4 text-teal-700" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-slate-800 group-hover:text-teal-800">
                      <span>Experiment Cases</span>
                      <span className="rounded bg-teal-100 px-1 py-0.2 text-[9px] font-mono font-bold text-teal-800 border border-teal-300">
                        50 Tests
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Difficult test lab &amp; self-learning</div>
                  </div>
                </Link>

                <Link
                  href="/benchmarks"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 shrink-0">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Benchmarks</div>
                    <div className="text-[11px] text-slate-500 font-normal">Accuracy tests &amp; proofs</div>
                  </div>
                </Link>

                <Link
                  href="/research?tab=benchmarks"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 shrink-0">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Case Library</div>
                    <div className="text-[11px] text-slate-500 font-normal">Pre-analyzed example cases</div>
                  </div>
                </Link>

                <Link
                  href="/research?tab=datasetEvaluator"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 mb-1 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 shrink-0">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Pre-done Evaluations</div>
                    <div className="text-[11px] text-slate-500 font-normal">Live dataset evaluation runner</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={togglePlainEnglishMode}
            className="rounded-lg px-2 py-1 border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            {plainEnglishMode ? 'Plain' : 'Tech'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <Link
            href="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Search className="h-4 w-4 text-[#0f766e]" />
            <span>1. Fact Check</span>
          </Link>

          <Link
            href="/graph"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Network className="h-4 w-4 text-[#0f766e]" />
            <span>2. Evidence Map</span>
          </Link>

          <Link
            href="/scoreboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Award className="h-4 w-4 text-[#0f766e]" />
            <span>3. Claim Scoreboard</span>
          </Link>

          <Link
            href="/research"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <div className="flex items-center space-x-2.5">
              <BarChart3 className="h-4 w-4 text-[#0f766e]" />
              <span>4. Research Lab</span>
            </div>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 border border-amber-200">
              Advanced
            </span>
          </Link>

          <Link
            href="/experiments"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-teal-50"
          >
            <div className="flex items-center space-x-2.5">
              <FlaskConical className="h-4 w-4 text-[#0f766e]" />
              <span>Experiment Cases</span>
            </div>
            <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-teal-800 border border-teal-200">
              50 Tests
            </span>
          </Link>

          <Link
            href="/benchmarks"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <BarChart3 className="h-4 w-4 text-[#0f766e]" />
            <span>Benchmarks</span>
          </Link>

          <div className="border-t border-slate-100 pt-2 space-y-2">
            <button
              onClick={() => {
                openTour(0);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900"
            >
              <Sparkles className="h-4 w-4 text-[#0f766e]" />
              <span>Tour &amp; Training</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
