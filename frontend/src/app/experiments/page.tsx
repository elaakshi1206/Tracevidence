'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Brain,
  Sparkles,
  Search,
  Filter,
  Layers,
  BarChart3,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
  Zap,
  TrendingUp,
  Sliders,
  Check,
  RefreshCw,
  X,
  Target,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';
import DecisionBadge from '@/components/common/DecisionBadge';
import { EXPERIMENT_TEST_CASES } from '@/lib/benchmarks/experimentCasesData';
import {
  ExperimentTestCase,
  TestCaseRunResult,
  TestCaseCategory,
  TestCaseDifficulty,
  TestCaseDomain,
  PipelineStageFailure,
  LearnedCorrectionMemory,
} from '@/types/experiments';
import {
  runSingleTestCase,
  computeSuiteMetrics,
} from '@/lib/engine/experimentEvaluator';
import {
  getLearnedMemories,
  storeLearnedCorrection,
  toggleLearnedMemoryActive,
  deleteLearnedMemory,
  resetLearnedMemories,
} from '@/lib/engine/continuousLearningEngine';

export default function ExperimentsPage() {
  // Test cases & results state
  const [testCases] = useState<ExperimentTestCase[]>(EXPERIMENT_TEST_CASES);
  const [results, setResults] = useState<Record<string, TestCaseRunResult>>({});
  const [runningCaseId, setRunningCaseId] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Filtering & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Modal & Drawer states
  const [inspectCase, setInspectCase] = useState<ExperimentTestCase | null>(null);
  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [learnedMemories, setLearnedMemories] = useState<LearnedCorrectionMemory[]>([]);
  const [learningAppliedNotice, setLearningAppliedNotice] = useState<string | null>(null);

  // Load results from localStorage on mount if available
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('tracevidence_test_lab_results_v1');
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      }
    } catch (e) {
      console.warn('Could not load cached experiment results:', e);
    }
    setLearnedMemories(getLearnedMemories());
  }, []);

  // Save results to localStorage whenever they change
  const saveResults = (newResults: Record<string, TestCaseRunResult>) => {
    setResults(newResults);
    try {
      localStorage.setItem('tracevidence_test_lab_results_v1', JSON.stringify(newResults));
    } catch (e) {
      console.warn('Could not save experiment results to localStorage:', e);
    }
  };

  // Refresh memories from store
  const refreshMemories = () => {
    setLearnedMemories(getLearnedMemories());
  };

  // Run a single test case
  const handleRunSingle = async (tc: ExperimentTestCase) => {
    setRunningCaseId(tc.id);
    try {
      const prevResult = results[tc.id];
      const result = await runSingleTestCase(tc, { withLearnedFeedback: true }, prevResult);
      const updated = { ...results, [tc.id]: result };
      saveResults(updated);
      refreshMemories();
    } catch (err) {
      console.error('Error running test case:', err);
    } finally {
      setRunningCaseId(null);
    }
  };

  // Batch run all (or filtered/unrun) test cases
  const handleRunAll = async (targetCases?: ExperimentTestCase[]) => {
    const listToRun = targetCases || testCases;
    setIsBatchRunning(true);
    setBatchProgress({ current: 0, total: listToRun.length });

    let currentResults = { ...results };

    for (let i = 0; i < listToRun.length; i++) {
      const tc = listToRun[i];
      setBatchProgress({ current: i + 1, total: listToRun.length });
      try {
        const prevResult = currentResults[tc.id];
        const res = await runSingleTestCase(tc, { withLearnedFeedback: true }, prevResult);
        currentResults = { ...currentResults, [tc.id]: res };
        saveResults(currentResults);
      } catch (err) {
        console.warn(`Error running case ${tc.id}:`, err);
      }
      // Small tick for UI responsiveness
      await new Promise(r => setTimeout(r, 60));
    }

    setIsBatchRunning(false);
    refreshMemories();
  };

  // Run failed only
  const handleRunFailedOnly = () => {
    const failedCases = testCases.filter(tc => results[tc.id]?.status === 'FAILED');
    if (failedCases.length > 0) {
      handleRunAll(failedCases);
    }
  };

  // Reset all runs
  const handleResetRuns = () => {
    if (confirm('Are you sure you want to reset all test run results? Stored learning memories will be preserved.')) {
      saveResults({});
    }
  };

  // Self-Correction: Apply learned correction to memory and retry!
  const handleApplyCorrectionAndRetry = async (tc: ExperimentTestCase) => {
    const currentRes = results[tc.id];
    if (!currentRes) return;

    const failedStage = currentRes.failedStage || 'Stage 5: Final Decision Calibration';
    storeLearnedCorrection(tc, failedStage, currentRes.systemDecision);
    refreshMemories();

    setLearningAppliedNotice(`Corrective rule created for "${tc.targetEntity}". Retrying case with learned memory...`);

    // Retry the case with learned feedback
    const retriedRes = await runSingleTestCase(tc, { withLearnedFeedback: true }, currentRes);
    saveResults({ ...results, [tc.id]: retriedRes });

    setTimeout(() => {
      setLearningAppliedNotice(null);
    }, 4000);
  };

  // Toggle active status of a learned memory
  const handleToggleMemory = (id: string) => {
    toggleLearnedMemoryActive(id);
    refreshMemories();
  };

  // Delete a learned memory
  const handleDeleteMemory = (id: string) => {
    deleteLearnedMemory(id);
    refreshMemories();
  };

  // Reset memories to demonstration seeds
  const handleResetMemories = () => {
    resetLearnedMemories();
    refreshMemories();
  };

  // Export results as JSON
  const handleExportJson = () => {
    const metrics = computeSuiteMetrics(testCases, results);
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      system: 'TRACEVIDENCE v2.4 Test Lab & Continuous Learning Engine',
      metrics,
      learnedMemories,
      testCaseResults: Object.values(results),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracevidence-experiment-results-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute metrics
  const metrics = useMemo(() => computeSuiteMetrics(testCases, results), [testCases, results]);

  // Unique categories, difficulties, domains for filters
  const categories = useMemo(() => {
    const set = new Set(testCases.map(tc => tc.category));
    return ['ALL', ...Array.from(set)];
  }, [testCases]);

  const difficulties = ['ALL', 'Easy', 'Medium', 'Hard'];

  const domains = useMemo(() => {
    const set = new Set(testCases.map(tc => tc.domain));
    return ['ALL', ...Array.from(set)];
  }, [testCases]);

  // Filtered test cases
  const filteredCases = useMemo(() => {
    return testCases.filter(tc => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          tc.claim.toLowerCase().includes(q) ||
          tc.targetEntity.toLowerCase().includes(q) ||
          tc.id.toLowerCase().includes(q) ||
          tc.explanation.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && tc.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && tc.difficulty !== selectedDifficulty) {
        return false;
      }

      // Domain filter
      if (selectedDomain !== 'ALL' && tc.domain !== selectedDomain) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL') {
        const res = results[tc.id];
        if (selectedStatus === 'PASSED' && res?.status !== 'PASSED') return false;
        if (selectedStatus === 'FAILED' && res?.status !== 'FAILED') return false;
        if (selectedStatus === 'UNRUN' && res !== undefined) return false;
        if (selectedStatus === 'LEARNED_IMPROVED' && !res?.improvedAfterCorrection) return false;
      }

      return true;
    });
  }, [testCases, results, searchQuery, selectedCategory, selectedDifficulty, selectedDomain, selectedStatus]);

  // Stage failures total count for bar percentage
  const totalFailures = metrics.failedCount;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-900">
      {/* ── Top Header Banner ────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white pt-8 pb-7 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-700/20">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                      Experiment Cases <span className="text-teal-700">&amp; Test Lab</span>
                    </h1>
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-mono font-bold text-teal-800 border border-teal-200">
                      50 Challenging Benchmarks
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                    Empirical testing harness, 5-stage failure diagnosis, and continuous self-correction feedback loop for judges and evaluators.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setMemoryDrawerOpen(true)}
                className="flex items-center space-x-2 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-800 shadow-2xs hover:bg-purple-100 transition-colors cursor-pointer"
                title="View active continuous learning memory rules"
              >
                <Brain className="h-4 w-4 text-purple-700" />
                <span>Learning Memory ({learnedMemories.filter(m => m.active).length})</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Download full benchmark evaluation report in JSON"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Alert notice if learning applied */}
          {learningAppliedNotice && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-purple-50 p-3.5 border border-purple-200 text-xs text-purple-900 animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
                <span className="font-semibold">{learningAppliedNotice}</span>
              </div>
              <button onClick={() => setLearningAppliedNotice(null)} className="text-purple-600 hover:text-purple-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Key Metrics Scoreboard ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Overall Accuracy Rate */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Accuracy</span>
              <div className="rounded-lg bg-teal-50 p-1.5 text-teal-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {metrics.executedCount > 0 ? `${metrics.accuracyRate}%` : '—'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ({metrics.passedCount}/{metrics.executedCount || 50})
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-600">
              {metrics.executedCount === 0
                ? 'Run test suite to measure baseline'
                : metrics.accuracyRate >= 85
                ? 'High Epistemic Calibration Rigor'
                : 'Active Self-Correction Recommended'}
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${metrics.accuracyRate || 0}%` }}
              />
            </div>
          </div>

          {/* Card 2: Passed Cases */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Passed (Correct)</span>
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-emerald-700 font-mono">{metrics.passedCount}</span>
              <span className="text-xs text-slate-500 font-medium">cases aligned</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              Matches gold standard selective prediction verdict (TRUST / VERIFY / ABSTAIN).
            </p>
          </div>

          {/* Card 3: Failed Cases */}
          <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Failed (Misaligned)</span>
              <div className="rounded-lg bg-rose-50 p-1.5 text-rose-700">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-rose-700 font-mono">{metrics.failedCount}</span>
              <span className="text-xs text-slate-500 font-medium">require learning</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              Failures automatically pinpointed to exact pipeline stage for self-correction.
            </p>
          </div>

          {/* Card 4: Unrun Cases */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unrun Benchmarks</span>
              <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-slate-700 font-mono">{metrics.unrunCount}</span>
              <span className="text-xs text-slate-500 font-medium">pending run</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              50 total curated multidisciplinary test cases ready for evaluation.
            </p>
          </div>

          {/* Card 5: Continuous Learning Memories */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Learned Directives</span>
              <div className="rounded-lg bg-purple-100 p-1.5 text-purple-700">
                <Brain className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-purple-800 font-mono">
                {metrics.activeLearnedMemoriesCount}
              </span>
              <span className="text-xs text-purple-600 font-medium">active rules</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-purple-700 font-medium">Self-correction rules</span>
              <button
                onClick={() => setMemoryDrawerOpen(true)}
                className="font-bold text-purple-700 underline hover:text-purple-900 cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-Stage Failure Breakdown Visualizer ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-700" />
                Pipeline Stage Failure Attribution
              </h2>
              <p className="text-[11px] text-slate-500">
                Identifies which stage failed when a claim is marked Wrong (Extraction, Retrieval, Matching, Provenance, or Decision).
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-slate-600">
              Total Failures Diagnosed: {totalFailures}
            </div>
          </div>

          {/* Interactive Bar Chart / Distribution */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              {
                stage: 'Stage 1: Claim Extraction' as PipelineStageFailure,
                label: '1. Extraction',
                desc: 'Compound sub-proposition missed',
                color: 'amber',
                count: metrics.stageFailureBreakdown['Stage 1: Claim Extraction'],
              },
              {
                stage: 'Stage 2: Source Retrieval' as PipelineStageFailure,
                label: '2. Retrieval',
                desc: 'Sparse/off-topic literature indexed',
                color: 'blue',
                count: metrics.stageFailureBreakdown['Stage 2: Source Retrieval'],
              },
              {
                stage: 'Stage 3: Matching & Contradiction' as PipelineStageFailure,
                label: '3. Matching',
                desc: 'Missed numerical/factual clash',
                color: 'rose',
                count: metrics.stageFailureBreakdown['Stage 3: Matching & Contradiction'],
              },
              {
                stage: 'Stage 4: Provenance & Independence' as PipelineStageFailure,
                label: '4. Provenance',
                desc: 'Echo chamber syndication collapse',
                color: 'purple',
                count: metrics.stageFailureBreakdown['Stage 4: Provenance & Independence'],
              },
              {
                stage: 'Stage 5: Final Decision Calibration' as PipelineStageFailure,
                label: '5. Calibration',
                desc: 'Threshold selective prediction error',
                color: 'slate',
                count: metrics.stageFailureBreakdown['Stage 5: Final Decision Calibration'],
              },
            ].map(s => {
              const pct = totalFailures > 0 ? Math.round((s.count / totalFailures) * 100) : 0;
              return (
                <div
                  key={s.stage}
                  className={`rounded-xl p-3 border text-left transition-all ${
                    s.count > 0 ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{s.label}</span>
                    <span className="font-mono text-xs font-bold text-slate-700">{s.count} ({pct}%)</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500 truncate">{s.desc}</div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-slate-700 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Action Toolbar: Run All, Run Failed, Reset ───────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          {/* Left: Execution Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunAll()}
              disabled={isBatchRunning}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer ${
                isBatchRunning
                  ? 'bg-teal-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 hover:shadow-md'
              }`}
            >
              {isBatchRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Running Suite ({batchProgress.current}/{batchProgress.total})...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run All 50 Test Cases</span>
                </>
              )}
            </button>

            <button
              onClick={handleRunFailedOnly}
              disabled={isBatchRunning || metrics.failedCount === 0}
              className={`flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                metrics.failedCount > 0 && !isBatchRunning
                  ? 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 cursor-pointer'
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Rerun only cases that currently have FAILED status"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Run Failed Only ({metrics.failedCount})</span>
            </button>

            <button
              onClick={handleResetRuns}
              disabled={isBatchRunning || metrics.executedCount === 0}
              className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              title="Clear current execution results"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>Reset Runs</span>
            </button>
          </div>

          {/* Right: Judging Quick Link / Guide */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="hidden md:inline">Showing</span>
            <span className="font-mono font-bold text-slate-800">{filteredCases.length}</span>
            <span className="hidden md:inline">of 50 benchmarks</span>
          </div>
        </div>

        {/* Batch Progress Bar if active */}
        {isBatchRunning && (
          <div className="mt-2 rounded-xl bg-teal-50 border border-teal-200 p-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900 mb-1.5">
              <span>Executing automated evaluation across 50 test cases...</span>
              <span>{Math.round((batchProgress.current / batchProgress.total) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-teal-200 overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-300"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Multi-Filter & Search Bar ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          {/* Top Row: Search Input + Status filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search claims, target entities, concepts (e.g. 'speed of light', 'Einstein', 'battery')..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Status' },
                { id: 'PASSED', label: 'Passed' },
                { id: 'FAILED', label: 'Failed' },
                { id: 'UNRUN', label: 'Unrun' },
                { id: 'LEARNED_IMPROVED', label: 'Learned' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === st.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Category, Difficulty, Domain Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-1 text-slate-500 font-bold mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-hidden"
            >
              <option value="ALL">All Categories (11 types)</option>
              {categories.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-hidden"
            >
              <option value="ALL">All Difficulties</option>
              {difficulties.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Domain Dropdown */}
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-hidden"
            >
              <option value="ALL">All Domains</option>
              {domains.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Clear filters button */}
            {(selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL' || selectedDomain !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedDifficulty('ALL');
                  setSelectedDomain('ALL');
                  setSelectedStatus('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Test Cases Grid / Cards ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {filteredCases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-bold text-slate-800">No test cases match your filter</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your search terms or resetting the filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {filteredCases.map(tc => {
              const res = results[tc.id];
              const isRunning = runningCaseId === tc.id;
              const hasRun = res !== undefined;
              const isPassed = res?.status === 'PASSED';
              const isFailed = res?.status === 'FAILED';
              const isImproved = res?.improvedAfterCorrection;

              return (
                <div
                  key={tc.id}
                  className={`group rounded-2xl border bg-white p-4 shadow-2xs transition-all hover:shadow-md flex flex-col justify-between ${
                    isPassed
                      ? 'border-emerald-200/90 hover:border-emerald-300'
                      : isFailed
                      ? 'border-rose-200/90 hover:border-rose-300'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Card Header: Badges & ID */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {tc.id.toUpperCase()}
                        </span>
                        <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                          {tc.category}
                        </span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${
                            tc.difficulty === 'Hard'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : tc.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {tc.difficulty}
                        </span>
                      </div>

                      {/* Status Indicator Badge */}
                      <div>
                        {isRunning ? (
                          <span className="inline-flex items-center space-x-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200 animate-pulse">
                            <RefreshCw className="h-3 w-3 animate-spin text-teal-600" />
                            <span>Evaluating...</span>
                          </span>
                        ) : isImproved ? (
                          <span className="inline-flex items-center space-x-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200">
                            <Sparkles className="h-3 w-3 text-purple-600" />
                            <span>Learned Improvement</span>
                          </span>
                        ) : isPassed ? (
                          <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>PASSED</span>
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center space-x-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200">
                            <X className="h-3 w-3 text-rose-600" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            Unrun
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Claim Text */}
                    <div className="mt-3">
                      <p className="text-xs font-semibold leading-relaxed text-slate-900 group-hover:text-slate-950">
                        "{tc.claim}"
                      </p>
                      <div className="mt-1.5 flex items-center space-x-2 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-600">Target:</span>
                        <span>{tc.targetEntity}</span>
                        <span>•</span>
                        <span>{tc.domain}</span>
                      </div>
                    </div>

                    {/* Decision Comparison Strip */}
                    <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Expected Verdict
                        </div>
                        <div className="mt-1">
                          <DecisionBadge decision={tc.expectedDecision} size="sm" />
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          System Verdict
                        </div>
                        <div className="mt-1">
                          {hasRun ? (
                            <DecisionBadge decision={res.systemDecision} size="sm" />
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono italic">Not executed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* If Failed: Show Failed Stage Callout */}
                    {isFailed && res?.failedStage && (
                      <div className="mt-2.5 rounded-lg bg-rose-50/70 p-2 border border-rose-200 text-[11px]">
                        <div className="font-bold text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
                          <span>Failed at: {res.failedStage}</span>
                        </div>
                        <p className="text-rose-700 mt-0.5 line-clamp-1">{res.stageDiagnostic}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleRunSingle(tc)}
                      disabled={isRunning || isBatchRunning}
                      className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{hasRun ? 'Rerun' : 'Run Test'}</span>
                    </button>

                    <button
                      onClick={() => setInspectCase(tc)}
                      className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span>Inspect &amp; Learn</span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Case Inspection & Self-Correction Modal ───────────────────────── */}
      {inspectCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 relative">
            {/* Close Button */}
            <button
              onClick={() => setInspectCase(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-2">
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                {inspectCase.id.toUpperCase()}
              </span>
              <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 border border-teal-200">
                {inspectCase.category}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {inspectCase.domain}
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-900">
              "{inspectCase.claim}"
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Target Entity: <span className="font-semibold text-slate-700">{inspectCase.targetEntity}</span>
            </p>

            {/* Verdict Comparison Box */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Expected Verdict */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ground Truth (Gold Standard)
                </span>
                <div>
                  <DecisionBadge decision={inspectCase.expectedDecision} size="md" />
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {inspectCase.explanation}
                </p>
                {inspectCase.canonicalFact && (
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 rounded-md p-1.5 border border-emerald-200 mt-1">
                    Canonical Fact: {inspectCase.canonicalFact}
                  </div>
                )}
              </div>

              {/* System Verdict */}
              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  System Prediction
                </span>
                <div>
                  {results[inspectCase.id] ? (
                    <DecisionBadge decision={results[inspectCase.id].systemDecision} size="md" />
                  ) : (
                    <span className="text-xs text-slate-400 font-mono italic">Not executed yet</span>
                  )}
                </div>
                {results[inspectCase.id] && (
                  <>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {results[inspectCase.id].systemReasoning}
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Confidence: {Math.round(results[inspectCase.id].confidence * 100)}% •
                      Sources: {results[inspectCase.id].apparentSourcesCount || 3} visible, {results[inspectCase.id].independentOriginsCount || 1} independent
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Results Status Callout */}
            {results[inspectCase.id] && (
              <div className="mt-4">
                {results[inspectCase.id].status === 'PASSED' ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">
                        Benchmark Passed (Correct Epistemic Decision)
                      </h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        TRACEVIDENCE correctly evaluated this claim with conservative selective prediction matching the ground truth.
                      </p>
                      {results[inspectCase.id].learnedCorrectionApplied && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200">
                          <Sparkles className="h-3 w-3 text-purple-600" />
                          <span>Maintained via Active Continuous Learning Memory</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-900">
                          Failure Detected at {results[inspectCase.id].failedStage}
                        </h4>
                        <p className="text-xs text-rose-700 mt-0.5">
                          {results[inspectCase.id].stageDiagnostic}
                        </p>
                      </div>
                    </div>

                    {/* Corrected Reasoning Box */}
                    <div className="rounded-lg bg-white p-3 border border-rose-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                        <Brain className="h-3.5 w-3.5 text-purple-700" />
                        <span>AI-Generated Corrected Reasoning &amp; Epistemic Directive</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {results[inspectCase.id].correctedReasoning}
                      </p>
                    </div>

                    {/* Self-Correction Loop Action */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Trigger learning feedback loop to store mistake &amp; re-evaluate:
                      </span>
                      <button
                        onClick={() => handleApplyCorrectionAndRetry(inspectCase)}
                        className="flex items-center space-x-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Apply Correction &amp; Retry</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleRunSingle(inspectCase)}
                disabled={runningCaseId === inspectCase.id}
                className="flex items-center space-x-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{results[inspectCase.id] ? 'Re-run Evaluation' : 'Run Evaluation Now'}</span>
              </button>

              <button
                onClick={() => setInspectCase(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Continuous Learning Memory Drawer ─────────────────────────────── */}
      {memoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="h-full w-full max-w-xl bg-white p-6 shadow-2xl border-l border-slate-200 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-purple-100 p-1.5 text-purple-700">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Continuous Learning Memory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Self-correction store containing learned mistake patterns and active rules.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMemoryDrawerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Judge / Explanatory Banner */}
              <div className="mt-4 rounded-xl bg-purple-50 p-3.5 border border-purple-200 text-xs text-purple-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-700" />
                  How Continuous Learning Operates
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  When TRACEVIDENCE produces an erroneous answer, the self-correction engine stores the exact mistake pattern and generates a rule directive. These rules actively guard future retrieval and factual matching. You can toggle any rule off to verify that the system regresses without it!
                </p>
              </div>

              {/* Memory Cards List */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Stored Rules ({learnedMemories.length})</span>
                  <button
                    onClick={handleResetMemories}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    Reset to Default Seeds
                  </button>
                </div>

                {learnedMemories.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                    No learned memories stored yet. Failures will automatically generate rules here.
                  </div>
                ) : (
                  learnedMemories.map(mem => (
                    <div
                      key={mem.id}
                      className={`rounded-xl border p-4 transition-all text-xs ${
                        mem.active
                          ? 'border-purple-200 bg-white shadow-2xs'
                          : 'border-slate-200 bg-slate-50/70 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {mem.ruleDirective}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleToggleMemory(mem.id)}
                            className="flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer mr-1"
                            title={mem.active ? 'Disable rule (simulate regression)' : 'Enable rule'}
                          >
                            {mem.active ? (
                              <ToggleRight className="h-5 w-5 text-purple-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteMemory(mem.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 font-bold text-slate-900">
                        Target: {mem.targetEntity}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 italic">
                        "{mem.claimSnippet}"
                      </p>

                      <div className="mt-2.5 rounded-lg bg-slate-50 p-2 border border-slate-100 text-[11px] space-y-1">
                        <div>
                          <span className="font-bold text-slate-600">Failed Stage: </span>
                          <span className="text-rose-700 font-semibold">{mem.originalFailedStage}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600">Mistake Pattern: </span>
                          <span className="text-slate-700">{mem.mistakePattern}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600">Corrective Reasoning: </span>
                          <span className="text-emerald-800 font-medium">{mem.correctedReasoning}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Applied {mem.appliedCount} times</span>
                        <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {learnedMemories.filter(m => m.active).length} of {learnedMemories.length} rules active
              </span>
              <button
                onClick={() => setMemoryDrawerOpen(false)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
