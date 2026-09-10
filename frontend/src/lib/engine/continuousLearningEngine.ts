import { LearnedCorrectionMemory, PipelineStageFailure, ExperimentTestCase } from '@/types/experiments';
import { DecisionType } from '@/types';

const STORAGE_KEY = 'tracevidence_continuous_learning_memories_v1';

// In-memory fallback for SSR and non-browser runtimes
let memoryCache: LearnedCorrectionMemory[] = [];
let hasAttemptedBackendSync = false;

/**
 * Pre-seeded demonstration memories illustrating historical continuous learning
 */
const INITIAL_SEEDED_MEMORIES: LearnedCorrectionMemory[] = [
  {
    id: 'mem-seed-01',
    testCaseId: 'exp-33',
    claimSnippet: 'Albert Einstein was awarded the 1921 Nobel Prize in Physics for General Relativity...',
    targetEntity: 'Einstein Nobel Prize Citation',
    originalFailedStage: 'Stage 4: Claim vs Source Matching',
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
    originalFailedStage: 'Stage 4: Claim vs Source Matching',
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
    originalFailedStage: 'Stage 5: Provenance & Independence',
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
 * Synchronizes learned memories with the centralized FastAPI / SQLite / PostgreSQL backend
 */
export async function syncLearnedMemoriesWithBackend(): Promise<LearnedCorrectionMemory[]> {
  try {
    const backendUrl = typeof window !== 'undefined' ? '/api/rules' : 'http://localhost:8000/api/rules';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const serverRules = await res.json();
      if (Array.isArray(serverRules) && serverRules.length > 0) {
        const mappedServerMemories: LearnedCorrectionMemory[] = serverRules.map((r: any) => ({
          id: r.id,
          testCaseId: r.test_case_id || r.id,
          claimSnippet: r.claim_snippet,
          targetEntity: r.target_entity,
          originalFailedStage: (r.original_failed_stage as PipelineStageFailure) || 'Stage 4: Claim vs Source Matching',
          originalSystemDecision: (r.original_system_decision as DecisionType) || 'TRUST',
          expectedDecision: (r.expected_decision as DecisionType) || 'ABSTAIN',
          mistakePattern: r.mistake_pattern || '',
          correctedReasoning: r.corrected_reasoning || '',
          ruleDirective: r.rule_directive || '',
          canonicalCorrection: r.canonical_correction || '',
          appliedCount: r.applied_count || 1,
          createdAt: r.created_at || new Date().toISOString(),
          active: r.active !== false,
        }));

        // Merge server rules with local rules
        const local = getLearnedMemories();
        const mergedMap = new Map<string, LearnedCorrectionMemory>();
        
        // Populate local first
        local.forEach(m => mergedMap.set(m.id, m));
        // Server takes priority / enriches
        mappedServerMemories.forEach(m => mergedMap.set(m.id, m));

        const finalMerged = Array.from(mergedMap.values());
        saveLearnedMemories(finalMerged);
        hasAttemptedBackendSync = true;
        return finalMerged;
      }
    }
  } catch (e) {
    // Backend offline; continue using local cache
  }
  return getLearnedMemories();
}

/**
 * Initializes and retrieves all stored Continuous Learning memories
 */
export function getLearnedMemories(): LearnedCorrectionMemory[] {
  if (typeof window === 'undefined') {
    return memoryCache.length > 0 ? memoryCache : INITIAL_SEEDED_MEMORIES;
  }

  // Trigger background sync once
  if (!hasAttemptedBackendSync) {
    hasAttemptedBackendSync = true;
    syncLearnedMemoriesWithBackend().catch(() => {});
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_MEMORIES));
      memoryCache = INITIAL_SEEDED_MEMORIES;
      return INITIAL_SEEDED_MEMORIES;
    }
    const parsed = JSON.parse(raw);
    memoryCache = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEEDED_MEMORIES;
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
  const canonical = testCase.canonicalFact || testCase.explanation;
  const pitfall = testCase.knownPitfall ? ` Pitfall avoided: ${testCase.knownPitfall}` : '';

  let mistakePattern = '';
  let correctedReasoning = '';
  let ruleDirective = '';

  switch (failedStage) {
    case 'Stage 1: Claim Extraction':
      mistakePattern = `Decomposition missed atomic false sub-proposition embedded in compound claim "${claimText.slice(0, 70)}...".`;
      correctedReasoning = `[1. Premise Audit]: The proposition combined multiple factual assertions where surrounding true context masked a poisoned atomic sub-clause. [2. Canonical Ground Truth]: ${canonical}. [3. Epistemic Calibration]: Isolate sub-propositions; any non-falsifiable or empirically contradicted atomic clause mandates ${gold}.${pitfall}`;
      ruleDirective = `RULE_ATOMIC_DECOMPOSITION_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: In compound assertions regarding "${target}", decompose into atomic sub-clauses and enforce ${gold}.`;
      break;

    case 'Stage 2: Source Retrieval':
      mistakePattern = `Retrieval returned off-topic noise or failed to index authoritative primary literature for "${target}".`;
      correctedReasoning = `[1. Premise Audit]: Open-web retrieval returned syndicated noise rather than primary canonical literature. [2. Canonical Ground Truth]: Primary scientific and statutory consensus confirms: ${canonical}. [3. Epistemic Calibration]: Prioritize Tier-1 academic and institutional repositories to enforce calibrated ${gold}.${pitfall}`;
      ruleDirective = `RULE_DOMAIN_TARGET_RETRIEVAL_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: Index authoritative primary knowledge nodes for "${target}" to enforce ${gold}.`;
      break;

    case 'Stage 3: Source Relevance Filtering':
      mistakePattern = `Relevance filter accepted outdated or temporally stale sources for "${target}" without checking publication date.`;
      correctedReasoning = `[1. Premise Audit]: Historical or superseded data was passed through without temporal validity auditing. [2. Canonical Ground Truth]: Modern canonical consensus establishes: ${canonical}. [3. Epistemic Calibration]: Apply temporal freshness decay to pre-update documents and enforce ${gold}.${pitfall}`;
      ruleDirective = `RULE_TEMPORAL_RELEVANCE_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: Enforce temporal metadata checking for "${target}" and reject stale precedents in favor of ${gold}.`;
      break;

    case 'Stage 4: Claim vs Source Matching':
      mistakePattern = `Factual matcher failed to register exact contradiction or numerical/temporal disparity between proposition and evidence.`;
      correctedReasoning = `[1. Premise Audit]: Semantic vector similarity masked an exact numerical, polarity, or entity clash for "${target}". [2. Canonical Ground Truth]: Verified empirical record establishes: "${canonical}". [3. Epistemic Calibration]: Reject approximate semantic matching when precise empirical tokens conflict; enforce ${gold}.${pitfall}`;
      ruleDirective = `RULE_CONTRADICTION_GUARD_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: Detect exact token-level and empirical contradiction against canonical truth: "${canonical}". Output ${gold}.`;
      break;

    case 'Stage 5: Provenance & Independence':
      mistakePattern = `TRACE-X failed to detect syndication collapse or echo chamber recycling of a single unverified seed source.`;
      correctedReasoning = `[1. Premise Audit]: Multiple syndicated media echoes were falsely aggregated as independent corroborations for "${target}". [2. Canonical Ground Truth]: Provenance tracing collapses these reports to a single origin (I(c) < 0.20), whereas canonical truth confirms: ${canonical}. [3. Epistemic Calibration]: Enforce origin deduplication and calibrate verdict to ${gold}.${pitfall}`;
      ruleDirective = `RULE_INDEPENDENCE_COLLAPSE_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: Deduplicate syndicated origins for "${target}". When apparent >> independent, enforce ${gold}.`;
      break;

    case 'Stage 6: Final Trust Decision':
    default:
      mistakePattern = `Decision engine violated conservative epistemic calibration thresholds (output ${actualSystemVerdict} instead of ${gold}).`;
      correctedReasoning = `[1. Premise Audit]: The selective prediction engine output ${actualSystemVerdict} due to skewed risk thresholds on category "${testCase.category}". [2. Canonical Ground Truth]: ${canonical}. [3. Epistemic Calibration]: Align decision boundaries to enforce ${gold} with calibrated epistemic uncertainty.${pitfall}`;
      ruleDirective = `RULE_EPISTEMIC_CALIBRATION_${testCase.id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}: Calibrate decision thresholds for "${testCase.category}" on "${target}" to strictly output ${gold}.`;
      break;
  }

  return { correctedReasoning, ruleDirective, mistakePattern };
}

