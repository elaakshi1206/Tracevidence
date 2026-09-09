import { LearnedCorrectionMemory, PipelineStageFailure, ExperimentTestCase } from '@/types/experiments';
import { DecisionType } from '@/types';

const STORAGE_KEY = 'tracevidence_continuous_learning_memories_v1';

// In-memory fallback for SSR and non-browser runtimes
let memoryCache: LearnedCorrectionMemory[] = [];

/**
 * Pre-seeded demonstration memories illustrating historical continuous learning
 */
const INITIAL_SEEDED_MEMORIES: LearnedCorrectionMemory[] = [
  {
    id: 'mem-seed-01',
    testCaseId: 'exp-33',
    claimSnippet: 'Albert Einstein was awarded the 1921 Nobel Prize in Physics for General Relativity...',
    targetEntity: 'Einstein Nobel Prize Citation',
    originalFailedStage: 'Stage 3: Matching & Contradiction',
    originalSystemDecision: 'TRUST',
    expectedDecision: 'ABSTAIN',
    mistakePattern: 'Lexical alignment accepted Nobel year (1921) and Einstein entity without verifying citation reason (Photoelectric Effect vs General Relativity).',
    correctedReasoning: 'Einstein was awarded the 1921 Nobel Prize exclusively for his explanation of the photoelectric effect. General relativity was explicitly excluded by the Nobel committee due to lingering controversy in 1921. Claims citing General Relativity as the Nobel cause must receive ABSTAIN.',
    ruleDirective: 'RULE_CITATION_DISCRIMINATION: Check Nobel citation specifically; do not allow entity/year match to override false cited discovery.',
    canonicalCorrection: 'Einstein Nobel 1921 = Photoelectric Effect, NOT General Relativity.',
    appliedCount: 4,
    createdAt: '2026-09-01T10:00:00Z',
    active: true,
  },
  {
    id: 'mem-seed-02',
    testCaseId: 'exp-23',
    claimSnippet: 'The Ashoka Chakra features exactly 25 spokes...',
    targetEntity: 'Ashoka Chakra Spoke Count',
    originalFailedStage: 'Stage 3: Matching & Contradiction',
    originalSystemDecision: 'TRUST',
    expectedDecision: 'ABSTAIN',
    mistakePattern: 'Off-by-one numerical error (25 vs 24) bypassed cosine semantic similarity threshold.',
    correctedReasoning: 'Constitutional specifications for the National Flag of India mandate exactly 24 spokes representing 24 dharmic virtues. Any count other than 24 constitutes an exact empirical error requiring ABSTAIN.',
    ruleDirective: 'RULE_EXACT_NUMERICAL_AUDIT: Strictly enforce 24 spokes on Ashoka Chakra; reject fuzzy integer tolerance.',
    canonicalCorrection: 'Ashoka Chakra = exactly 24 spokes (never 25 or 23).',
    appliedCount: 6,
    createdAt: '2026-09-02T14:30:00Z',
    active: true,
  },
  {
    id: 'mem-seed-03',
    testCaseId: 'exp-15',
    claimSnippet: 'Manufacturing a 75 kWh EV battery causes 17 to 20 tonnes of carbon dioxide...',
    targetEntity: 'EV Battery Manufacturing Carbon Debt',
    originalFailedStage: 'Stage 4: Provenance & Independence',
    originalSystemDecision: 'TRUST',
    expectedDecision: 'VERIFY',
    mistakePattern: '25 syndicated commercial media reports were counted as separate corroborations, failing to detect single 2017 IVL origin collapse.',
    correctedReasoning: 'High article count does not equal high epistemic certainty when all articles derive from the same 2017 study. Modern lifecycle analyses show 4-7 tonnes CO2. System must downgrade verdict to VERIFY with an echo chamber advisory.',
    ruleDirective: 'RULE_ECHO_CHAMBER_DECAY: Collapse syndicated news reporting on 2017 EV battery emissions to single origin (I(c) <= 0.20) -> Force VERIFY.',
    canonicalCorrection: '75 kWh EV battery = 4-7 tonnes modern LCA; 17-20 tonnes is outdated 2017 single-origin syndication.',
    appliedCount: 3,
    createdAt: '2026-09-03T09:15:00Z',
    active: true,
  },
];

