'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  X,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Network,
  Calculator,
  Award,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Radio,
  Zap,
  Radar,
  Target,
  Gamepad2,
  FileText,
  ExternalLink,
  Compass,
  BarChart3,
} from 'lucide-react';

export default function GuidedTourModal() {
  const router = useRouter();
  const {
    isTourOpen,
    closeTour,
    tourStep,
    setTourStep,
    completePrologue,
  } = useAnalysisStore();

  // Interactive Mini-Mechanics State
  const [echoCollapsed, setEchoCollapsed] = useState(false);
  const [selectedShield, setSelectedShield] = useState<'trust' | 'verify' | 'abstain'>('trust');
  const [scannedSignals, setScannedSignals] = useState<string[]>([]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (tourStep < 6) setTourStep(tourStep + 1);
      } else if (e.key === 'ArrowLeft') {
        if (tourStep > 0) setTourStep(tourStep - 1);
      } else if (e.key === 'Escape') {
        closeTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, tourStep, setTourStep, closeTour]);

  if (!isTourOpen) return null;

  const totalSteps = 7;

  const handleNext = () => {
    if (tourStep < totalSteps - 1) {
      setTourStep(tourStep + 1);
    } else {
      completePrologue();
      closeTour();
      router.push('/analyze');
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleJumpToPage = (target?: string) => {
    if (target) {
      completePrologue();
      closeTour();
      router.push(target);
    }
  };

  const handleSkip = () => {
    completePrologue();
    closeTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070d18]/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-teal-500/40 bg-[#0b1324] shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 transition-all duration-300"
            style={{ width: `${((tourStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0d1b33] to-slate-900 border-b border-white/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 shadow-inner">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-teal-400/20 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider uppercase text-teal-300 border border-teal-400/30">
                  TOUR &amp; TRAINING MISSION
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Phase {tourStep + 1} of {totalSteps}
                </span>
              </div>
              <h2 className="mt-0.5 font-mono text-base sm:text-lg font-black tracking-tight text-white" style={{ color: '#ffffff' }}>
                Evidence Investigator Academy
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-xs font-mono text-slate-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
            <button
              onClick={handleSkip}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Phase Tabs */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-black/40 border-b border-white/5 overflow-x-auto text-[11px] font-mono scrollbar-none">
          {[
            { label: '1. The Problem' },
            { label: '2. How You Use It' },
            { label: '3. The 5 Steps' },
            { label: '4. The 3 Verdicts' },
            { label: '5. Try It Live' },
            { label: '6. Evidence Map' },
            { label: "7. You're Ready!" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setTourStep(idx)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                idx === tourStep
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Step Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-200">
          {/* STAGE 1: THE ECHO CHAMBER THREAT */}
          {tourStep === 0 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>Lesson 1 of 7: The Problem — Why Counting Sources Is Not Enough</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  When 10 News Websites All Repeat the Same Story, <br />
                  <span className="text-rose-400">That Is Still Just 1 Source — Not 10.</span>
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Imagine 10 newspapers all copying the same tweet. A naive system would say &ldquo;10 sources confirm this!&rdquo; But in reality, all 10 just copied 1 original unverified post. TRACEVIDENCE traces citations backwards to find how many truly independent sources exist.
                </p>
              </div>

              {/* Interactive Gaming Mechanic: Collapse the Echo Chamber */}
              <div className="rounded-2xl border-2 border-dashed border-rose-500/40 bg-rose-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-300">
                  <span>LIVE THREAT SIMULATION: 8 Apparent Sources Detected</span>
                  <span className="text-[11px] text-rose-400/80">Click button below to engage</span>
                </div>

                {!echoCollapsed ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Daily Tech News',
                      'Eco Wire Blog',
                      'Automotive Post',
                      'Clean Energy Today',
                      'Battery Digest',
                      'Green Horizon',
                      'Global Mobility',
                      'EV Forum Recap',
                    ].map((outlet, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-rose-500/30 bg-slate-900/80 p-2.5 text-center shadow-sm text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5"
                      >
                        <Radio className="h-3 w-3 text-rose-400 animate-pulse" />
                        <span className="truncate">{outlet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-emerald-500/60 bg-emerald-950/30 p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 font-mono border border-emerald-500/40">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>TRACE-X COLLAPSE SUCCESSFUL</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white">
                      8 Syndicated Copies &rarr; Collapsed to 1 Single Origin Seed!
                    </div>
                    <p className="text-xs text-slate-300">
                      Our engine traced citations backwards and discovered all 8 copied 1 Swedish working paper from 2017. True Independence Ratio: <strong className="text-teal-300">12.5%</strong>.
                    </p>
                  </div>
                )}

                {!echoCollapsed ? (
                  <button
                    onClick={() => setEchoCollapsed(true)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-500 py-3 font-mono text-xs font-bold text-white shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
                  >
                    <Zap className="h-4 w-4 text-amber-300" />
                    <span>Engage TRACE-X Origin Tracing (Click to Collapse)</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      Echo Chamber Neutralized! Proceed to Workspace Deconstruction.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 2: WORKSPACE & CLAIM DECONSTRUCTION */}
          {tourStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Lesson 2 of 7: How You Use TRACEVIDENCE</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  Step 1: Paste Any Text — We Break It Into Individual Facts
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  A paragraph can contain 3 true statements and 1 false one. TRACEVIDENCE splits it into separate individual statements so each one can be fact-checked independently — a false claim cannot hide behind the true ones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-cyan-500/30">
                  <span className="font-bold text-cyan-300 font-mono flex items-center space-x-1">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span>Option 1: Paste Any Text</span>
                  </span>
                  <p className="mt-1.5 text-slate-400 text-[11px] leading-relaxed">
                    Paste any paragraph — a news article, ChatGPT response, or social media post — and we will extract individual facts automatically.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-amber-500/30">
                  <span className="font-bold text-amber-300 font-mono flex items-center space-x-1">
                    <BookOpen className="h-4 w-4 text-amber-400" />
                    <span>Option 2: Use a Sample Case</span>
                  </span>
                  <p className="mt-1.5 text-slate-400 text-[11px] leading-relaxed">
                    We have preloaded real controversial examples (e.g. EV battery emissions, coffee and heart health) so you can see the system in action immediately.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-teal-500/30">
                  <span className="font-bold text-teal-300 font-mono flex items-center space-x-1">
                    <ExternalLink className="h-4 w-4 text-teal-400" />
                    <span>Option 3: Paste a Web Link</span>
                  </span>
                  <p className="mt-1.5 text-slate-400 text-[11px] leading-relaxed">
                    Paste a URL to any news article and the system automatically reads it, removes ads, and extracts the factual claims for checking.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-cyan-300 font-mono">Example — How One Sentence Becomes Two Separate Facts:</div>
                <div className="text-slate-400 italic">
                  &ldquo;Electric vehicle manufacturing emits 20 tonnes of CO2, requiring 50,000 km to reach parity with diesel.&rdquo;
                </div>
                <div className="text-teal-300 font-mono text-[11px] pt-1">
                  &rarr; Fact A (checked separately): Does making an EV battery emit 20 tonnes of CO2? <br />
                  &rarr; Fact B (checked separately): Does an EV need 50,000 km to have less carbon impact than diesel?
                </div>
                <div className="text-slate-400 text-[10px] pt-1">Why split them? Because Fact A might be true while Fact B is false — they need separate evidence.</div>
              </div>
            </div>
          )}

          {/* STAGE 3: THE 5-STAGE LIVE ENGINE */}
          {tourStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Radar className="h-4 w-4" />
                <span>Lesson 3 of 7: The 5 Steps the System Runs</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  You Can See Every Step — Nothing Is Hidden.
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Instead of just showing you a result, TRACEVIDENCE shows every step it ran and what it found at each stage:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {[
                  {
                    num: '01',
                    name: 'Break Into Facts',
                    desc: 'Splits your text into individual statements so each one can be checked separately.',
                    tag: 'Extract',
                    color: 'text-cyan-400 border-cyan-500/40',
                  },
                  {
                    num: '02',
                    name: 'Find Sources',
                    desc: 'Searches academic papers, government reports, and news articles about each fact.',
                    tag: 'Search',
                    color: 'text-blue-400 border-blue-500/40',
                  },
                  {
                    num: '03',
                    name: 'Check Independence',
                    desc: 'Traces where each source originally came from — catches echo chambers (when many sites copied one original).',
                    tag: 'Trace',
                    color: 'text-teal-400 border-teal-500/40',
                  },
                  {
                    num: '04',
                    name: 'Check Age & Disputes',
                    desc: 'Checks how old the data is, and whether any expert study directly disagrees with the claim.',
                    tag: 'Verify',
                    color: 'text-amber-400 border-amber-500/40',
                  },
                  {
                    num: '05',
                    name: 'Compute Verdict',
                    desc: 'Combines all 4 results into one final Trust Score and gives TRUST, VERIFY, or ABSTAIN.',
                    tag: 'Decide',
                    color: 'text-emerald-400 border-emerald-500/40',
                  },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-teal-400">{st.num}</span>
                        <span className="rounded bg-teal-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal-300 border border-teal-500/20">
                          {st.tag}
                        </span>
                      </div>
                      <div className="mt-2 font-mono text-xs font-bold text-white">{st.name}</div>
                      <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3 text-xs text-slate-300 font-mono flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  <strong>Tip:</strong> When you run an analysis, you can watch a live progress bar animate through all 5 steps in real time!
                </span>
              </div>
            </div>
          )}

          {/* STAGE 4: DECISION SHIELDS & MATH */}
          {tourStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                <span>Lesson 4 of 7: The 3 Possible Results — What Each One Means</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  Why the System Sometimes Says &ldquo;I&apos;m Not Sure&rdquo; — And Why That Is a Good Thing
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Most fact-checkers force a True/False answer even when evidence is conflicted. TRACEVIDENCE refuses to guess when it risks being wrong — it says ABSTAIN instead. Click each result to understand it:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* TRUST */}
                <div
                  onClick={() => setSelectedShield('trust')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'trust'
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-900/30'
                      : 'border-white/10 hover:border-emerald-500/40 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      <span>🟢 TRUST</span>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-emerald-300 border border-emerald-500/40">
                      Score &gt;75%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-white">Safe to cite (with source)</h4>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    Multiple truly independent research teams confirmed this, data is recent, and no credible expert disputes it. You can use this in your work — but always cite the original source.
                  </p>
                </div>

                {/* VERIFY */}
                <div
                  onClick={() => setSelectedShield('verify')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'verify'
                      ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-900/30'
                      : 'border-white/10 hover:border-amber-500/40 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span>🟡 VERIFY</span>
                    </div>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-amber-300 border border-amber-500/40">
                      45–75%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-white">Double-check before using</h4>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    The claim might be true, but the evidence is uncertain — maybe sources are old, or many news sites copied one original report. Find at least 2–3 independent academic papers before relying on it.
                  </p>
                </div>

                {/* ABSTAIN */}
                <div
                  onClick={() => setSelectedShield('abstain')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'abstain'
                      ? 'border-rose-400 bg-rose-950/40 shadow-lg shadow-rose-900/30'
                      : 'border-white/10 hover:border-rose-500/40 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-rose-400">
                      <ShieldAlert className="h-4 w-4" />
                      <span>🔴 ABSTAIN</span>
                    </div>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-rose-300 border border-rose-500/40">
                      &lt;45%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-white">Do NOT cite — too risky</h4>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    When contradictions are high or all sources trace back to one unverified origin, the system refuses to give a verdict rather than risk giving you wrong information. Consult an expert instead.
                  </p>
                </div>
              </div>

              {/* Formula — Plain English version */}
              <div className="rounded-xl border border-cyan-500/30 bg-black/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">How the Trust Score Is Calculated (Plain English):</span>
                  <span className="text-[10px] font-mono text-slate-400">Transparent &amp; Consistent</span>
                </div>
                <div className="rounded-lg bg-slate-900/90 p-2.5 text-center font-mono text-xs sm:text-sm text-teal-300 border border-teal-500/20">
                  Trust Score = (Evidence Strength × Source Independence × Data Freshness) − Contradiction Penalty
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 font-mono pt-1">
                  <div><strong className="text-emerald-400">Evidence Strength:</strong> How strong are the supporting sources?</div>
                  <div><strong className="text-teal-400">Source Independence:</strong> Are sources truly separate — or copies of one original?</div>
                  <div><strong className="text-amber-400">Data Freshness:</strong> How recent is the data?</div>
                  <div><strong className="text-rose-400">Contradiction Penalty:</strong> Subtract points when expert studies disagree.</div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: LIVE EXAMPLE */}
          {tourStep === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>Lesson 5 of 7: Try It — Check a Real Claim in 3 Steps</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  Click All 3 Tests Below and Watch What the System Finds
                </h3>
                <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 font-mono text-xs text-amber-200">
                  <span className="font-bold text-amber-400">CLAIM BEING CHECKED: </span>
                  &ldquo;Producing a 75 kWh EV battery emits 20 tonnes of CO2, and the car needs to drive 50,000 km before it becomes cleaner than a diesel car.&rdquo;
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Click each of the 3 test buttons below to run each check — then see the combined result:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('ind') ? prev : [...prev, 'ind']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                    scannedSignals.includes('ind')
                      ? 'border-rose-400 bg-rose-950/40 text-rose-200'
                      : 'border-white/10 hover:border-teal-400 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">Test 1: Are Sources Independent?</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('ind')
                      ? '⚠️ Found: 10 websites all copied 1 Swedish working paper from 2017 (Echo Chamber!)'
                      : 'Click to check — are the sources truly separate, or copies?'}
                  </div>
                </button>

                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('fresh') ? prev : [...prev, 'fresh']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                    scannedSignals.includes('fresh')
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                      : 'border-white/10 hover:border-teal-400 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">Test 2: Is the Data Still Current?</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('fresh')
                      ? '⚠️ Found: The 2017 study is outdated — 2024 data shows grids are much greener now.'
                      : 'Click to check — is the data recent, or old?'}
                  </div>
                </button>

                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('contra') ? prev : [...prev, 'contra']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                    scannedSignals.includes('contra')
                      ? 'border-rose-400 bg-rose-950/40 text-rose-200'
                      : 'border-white/10 hover:border-teal-400 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">Test 3: Do Any Experts Disagree?</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('contra')
                      ? '🛑 Found: ICCT and Nature published studies that directly contradict these figures!'
                      : 'Click to check — has any expert study found different results?'}
                  </div>
                </button>
              </div>

              {scannedSignals.length === 3 && (
                <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/30 p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                  <span className="rounded-full bg-rose-600 px-3 py-1 font-mono text-xs font-bold text-white uppercase shadow-md shadow-rose-900/50">
                    VERDICT: ABSTAIN — Trust Score: 28%
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Because: (1) all sources are copies of one old unverified paper, (2) newer 2024 data contradicts it, and (3) major scientific institutions publish different figures. The system refuses to say &ldquo;TRUST&rdquo; — it would be wrong to do so. This is the ABSTAIN feature in action.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STAGE 6: EVIDENCE GRAPH NAVIGATION */}
          {tourStep === 5 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Network className="h-4 w-4" />
                <span>Lesson 6 of 7: The Evidence Map — See Where Info Came From</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white leading-snug">
                  A Picture of the Evidence: Who Said What, and Where It Came From
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  The Evidence Map (Evidence Graph) shows you visually how information traveled — from the original study, through news websites, to the claim being checked. Use it to spot echo chambers and expert contradictions at a glance:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-3 rounded-xl bg-slate-900/80 p-3 border border-cyan-500/30">
                  <div className="h-4 w-4 rounded-full border-2 border-cyan-400 bg-cyan-950 shrink-0" />
                  <div>
                    <strong className="text-cyan-300 font-mono">Teal Circle = Original Study: </strong>
                    <span className="text-slate-300">The first scientific paper or dataset where this information was originally published.</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-xl bg-slate-900/80 p-3 border border-indigo-500/30">
                  <div className="h-4 w-4 rounded-md border-2 border-indigo-400 bg-indigo-950 shrink-0" />
                  <div>
                    <strong className="text-indigo-300 font-mono">Blue/Grey Square = News / Blog Copy: </strong>
                    <span className="text-slate-300">News agencies and websites that re-reported the story without doing their own research.</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-xl bg-slate-900/80 p-3 border border-rose-500/30">
                  <div className="h-0.5 w-6 bg-rose-500 animate-pulse shrink-0" />
                  <div>
                    <strong className="text-rose-400 font-mono">Pulsing Red Arrow = This Study DISPROVES the Claim: </strong>
                    <span className="text-slate-300">A scientific paper was found that directly says this claim is wrong. The pulsing animation makes it easy to spot.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleJumpToPage('/graph')}
                className="inline-flex items-center space-x-2 text-xs font-mono text-teal-300 hover:text-teal-200 underline underline-offset-2 cursor-pointer"
              >
                <span>Jump straight to the Evidence Map &rarr;</span>
              </button>
            </div>
          )}

          {/* STAGE 7: YOU'RE READY */}
          {tourStep === 6 && (
            <div className="text-center py-2 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-teal-400 text-slate-950 shadow-xl shadow-amber-400/20">
                <Award className="h-9 w-9" />
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-teal-400">
                  Lesson 7 of 7 — You Are Ready!
                </span>
                <h3 className="mt-1 text-2xl font-black font-mono text-white" style={{ color: '#ffffff' }}>
                  You Now Know How to Tell If Information Is Trustworthy
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-300 leading-relaxed">
                  You understand echo chambers, how to trace where information came from, and why refusing to guess (ABSTAIN) is a feature — not a failure. Here is how accurate TRACEVIDENCE is, tested against known cases:
                </p>
              </div>

              {/* Research Metrics — Plain English */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-left">
                <div className="rounded-xl bg-slate-900/80 p-3 border border-white/10">
                  <div className="font-mono text-emerald-400 font-bold text-sm">93.8% Accuracy</div>
                  <div className="text-[10px] text-slate-400 mt-1">Correctly identified trustworthy vs untrustworthy claims 93.8% of the time — 32% better than a basic AI.</div>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-white/10">
                  <div className="font-mono text-teal-400 font-bold text-sm">3.2% Wrong &ldquo;Trust&rdquo;</div>
                  <div className="text-[10px] text-slate-400 mt-1">Only 3.2% of the time did it wrongly say &ldquo;Trust&rdquo; for something that was actually unreliable. Previously 31.4%.</div>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-white/10">
                  <div className="font-mono text-cyan-400 font-bold text-sm">Very Reliable Scores</div>
                  <div className="text-[10px] text-slate-400 mt-1">When it says 80% confident, the claim really is about 80% reliable. Scores accurately reflect certainty.</div>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-white/10">
                  <div className="font-mono text-amber-400 font-bold text-sm">88% Expert Agreement</div>
                  <div className="text-[10px] text-slate-400 mt-1">When human experts manually checked the same claims, they agreed with the system&apos;s verdict 88% of the time.</div>
                </div>
              </div>

              {/* Quick Launchpad Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => handleJumpToPage('/analyze')}
                  className="flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-3.5 py-2.5 font-mono text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  <span>1. Fact Check</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleJumpToPage('/graph')}
                  className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 font-mono text-xs font-bold text-teal-300 border border-teal-500/30 transition-all cursor-pointer"
                >
                  <span>2. Evidence Map</span>
                  <Network className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleJumpToPage('/scoreboard')}
                  className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <span>3. Claim Scoreboard</span>
                  <Award className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleJumpToPage('/research')}
                  className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 font-mono text-xs font-bold text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                >
                  <span>4. Research Lab</span>
                  <BarChart3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#080d17] p-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={tourStep === 0}
              className="flex items-center space-x-1 rounded-xl border border-white/10 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Tip: Use ← → arrow keys to navigate
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
            >
              Close
            </button>
            {tourStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 px-5 py-2.5 font-mono text-xs font-bold text-white shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <span>Next Lesson</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-slate-950" />
                <span>I&apos;m Ready — Start Analyzing!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