/**
 * Stores a new learned correction from a failed test run, syncing locally and to backend DB
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
    difficulty: testCase.difficulty,
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

  // Asynchronously broadcast to backend REST API
  try {
    const backendEndpoint = typeof window !== 'undefined' ? '/api/rules' : 'http://localhost:8000/api/rules';
    fetch(backendEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newMemory.id,
        test_case_id: newMemory.testCaseId,
        claim_snippet: newMemory.claimSnippet,
        target_entity: newMemory.targetEntity,
        original_failed_stage: newMemory.originalFailedStage,
        original_system_decision: newMemory.originalSystemDecision,
        expected_decision: newMemory.expectedDecision,
        mistake_pattern: newMemory.mistakePattern,
        corrected_reasoning: newMemory.correctedReasoning,
        rule_directive: newMemory.ruleDirective,
        canonical_correction: newMemory.canonicalCorrection,
      }),
    }).catch(() => {});
  } catch (err) {
    // Ignore network error on async sync
  }

  return newMemory;
}

/**
 * Finds applicable active learned memories based on semantic entity & claim content matching.
 * Eliminates artificial testCaseId short-circuits to ensure the system re-evaluates
 * propositions using learned negative constraints rather than hardcoded lookup tables.
 */
export function findMatchingLearnedCorrection(
  claimText: string,
  targetEntity?: string
): LearnedCorrectionMemory | null {
  const memories = getLearnedMemories().filter(m => m.active);
  if (memories.length === 0) return null;

  const lowerClaim = claimText.toLowerCase();
  const lowerTarget = (targetEntity || '').toLowerCase().trim();

  let bestMatch: LearnedCorrectionMemory | null = null;
  let highestScore = 0;

  // Extract non-trivial claim tokens
  const claimTokens = new Set(
    lowerClaim
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 3)
  );

  for (const mem of memories) {
    let score = 0;
    const memEntity = (mem.targetEntity || '').toLowerCase().trim();

    // 1. Direct Target Entity Match (Weight: 0.60)
    if (lowerTarget && memEntity) {
      if (lowerTarget === memEntity) {
        score += 0.65;
      } else if (lowerTarget.includes(memEntity) || memEntity.includes(lowerTarget)) {
        score += 0.45;
      }
    }

    // 2. Entity presence in claim text (Weight: 0.35)
    if (memEntity && lowerClaim.includes(memEntity)) {
      score += 0.35;
    }

    // 3. Token Overlap with Memory Snippet and Entity
    const memTokens = (mem.targetEntity + ' ' + mem.claimSnippet)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 3);

    let sharedTokens = 0;
    for (const t of memTokens) {
      if (claimTokens.has(t)) {
        sharedTokens++;
      }
    }

    const overlapRatio = memTokens.length > 0 ? sharedTokens / memTokens.length : 0;
    score += overlapRatio * 0.40;

    // Minimum semantic relevance threshold
    if (score >= 0.50 && score > highestScore) {
      highestScore = score;
      bestMatch = mem;
    }
  }

  return bestMatch;
}

