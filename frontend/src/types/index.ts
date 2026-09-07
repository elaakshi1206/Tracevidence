export type DecisionType = 'TRUST' | 'VERIFY' | 'ABSTAIN';

export type SourceTier =
  | 'Academic'
  | 'Government'
  | 'Official'
  | 'Reputable Media'
  | 'Aggregator/Blog'
  | 'Unverified';

export type PolarityType = 'SUPPORT' | 'PARTIAL' | 'CONTRADICT';

export type ProvenanceLevel = 'Directly Traceable' | 'Partially Traceable' | 'Untraceable';

export interface Source {
  id: string;
  title: string;
  url?: string;
  publisher: string;
  authorOrOrg?: string;
  tier: SourceTier;
  publishedDate: string;
  isPrimaryOrigin: boolean;
  originId?: string; // If syndicated or derived, references primary source id
  verbatimOverlapRatio?: number; // 0-1, e.g. 0.84 copy of origin
  credibilityScore: number; // 0-1
  snippet: string;
  doi?: string;
}

export interface Evidence {
  id: string;
  claimId: string;
  sourceId: string;
  polarity: PolarityType;
  quote: string;
  relevanceScore: number; // 0-1
  verificationReasoning: string;
}

export interface ProvenanceNode {
  sourceId: string;
  timestamp: string;
  role: 'Primary Origin' | 'Peer Replication' | 'Syndication / Reprint' | 'Derived Commentary';
  distanceFromOrigin: number; // 0 for primary
}

export interface ProvenanceChain {
  claimId: string;
  level: ProvenanceLevel;
  originSourceId: string;
  steps: ProvenanceNode[];
  circularityDetected: boolean;
  circularityDetails?: string;
}

export interface TrustScoreBreakdown {
  supportScore: number; // S(c): 0 to 1
  independenceFactor: number; // I(c) = N_indep / N_apparent
  freshnessDecay: number; // F(c) = exp(-lambda * dt)
  contradictionPenalty: number; // C(c): 0 to 1
  finalTrustScore: number; // T(c)
}

export interface Claim {
  id: string;
  text: string;
  targetEntity: string;
  confidence: number;
  decision: DecisionType;
  decisionReason: string;
  recommendedAction: string;
  apparentSourcesCount: number;
  independentOriginsCount: number;
  independenceRatio: number;
  freshnessScore: number;
  temporalStatus: 'Current' | 'Outdated' | 'Historical' | 'Pending Verification';
  contradictionDetected: boolean;
  contradictionDetails?: string;
  evidenceIds: string[];
  provenanceChain?: ProvenanceChain;
  mathBreakdown: TrustScoreBreakdown;
  llmReasoning: string;
}

export interface EvidenceGraphNode {
  id: string;
  type: 'claim' | 'source' | 'origin';
  label: string;
  subtitle?: string;
  decision?: DecisionType;
  tier?: SourceTier;
  polarity?: PolarityType;
  isPrimaryOrigin?: boolean;
  clusterId?: string;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType: 'supports' | 'contradicts' | 'partially_supports' | 'cites' | 'syndicates' | 'origin_of';
  animated?: boolean;
}

export interface AnalysisResult {
  id: string;
  title: string;
  query: string;
  inputType: 'text' | 'url' | 'document' | 'benchmark';
  timestamp: string;
  executiveSummary: string;
  overallDecisionCounts: {
    trust: number;
    verify: number;
    abstain: number;
  };
  aggregateMetrics: {
    averageIndependence: number;
    overallCorroboration: number;
    averageFreshness: number;
    contradictionRate: number;
    riskCoverageScore: number;
  };
  claims: Claim[];
  sources: Source[];
  evidences: Evidence[];
  provenanceChains: ProvenanceChain[];
  graphData: {
    nodes: EvidenceGraphNode[];
    edges: EvidenceGraphEdge[];
  };
  executionTimeMs: number;
  provider: string;
}

export interface BenchmarkCase {
  id: string;
  tag: string;
  title: string;
  domain: string;
  description: string;
  inputContent: string;
  highlightSignal: 'Independence Collapse' | 'Contradiction Conflict' | 'Temporal Freshness Decay' | 'High Corroboration' | 'Circular Reporting';
  expectedOutcome: DecisionType;
  data: AnalysisResult;
}
