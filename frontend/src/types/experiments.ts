import { DecisionType, AnalysisResult } from './index';

export type TestCaseCategory =
  | 'Clearly True'
  | 'Clearly False'
  | 'Partially Correct'
  | 'Echo Chamber'
  | 'Outdated Information'
  | 'Numerical Error'
  | 'Common Misconception'
  | 'Mixed True + False'
  | 'Sounds True But False'
  | 'Sounds False But True'
  | 'Ambiguous Statement';

export type TestCaseDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Tricky';

export type TestCaseDomain =
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Medicine/Biology'
  | 'Current Affairs'
  | 'General Knowledge'
  | 'Technology'
  | 'Astronomy'
  | (string & {});

export type PipelineStageFailure =
  | 'Stage 1: Claim Extraction'
  | 'Stage 2: Source Retrieval'
  | 'Stage 3: Source Relevance Filtering'
  | 'Stage 4: Claim vs Source Matching'
  | 'Stage 5: Provenance & Independence'
  | 'Stage 6: Final Trust Decision'
  | 'None (Passed)';

export type ErrorPatternType =
  | 'Numerical Mismatch'
  | 'Directional / Geographic Error'
  | 'Echo Chamber Blindness'
  | 'Compound Claim Decomposition'
  | 'Outdated Information Accepted'
  | 'Myth / Misconception Trusted'
  | 'Attribution Error'
  | 'Overconfident Trust'
  | 'Overconfident Abstain'
  | 'Partial Truth Misjudged'
  | 'Ambiguity Mishandled';

export interface ExperimentTestCase {
  id: string;
  claim: string;
  expectedDecision: DecisionType; // 'TRUST' | 'VERIFY' | 'ABSTAIN'
  explanation: string;
  category: TestCaseCategory;
  difficulty: TestCaseDifficulty;
  domain: TestCaseDomain;
  targetEntity: string;
  canonicalFact?: string;
  knownPitfall?: string;
}

export interface TestCaseRunResult {
  testCaseId: string;
  executedAt: string;
  status: 'PASSED' | 'FAILED';
  systemDecision: DecisionType;
  expectedDecision: DecisionType;
  confidence: number;
  failedStage?: PipelineStageFailure;
  stageDiagnostic?: string;
  systemReasoning: string;
  correctedReasoning?: string;
  learnedCorrectionApplied?: boolean;
  improvedAfterCorrection?: boolean;
  retriedAfterCorrection?: boolean;
  autoTrained?: boolean;
  hardTrained?: boolean;
  liveEvidenceGathered?: boolean;
  hardTrainedCycle?: HardTrainingCycleSummary;
  previousDecision?: DecisionType;
  apparentSourcesCount?: number;
  independentOriginsCount?: number;
  executionTimeMs?: number;
  analysisResult?: AnalysisResult;
}

export interface HardTrainingLiveSource {
  publisher: string;
  tier: string;
  canonicalProofSnippet: string;
  doi?: string;
  isPrimaryConsensus: boolean;
  title?: string;
  url?: string;
  reliability?: number;
  empiricalExcerpt?: string;
}

export interface HardTrainingCycleSummary {
  cycleId: string;
  testCaseId: string;
  targetEntity: string;
  originalVerdict: DecisionType;
  correctedVerdict: DecisionType;
  failedStage: PipelineStageFailure;
  liveSourcesConsulted: HardTrainingLiveSource[];
  liveSourcesGathered?: Array<{
    title: string;
    publisher: string;
    url: string;
    doi: string;
    reliability: number;
    empiricalExcerpt: string;
  }>;
  mistakePatternIdentified: string;
  ruleDirectiveFormulated: string;
  workUponItIterations: number;
  epistemicAudit: {
    premiseAudit: string;
    canonicalGroundTruth: string;
    calibrationDirective: string;
  };
  epistemicDirective?: {
    premiseAudit: string;
    canonicalFact: string;
    confidenceConstraint: string;
  };
  workingIterations?: Array<{
    iteration: number;
    focus: string;
    modelOutput: string;
    lossReductionScore: number;
  }>;
  verificationStatus: 'SUCCESSFULLY_GROUNDED' | 'CALIBRATED';
  timestamp: string;
}

export interface LearnedCorrectionMemory {
  id: string;
  testCaseId: string;
  claimSnippet: string;
  targetEntity: string;
  difficulty?: TestCaseDifficulty;
  originalFailedStage: PipelineStageFailure;
  originalSystemDecision: DecisionType;
  expectedDecision: DecisionType;
  mistakePattern: string;
  correctedReasoning: string;
  ruleDirective: string;
  canonicalCorrection: string;
  appliedCount: number;
  createdAt: string;
  active: boolean;
}

export interface ExperimentSuiteMetrics {
  totalCases: number;
  executedCount: number;
  passedCount: number;
  failedCount: number;
  unrunCount: number;
  accuracyRate: number; // 0 to 100%
  stageFailureBreakdown: Record<PipelineStageFailure, number>;
  categoryBreakdown: Record<string, { total: number; passed: number; failed: number }>;
  activeLearnedMemoriesCount: number;
}