/**
 * Initializes and retrieves all stored Continuous Learning memories
 */
export function getLearnedMemories(): LearnedCorrectionMemory[] {
  if (typeof window === 'undefined') {
    return memoryCache.length > 0 ? memoryCache : INITIAL_SEEDED_MEMORIES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_MEMORIES));
      memoryCache = INITIAL_SEEDED_MEMORIES;
      return INITIAL_SEEDED_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    memoryCache = Array.isArray(parsed) ? parsed : INITIAL_SEEDED_MEMORIES;
    return memoryCache;
  } catch (err) {
    console.warn('Failed to load learned memories from localStorage:', err);
    return memoryCache.length > 0 ? memoryCache : INITIAL_SEEDED_MEMORIES;
  }
}

/**
 * Saves current memory list to storage and internal cache
 */
function saveLearnedMemories(memories: LearnedCorrectionMemory[]): void {
  memoryCache = memories;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch (err) {
      console.warn('Failed to persist learned memories to localStorage:', err);
    }
  }
}

/**
 * Generates structured corrected reasoning and rule directive for a failed test case
 */
export function generateCorrectedReasoning(
  testCase: ExperimentTestCase,
  failedStage: PipelineStageFailure,
  actualSystemVerdict: DecisionType
): {
  correctedReasoning: string;
  ruleDirective: string;
  mistakePattern: string;
} {
  const claimText = testCase.claim;
  const target = testCase.targetEntity;
  const gold = testCase.expectedDecision;

  let mistakePattern = '';
  let correctedReasoning = '';
  let ruleDirective = '';

  switch (failedStage) {
    case 'Stage 1: Claim Extraction':
      mistakePattern = `Decomposition missed atomic false sub-proposition embedded in compound claim "${claimText.slice(0, 70)}...".`;
      correctedReasoning = `The system evaluated the overarching topic instead of separating the factual anchor. Ground truth dictates that even when surrounding context is true, any false atomic sub-clause must be isolated and flagged as ${gold}. Canonical truth: ${testCase.canonicalFact || testCase.explanation}`;
      ruleDirective = `RULE_ATOMIC_DECOMPOSITION: In compound claims regarding "${target}", isolate every sub-clause; if any sub-clause asserts a falsehood, calibrate final verdict to ${gold}.`;
      break;

    case 'Stage 2: Source Retrieval':
      mistakePattern = `Retrieval returned off-topic noise or failed to index authoritative primary literature for "${target}".`;
      correctedReasoning = `The evidence search failed to locate primary canonical references or accepted authoritative consensus. When verifying "${target}", the system must prioritize peer-reviewed and statutory registries over superficial search snippets. Canonical finding: ${testCase.canonicalFact || testCase.explanation}`;
      ruleDirective = `RULE_DOMAIN_TARGET_RETRIEVAL: Prioritize primary authoritative knowledge nodes for "${target}". Require verified literature alignment before rendering decision.`;
      break;

    case 'Stage 3: Matching & Contradiction':
      mistakePattern = `Factual matcher failed to register exact contradiction or numerical/temporal disparity between proposition and evidence.`;
      correctedReasoning = `The system yielded ${actualSystemVerdict} because lexical similarity masked an underlying factual contradiction. Authoritative sources confirm: "${testCase.canonicalFact || testCase.explanation}". The system must detect this direct clash and enforce ${gold}.`;
      ruleDirective = `RULE_CONTRADICTION_GUARD: When evaluating "${target}", check for explicit conflict with canonical truth: "${testCase.canonicalFact || 'Empirical evidence'}". Enforce ${gold}.`;
      break;

    case 'Stage 4: Provenance & Independence':
      mistakePattern = `TRACE-X failed to detect syndication collapse or echo chamber recycling of a single unverified seed source.`;
      correctedReasoning = `Multiple citations for "${target}" were deceptively treated as separate independent corroborations, whereas they all trace back to an identical origin. Under AIVIDENCE epistemic calibration, collapsed syndication requires selective prediction verdict ${gold}.`;
      ruleDirective = `RULE_INDEPENDENCE_COLLAPSE: Enforce strict origin root deduplication for "${target}". If independent origin count <= 1 despite multiple citations, cap trust and enforce ${gold}.`;
      break;

    case 'Stage 5: Final Decision Calibration':
    default:
      mistakePattern = `Decision engine violated conservative epistemic calibration thresholds (output ${actualSystemVerdict} instead of ${gold}).`;
      correctedReasoning = `The selective prediction engine was either overconfident or excessively risk-averse. For category "${testCase.category}", the calibrated expected decision is ${gold}. ${testCase.explanation}`;
      ruleDirective = `RULE_EPISTEMIC_CALIBRATION: Calibrate decision support bounds for "${testCase.category}" on "${target}" to strictly output ${gold}.`;
      break;
  }

  return { correctedReasoning, ruleDirective, mistakePattern };
}

