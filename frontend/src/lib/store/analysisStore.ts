import { create } from 'zustand';
import { AnalysisResult, Claim, BenchmarkCase } from '@/types';
import { BENCHMARK_CASES } from '../benchmarks/demoCases';
import { PipelineProgressUpdate } from '../engine/pipelineOrchestrator';

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  selectedClaimId: string | null;
  pipelineProgress: PipelineProgressUpdate | null;
  isAnalyzing: boolean;
  history: AnalysisResult[];
  activeFilter: 'ALL' | 'TRUST' | 'VERIFY' | 'ABSTAIN';

  // Tutorials & User Understanding
  isTourOpen: boolean;
  tourStep: number;
  plainEnglishMode: boolean;
  dismissedPageTutorials: Record<string, boolean>;

  // Gamified Compulsory Prologue Tutorial
  isPrologueOpen: boolean;
  prologueStep: number;
  hasCompletedPrologue: boolean;

  // Dual Analysis Modes
  analysisMode: 'benchmark' | 'live';

  // Actions
  setAnalysis: (analysis: AnalysisResult) => void;
  setSelectedClaimId: (claimId: string | null) => void;
  setPipelineProgress: (progress: PipelineProgressUpdate | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setAnalysisMode: (mode: 'benchmark' | 'live') => void;
  setActiveFilter: (filter: 'ALL' | 'TRUST' | 'VERIFY' | 'ABSTAIN') => void;
  loadBenchmarkCase: (benchmarkId: string) => void;
  resetAnalysis: () => void;

  // Tutorial actions
  openTour: (step?: number) => void;
  closeTour: () => void;
  setTourStep: (step: number) => void;
  togglePlainEnglishMode: () => void;
  togglePageTutorial: (pageKey: string) => void;

  // Prologue actions
  openPrologue: (step?: number) => void;
  closePrologue: () => void;
  setPrologueStep: (step: number) => void;
  completePrologue: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: BENCHMARK_CASES[0].data, // Pre-load EV battery case by default so app is immediately rich with data
  selectedClaimId: BENCHMARK_CASES[0].data.claims[0].id,
  pipelineProgress: null,
  isAnalyzing: false,
  history: BENCHMARK_CASES.map(b => b.data),
  activeFilter: 'ALL',
  analysisMode: 'benchmark',

  // Tutorials
  isTourOpen: false,
  tourStep: 0,
  plainEnglishMode: true,
  dismissedPageTutorials: {},

  // Gamified Compulsory Prologue Tutorial
  isPrologueOpen: false, // will auto-trigger on first mount if not completed in localStorage
  prologueStep: 0,
  hasCompletedPrologue: false,

  setAnalysis: (analysis) =>
    set((state) => ({
      currentAnalysis: analysis,
      analysisMode: analysis.analysisMode || state.analysisMode,
      selectedClaimId: analysis.claims[0]?.id || null,
      history: [analysis, ...state.history.filter((h) => h.id !== analysis.id)].slice(0, 10),
    })),

  setSelectedClaimId: (claimId) => set({ selectedClaimId: claimId }),
  setPipelineProgress: (progress) => set({ pipelineProgress: progress }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  loadBenchmarkCase: (benchmarkId: string) => {
    const found = BENCHMARK_CASES.find((b) => b.id === benchmarkId);
    if (found) {
      set({
        currentAnalysis: found.data,
        analysisMode: 'benchmark',
        selectedClaimId: found.data.claims[0]?.id || null,
        pipelineProgress: null,
        isAnalyzing: false,
      });
    }
  },

  resetAnalysis: () => set({ currentAnalysis: null, selectedClaimId: null, pipelineProgress: null }),

  openTour: (step = 0) => set({ isTourOpen: true, tourStep: step, isPrologueOpen: false }),
  closeTour: () => set({ isTourOpen: false }),
  setTourStep: (step) => set({ tourStep: step }),
  togglePlainEnglishMode: () => set((state) => ({ plainEnglishMode: !state.plainEnglishMode })),
  togglePageTutorial: (pageKey: string) =>
    set((state) => ({
      dismissedPageTutorials: {
        ...state.dismissedPageTutorials,
        [pageKey]: !state.dismissedPageTutorials[pageKey],
      },
    })),

  openPrologue: (step = 0) => set({ isTourOpen: true, tourStep: step, isPrologueOpen: false }),
  closePrologue: () => set({ isTourOpen: false, isPrologueOpen: false }),
  setPrologueStep: (step: number) => set({ tourStep: step }),
  completePrologue: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tracevidence_prologue_completed', 'true');
      } catch (e) {
        // ignore
      }
    }
    set({ isTourOpen: false, isPrologueOpen: false, hasCompletedPrologue: true });
  },
}));