/**
 * Formats active learned correction memories into a structured negative-constraint prompt
 * for pipeline re-evaluation and LLM verification stages.
 */
export function formatNegativeConstraintsPrompt(memories: LearnedCorrectionMemory[]): string {
  if (!memories || memories.length === 0) return '';

  const directives = memories.slice(0, 3).map((m, idx) => {
    return `[NEGATIVE_CONSTRAINT_${idx + 1}]: When evaluating entity "${m.targetEntity}", DO NOT commit mistake: "${m.mistakePattern}". Mandate: ${m.ruleDirective}. Canonical Ground Truth: ${m.canonicalCorrection || m.correctedReasoning}`;
  });

  return `\n### LEARNED EPISTEMIC DIRECTIVES (Negative Constraints):\n${directives.join('\n')}\n`;
}

/**
 * Updates an existing learned memory (e.g. human edits ruleDirective or correctedReasoning)
 */
export function updateLearnedMemory(
  id: string,
  updates: Partial<Pick<LearnedCorrectionMemory, 'ruleDirective' | 'correctedReasoning' | 'canonicalCorrection' | 'active'>>
): boolean {
  const memories = getLearnedMemories();
  const idx = memories.findIndex(m => m.id === id);
  if (idx < 0) return false;
  memories[idx] = { ...memories[idx], ...updates };
  saveLearnedMemories(memories);
  return true;
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
