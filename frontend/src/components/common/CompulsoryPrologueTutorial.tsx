'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import {
  Gamepad2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Layers,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Radar,
  Radio,
  Zap,
  Target,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function CompulsoryPrologueTutorial() {
  const router = useRouter();
  const {
    isPrologueOpen,
    prologueStep,
    setPrologueStep,
    completePrologue,
    openPrologue,
  } = useAnalysisStore();

  // Training mission runs on-demand when clicked from Navbar or Guide
  // Auto-launching modal on load is disabled to avoid confusing new visitors

  // Interactive Mini-Mechanics State
  const [echoCollapsed, setEchoCollapsed] = useState(false);
  const [selectedShield, setSelectedShield] = useState<'trust' | 'verify' | 'abstain' | null>(null);
  const [scannedSignals, setScannedSignals] = useState<string[]>([]);
  const [simulationVerdict, setSimulationVerdict] = useState<string | null>(null);

  if (!isPrologueOpen) return null;

  const totalSteps = 5;

  const handleNextStep = () => {
    if (prologueStep < totalSteps - 1) {
      setPrologueStep(prologueStep + 1);
    } else {
      completePrologue();
      router.push('/analyze');
    }
  };

  const handleSkip = () => {
    if (confirm('Skip Training Level? (You can always replay the tutorial from the top navigation bar)')) {
      completePrologue();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070d18]/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Game HUD Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/20 shadow-inner">
              <Gamepad2 className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider uppercase text-blue-950">
                  COMPULSORY TUTORIAL MISSION
                </span>
                <span className="font-mono text-xs text-blue-200">
                  Level {prologueStep + 1} of {totalSteps}
                </span>
              </div>
              <h2 className="mt-1 font-mono text-base sm:text-lg font-black tracking-tight text-white">
                Evidence Investigator Academy
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-xs font-mono text-blue-200 hover:text-white underline underline-offset-2"
            >
              Skip Training
            </button>
          </div>
        </div>

        {/* HUD Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${((prologueStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Main Mission Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* PHASE 1: THE THREAT - ECHO CHAMBERS */}
          {prologueStep === 0 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-rose-600 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>Mission Objective 01: Unmask The Echo Chamber Threat</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 leading-snug">
                Standard AI Counts 10 Copies as 10 &ldquo;Sources&rdquo;. <br />
                <span className="text-rose-600">That Is How False Rumors Spread.</span>
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                In real life, when 10 different newspapers repeat the exact same claim, chatbots and search engines say:
                <strong className="text-slate-900"> &ldquo;10 independent sources agree!&rdquo;</strong> But in reality, all 10 were just copying 1 single unvetted press release!
              </p>

              {/* Interactive Gaming Mechanic: Collapse the Echo Chamber */}
              <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/60 p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-900">
                  <span>LIVE THREAT SIMULATION: 8 Apparent Sources Detected</span>
                  <span className="text-[11px] text-rose-700">Click weapon below to engage</span>
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
                        className="rounded-xl border border-rose-200 bg-white p-2.5 text-center shadow-sm text-xs font-medium text-slate-700 flex items-center justify-center space-x-1.5"
                      >
                        <Radio className="h-3 w-3 text-rose-500 animate-pulse" />
                        <span className="truncate">{outlet}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 font-mono">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>TRACE-X COLLAPSE SUCCESSFUL</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-900">
                      8 Syndicated Copies &rarr; Collapsed to 1 Single Origin Seed!
                    </div>
                    <p className="text-xs text-slate-600">
                      Our engine traced citations backwards and discovered all 8 copied 1 Swedish working paper from 2017. True Independence Ratio: <strong>12.5%</strong>.
                    </p>
                  </div>
                )}

                {!echoCollapsed ? (
                  <button
                    onClick={() => setEchoCollapsed(true)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 font-mono text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all"
                  >
                    <Zap className="h-4 w-4 text-amber-300" />
                    <span>Engage TRACE-X Origin Tracing (Click to Collapse)</span>
                  </button>
                ) : (
                  <div className="text-center">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      Target Eliminated! Proceed to Weapon Systems.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PHASE 2: WEAPONS & TELEMETRY */}
          {prologueStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs font-bold uppercase tracking-wider">
                <Radar className="h-4 w-4" />
                <span>Mission Objective 02: Master Your 5 Engine Weapons</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 leading-snug">
                Your Tactical Research Radar: The 5-Stage Pipeline
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                TRACEVIDENCE never produces black-box answers. You watch all 5 computational stages execute live on your screen:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {[
                  {
                    num: '01',
                    name: 'Deconstruction',
                    desc: 'Splits complex text into atomic testable claims.',
                    tag: 'Extractor',
                  },
                  {
                    num: '02',
                    name: 'Evidence Crawl',
                    desc: 'Retrieves primary journals, DOIs, & wire reports.',
                    tag: 'Search',
                  },
                  {
                    num: '03',
                    name: 'Origin Lineage',
                    desc: 'Builds tree, calculates source independence ratio.',
                    tag: 'TRACE-X',
                  },
                  {
                    num: '04',
                    name: 'Signal Check',
                    desc: 'Detects outdated science & direct contradictions.',
                    tag: 'Signals',
                  },
                  {
                    num: '05',
                    name: 'Trust Calibration',
                    desc: 'Calculates T(c) and issues TRUST, VERIFY, or ABSTAIN.',
                    tag: 'AIVIDENCE',
                  },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col justify-between hover:border-blue-400 hover:bg-white transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-blue-600">{st.num}</span>
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-800">
                          {st.tag}
                        </span>
                      </div>
                      <div className="mt-2 font-mono text-xs font-bold text-slate-900">{st.name}</div>
                      <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-950 font-mono">
                <span className="font-bold text-blue-700">Pro-Tip for Gamers: </span>
                Every time you hit &ldquo;Analyze Information&rdquo;, watch the live stage bar progress from Stage 1 to Stage 5.
              </div>
            </div>
          )}

          {/* PHASE 3: THE 3 DECISION SHIELDS */}
          {prologueStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-emerald-600 font-mono text-xs font-bold uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                <span>Mission Objective 03: Equip The 3 Decision Shields</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 leading-snug">
                Why A Good Player Refuses to Guess: <br />
                <span className="text-blue-600">The Power of Selective Prediction</span>
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Click each of the 3 shields below to understand their defense role:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* TRUST */}
                <div
                  onClick={() => setSelectedShield('trust')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'trust'
                      ? 'border-emerald-600 bg-emerald-50 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                      <span>TRUST SHIELD</span>
                    </div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-black text-emerald-800">
                      &gt;75%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-slate-900">Green Light / Safe to Rely</h4>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    Multiple independent primary origins agree, facts are current, zero credible disputes.
                  </p>
                </div>

                {/* VERIFY */}
                <div
                  onClick={() => setSelectedShield('verify')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'verify'
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-slate-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>VERIFY SHIELD</span>
                    </div>
                    <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-black text-amber-800">
                      45 - 75%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-slate-900">Caution / Check Sources</h4>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    Plausible or partially accurate, but relies on secondary press coverage or older research.
                  </p>
                </div>

                {/* ABSTAIN */}
                <div
                  onClick={() => setSelectedShield('abstain')}
                  className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                    selectedShield === 'abstain'
                      ? 'border-rose-600 bg-rose-50 shadow-md'
                      : 'border-slate-200 hover:border-rose-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-rose-700">
                      <ShieldAlert className="h-4 w-4" />
                      <span>ABSTAIN SHIELD</span>
                    </div>
                    <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-black text-rose-800">
                      &lt;45%
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-slate-900">Refusal / Hallucination Block</h4>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-rose-700">The crown jewel:</strong> The engine refuses to guess under high conflict or circular echo chambers.
                  </p>
                </div>
              </div>

              {selectedShield && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-slate-700 animate-in fade-in duration-150">
                  <span className="font-bold text-blue-900">Shield Selected: </span>
                  {selectedShield === 'trust' && 'Deploy TRUST when you need rock-solid citations for academic papers or executive decisions.'}
                  {selectedShield === 'verify' && 'Deploy VERIFY when you need to read the direct snippet cards to confirm context.'}
                  {selectedShield === 'abstain' && 'Deploy ABSTAIN when you need to alert users that AI or media reports are hallucinating fake consensus.'}
                </div>
              )}
            </div>
          )}

          {/* PHASE 4: COMBAT SIMULATION */}
          {prologueStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center space-x-2 text-indigo-600 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="h-4 w-4" />
                <span>Mission Objective 04: Live Combat Simulation</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 leading-snug">
                Audit A Real-World Statement in 3 Clicks
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-4 font-mono text-xs leading-relaxed">
                <span className="text-amber-400 font-bold">TARGET PROPOSITION: </span>
                &ldquo;Producing a 75 kWh EV battery emits 20 tonnes of CO2 equivalent, requiring 50,000 km to break even.&rdquo;
              </div>

              <p className="text-xs text-slate-600">
                Click all 3 scanner tests below to run your telemetry:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('ind') ? prev : [...prev, 'ind']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    scannedSignals.includes('ind')
                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-slate-200 hover:border-blue-400 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">1. Scan Independence</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('ind')
                      ? '⚠️ 10 Reprints -> 1 Swedish Origin (Warning!)'
                      : 'Click to test origin diversity'}
                  </div>
                </button>

                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('fresh') ? prev : [...prev, 'fresh']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    scannedSignals.includes('fresh')
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-slate-200 hover:border-blue-400 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">2. Scan Freshness</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('fresh')
                      ? '⚠️ Outdated: 2017 study superseded by 2024 grid greening'
                      : 'Click to test date decay'}
                  </div>
                </button>

                <button
                  onClick={() =>
                    setScannedSignals((prev) =>
                      prev.includes('contra') ? prev : [...prev, 'contra']
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    scannedSignals.includes('contra')
                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-slate-200 hover:border-blue-400 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">3. Scan Contradictions</div>
                  <div className="mt-1 text-[11px]">
                    {scannedSignals.includes('contra')
                      ? '🛑 Direct Conflict: ICCT & Nature studies refute this!'
                      : 'Click to test counter-evidence'}
                  </div>
                </button>
              </div>

              {scannedSignals.length === 3 && (
                <div className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
                  <span className="rounded-full bg-rose-600 px-3 py-1 font-mono text-xs font-bold text-white uppercase">
                    AIVIDENCE DECISION: ABSTAIN (TRUST SCORE: 28%)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Because the statement relies on a single outdated origin and is refuted by newer literature, TRACEVIDENCE mathematically withholds a positive verdict. <strong>Hallucination prevented!</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PHASE 5: GRADUATION & FREE PLAY */}
          {prologueStep === 4 && (
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 shadow-xl shadow-amber-400/20">
                <Award className="h-9 w-9" />
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                  Training Level Complete
                </span>
                <h3 className="mt-1 text-2xl font-extrabold font-mono text-slate-900">
                  Certification Earned: Level 1 Evidence Investigator
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed">
                  You now possess the foundational knowledge of deep evidence provenance, origin collapse, and selective prediction. You are ready to analyze any statement or presentation in free play!
                </p>
              </div>

              {/* Player Quick Controls Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-slate-900 font-mono">Analyze Workspace:</span>
                  <p className="mt-1 text-slate-600 text-[11px]">
                    Paste any proposition or load benchmark demo cases.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-slate-900 font-mono">Evidence Graph:</span>
                  <p className="mt-1 text-slate-600 text-[11px]">
                    Explore 2D nodes, origin seeds, and flashing contradiction links.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-bold text-slate-900 font-mono">Research Dashboard:</span>
                  <p className="mt-1 text-slate-600 text-[11px]">
                    Present empirical benchmarks (ECE, FCR, Macro F1) to judges.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* HUD Footer Controls */}
        <div className="border-t border-slate-200 bg-slate-50/80 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPrologueStep(Math.max(0, prologueStep - 1))}
              disabled={prologueStep === 0}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
            >
              Previous Phase
            </button>
            <span className="font-mono text-xs text-slate-400">
              Phase {prologueStep + 1} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {prologueStep < totalSteps - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 font-mono text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all"
              >
                <span>Continue Training</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 px-7 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-600/25 transition-all"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Complete Training & Enter Free Play</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