/** Detailed error report auto-generated when a case fails */
export interface ErrorReport {
  id: string;
  testCaseId: string;
  claimText: string;
  targetEntity: string;
  category: TestCaseCategory;
  difficulty: TestCaseDifficulty;
  domain: TestCaseDomain;
  // Verdict mismatch
  expectedDecision: DecisionType;
  systemDecision: DecisionType;
  // Stage analysis
  failedStage: PipelineStageFailure;
  stageExplanation: string;       // Why this stage failed (detailed)
  rootCause: string;              // One-line root cause
  // Improvement
  correctedReasoning: string;     // What the correct reasoning should be
  ruleDirective: string;          // Auto-generated rule to prevent recurrence
  patternType: ErrorPatternType;  // Categorised error pattern
  // Few-shot
  fewShotExample: FewShotExample; // Ready-to-inject example
  // Meta
  detectedAt: string;             // ISO timestamp
  retriedAndImproved: boolean;
}

/** A single few-shot example extracted from an error report */
export interface FewShotExample {
  id: string;
  errorReportId: string;
  claimSnippet: string;
  wrongDecision: DecisionType;
  correctDecision: DecisionType;
  patternType: ErrorPatternType;
  correctedReasoning: string;
  canonicalFact: string;
  targetEntity: string;
  relevanceKeywords: string[];
}

/** Grouped error pattern - cluster of similar failures */
export interface ErrorPattern {
  patternType: ErrorPatternType;
  count: number;
  percentage: number;
  description: string;
  recommendation: string;
  affectedCaseIds: string[];
  worstStage: PipelineStageFailure;
}

/** Snapshot of accuracy at a point in time for trend tracking */
export interface TrainingSnapshot {
  timestamp: string;
  accuracyRate: number;
  passedCount: number;
  failedCount: number;
  executedCount: number;
  activeMemoriesCount: number;
  triggerEvent: 'batch_run' | 'retrain' | 'single_run';
}

/** Summary of a re-training session */
export interface TrainingSession {
  id: string;
  startedAt: string;
  completedAt: string;
  casesTrained: number;
  casesImproved: number;
  casesStillFailing: number;
  accuracyBefore: number;
  accuracyAfter: number;
  newMemoriesCreated: number;
}

/** Atomic claim decomposed from an AI chatbot paragraph */
export interface ParagraphKeyClaim {
  id: string;
  claimText: string;
  expectedDecision: DecisionType; // 'TRUST' | 'VERIFY' | 'ABSTAIN'
  isFactuallyAccurate: boolean;
  explanation: string;
}

/** Realistic AI Chatbot answer test case */
export interface ParagraphTestCase {
  id: string; // 'PARA-01' to 'PARA-67'
  title: string;
  simulatedQuery: string; // User prompt
  simulatedBot: 'ChatGPT-4o' | 'Claude 3.5' | 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro' | 'Perplexity' | 'Perplexity AI' | string;
  paragraph: string;
  expectedDecision: DecisionType; // Overall paragraph verdict
  mainReason: string;
  category: TestCaseCategory;
  difficulty: TestCaseDifficulty;
  domain: TestCaseDomain;
  targetEntity: string;
  keyClaims: ParagraphKeyClaim[];
  knownHallucinationType?: string;
}

/** Individual evaluated claim result within a paragraph */
export interface EvaluatedParagraphClaim {
  claimId: string;
  claimText: string;
  expectedDecision: DecisionType;
  systemDecision: DecisionType;
  confidence: number;
  explanation?: string;
  reasoning?: string;
  matchesExpected: boolean;
  isFactuallyAccurate?: boolean;
}

/** Result of executing a full paragraph test case */
export interface ParagraphRunResult {
  paragraphId: string;
  testCaseId?: string;
  executedAt: string;
  status: 'PASSED' | 'FAILED';
  systemDecision: DecisionType;
  expectedDecision: DecisionType;
  confidence: number;
  failedStage: PipelineStageFailure;
  stageDiagnostic?: string;
  overallReasoning: string;
  correctedReasoning?: string;
  claimsCount?: number;
  evaluatedClaims: EvaluatedParagraphClaim[];
  learnedCorrectionApplied?: boolean;
  improvedAfterCorrection?: boolean;
  retriedAfterCorrection?: boolean;
  autoTrained?: boolean;
  executionTimeMs?: number;
  analysisResult?: AnalysisResult;
}

/** Aggregate metrics for the paragraph test suite */
export interface ParagraphSuiteMetrics {
  totalCases: number;
  executedCount: number;
  passedCount: number;
  failedCount: number;
  unrunCount: number;
  accuracyRate: number;
  totalAtomicClaimsEvaluated: number;
  atomicClaimsAccuracyRate: number;
  stageFailureBreakdown: Record<PipelineStageFailure, number>;
  activeLearnedMemoriesCount: number;
  difficultyBreakdown: Record<
    TestCaseDifficulty,
    { total: number; executed: number; passed: number; failed: number; accuracy: number }
  >;
}
