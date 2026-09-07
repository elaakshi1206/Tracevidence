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
  judgeMode: boolean;
  activeFilter: 'ALL' | 'TRUST' | 'VERIFY' | 'ABSTAIN';

  // Actions
  setAnalysis: (analysis: AnalysisResult) => void;
  setSelectedClaimId: (claimId: string | null) => void;
  setPipelineProgress: (progress: PipelineProgressUpdate | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
  toggleJudgeMode: () => void;
  setActiveFilter: (filter: 'ALL' | 'TRUST' | 'VERIFY' | 'ABSTAIN') => void;
  loadBenchmarkCase: (benchmarkId: string) => void;
  resetAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: BENCHMARK_CASES[0].data, // Pre-load EV battery case by default so app is immediately rich with data
  selectedClaimId: BENCHMARK_CASES[0].data.claims[0].id,
  pipelineProgress: null,
  isAnalyzing: false,
  history: BENCHMARK_CASES.map(b => b.data),
  judgeMode: true,
  activeFilter: 'ALL',

  setAnalysis: (analysis) =>
    set((state) => ({
      currentAnalysis: analysis,
      selectedClaimId: analysis.claims[0]?.id || null,
      history: [analysis, ...state.history.filter((h) => h.id !== analysis.id)].slice(0, 10),
    })),

  setSelectedClaimId: (claimId) => set({ selectedClaimId: claimId }),
  setPipelineProgress: (progress) => set({ pipelineProgress: progress }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
  toggleJudgeMode: () => set((state) => ({ judgeMode: !state.judgeMode })),
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  loadBenchmarkCase: (benchmarkId: string) => {
    const found = BENCHMARK_CASES.find((b) => b.id === benchmarkId);
    if (found) {
      set({
        currentAnalysis: found.data,
        selectedClaimId: found.data.claims[0]?.id || null,
        pipelineProgress: null,
        isAnalyzing: false,
      });
    }
  },

  resetAnalysis: () => set({ currentAnalysis: null, selectedClaimId: null, pipelineProgress: null }),
}));