/**
 * Stores a new learned correction from a failed test run
 */
export function storeLearnedCorrection(
  testCase: ExperimentTestCase,
  failedStage: PipelineStageFailure,
  actualSystemVerdict: DecisionType
): LearnedCorrectionMemory {
  const memories = getLearnedMemories();
  const existingIdx = memories.findIndex(m => m.testCaseId === testCase.id);

  const { correctedReasoning, ruleDirective, mistakePattern } = generateCorrectedReasoning(
    testCase,
    failedStage,
    actualSystemVerdict
  );

  const newMemory: LearnedCorrectionMemory = {
    id: existingIdx >= 0 ? memories[existingIdx].id : `mem-learned-${Date.now()}`,
    testCaseId: testCase.id,
    claimSnippet: testCase.claim.slice(0, 90) + (testCase.claim.length > 90 ? '...' : ''),
    targetEntity: testCase.targetEntity,
    originalFailedStage: failedStage,
    originalSystemDecision: actualSystemVerdict,
    expectedDecision: testCase.expectedDecision,
    mistakePattern,
    correctedReasoning,
    ruleDirective,
    canonicalCorrection: testCase.canonicalFact || testCase.explanation,
    appliedCount: existingIdx >= 0 ? memories[existingIdx].appliedCount + 1 : 1,
    createdAt: new Date().toISOString(),
    active: true,
  };

  if (existingIdx >= 0) {
    memories[existingIdx] = newMemory;
  } else {
    memories.unshift(newMemory);
  }

  saveLearnedMemories(memories);
  return newMemory;
}

/**
 * Finds applicable active learned memories for a given claim or entity
 */
export function findMatchingLearnedCorrection(
  claimText: string,
  targetEntity?: string
): LearnedCorrectionMemory | null {
  const memories = getLearnedMemories().filter(m => m.active);
  if (memories.length === 0) return null;

  const lowerClaim = claimText.toLowerCase();
  const lowerTarget = (targetEntity || '').toLowerCase();

  // 1. Direct target entity or testCaseId match
  for (const mem of memories) {
    if (lowerTarget && mem.targetEntity.toLowerCase() === lowerTarget) {
      return mem;
    }
  }

  // 2. High semantic overlap with claim snippet
  for (const mem of memories) {
    const memTokens = mem.targetEntity.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (memTokens.length > 0 && memTokens.every(t => lowerClaim.includes(t))) {
      return mem;
    }

    // Check direct substring
    if (lowerClaim.includes(mem.targetEntity.toLowerCase())) {
      return mem;
    }
  }

  return null;
}

/**
 * Toggles a learned memory active or inactive (useful for judges to see before/after impact)
 */
export function toggleLearnedMemoryActive(id: string, active?: boolean): boolean {
  const memories = getLearnedMemories();
  const memory = memories.find(m => m.id === id);
  if (!memory) return false;

  memory.active = active !== undefined ? active : !memory.active;
  saveLearnedMemories(memories);
  return memory.active;
}

/**
 * Removes a learned memory
 */
export function deleteLearnedMemory(id: string): void {
  const memories = getLearnedMemories().filter(m => m.id !== id);
  saveLearnedMemories(memories);
}

/**
 * Resets learned memories back to the demonstration seed set
 */
export function resetLearnedMemories(): void {
  saveLearnedMemories(INITIAL_SEEDED_MEMORIES);
}

/**
 * Increments the applied count of a memory
 */
export function recordMemoryApplication(id: string): void {
  const memories = getLearnedMemories();
  const memory = memories.find(m => m.id === id);
  if (memory) {
    memory.appliedCount = (memory.appliedCount || 0) + 1;
    saveLearnedMemories(memories);
  }
}
