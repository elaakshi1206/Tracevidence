import { executeTracevidencePipeline } from './pipelineOrchestrator';

interface RelevanceTestCase {
  claim: string;
  expectedDecision: 'TRUST' | 'ABSTAIN' | 'VERIFY';
  expectedContradiction: boolean;
  forbiddenTitlesOrKeywords: string[];
  requiredKeywordsInExplanation?: string[];
  description: string;
}

const TEST_CASES: RelevanceTestCase[] = [
  {
    claim: 'sun sets in the east',
    expectedDecision: 'ABSTAIN',
    expectedContradiction: true,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8', 'proposition 50', 'fairy-tale', 'fairy tale'],
    requiredKeywordsInExplanation: ['west'],
    description: 'Astronomical fact: Sun sets in the west, never east. Irrelevant TV series & ballot propositions must be completely excluded.',
  },
  {
    claim: 'sun sets in the west',
    expectedDecision: 'TRUST',
    expectedContradiction: false,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8', 'fairy-tale'],
    description: 'Canonical truth: Sun sets in the west. Should be corroborated and trusted.',
  },
  {
    claim: 'Indian Flag has black colour',
    expectedDecision: 'ABSTAIN',
    expectedContradiction: true,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8'],
    description: 'Flag color mismatch: India flag does not contain black.',
  },
  {
    claim: 'Ashoka Chakra has 24 spokes',
    expectedDecision: 'TRUST',
    expectedContradiction: false,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8'],
    description: 'Ashoka Chakra has exactly 24 spokes.',
  },
  {
    claim: 'India national bird is peacock',
    expectedDecision: 'TRUST',
    expectedContradiction: false,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8'],
    description: 'National bird of India is peacock.',
  },
  {
    claim: 'India national bird is eagle',
    expectedDecision: 'ABSTAIN',
    expectedContradiction: true,
    forbiddenTitlesOrKeywords: ['the wire', 'proposition 8'],
    description: 'National bird mismatch: eagle vs peacock.',
  },
];

async function runRelevanceAudit() {
  console.log('========================================================================');
  console.log('  CRITICAL RELEVANCE & MATCHING TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    console.log(`------------------------------------------------------------------------`);
    console.log(`TEST: "${tc.claim}"`);
    console.log(`Description: ${tc.description}`);

    try {
      const result = await executeTracevidencePipeline(tc.claim, { mode: 'live' });
      const primaryClaim = result.claims[0];
      const actualDecision = primaryClaim ? primaryClaim.decision : 'ABSTAIN';
      const actualContradiction = primaryClaim?.contradictionDetected || false;

      console.log(`  -> Actual Decision:      ${actualDecision} (Expected: ${tc.expectedDecision})`);
      console.log(`  -> Contradiction Flag:    ${actualContradiction} (Expected: ${tc.expectedContradiction})`);
      console.log(`  -> Decision Reason:       ${primaryClaim?.decisionReason?.slice(0, 120)}...`);
      console.log(`  -> Sources Retrieved:     ${result.sources.length}`);

      const titles = result.sources.map(s => s.title);
      console.log(`  -> Source Titles:         ${JSON.stringify(titles)}`);

      // Check 1: Correct Decision
      let testPassed = true;
      if (actualDecision !== tc.expectedDecision) {
        console.error(`  [FAIL] Decision mismatch: expected ${tc.expectedDecision}, got ${actualDecision}`);
        testPassed = false;
      }

      // Check 2: Contradiction Flag
      if (actualContradiction !== tc.expectedContradiction) {
        console.error(`  [FAIL] Contradiction mismatch: expected ${tc.expectedContradiction}, got ${actualContradiction}`);
        testPassed = false;
      }

      // Check 3: Forbidden irrelevant sources
      for (const bad of tc.forbiddenTitlesOrKeywords) {
        const foundBad = result.sources.some(s =>
          s.title.toLowerCase().includes(bad.toLowerCase()) ||
          s.snippet.toLowerCase().includes(bad.toLowerCase())
        );
        if (foundBad) {
          console.error(`  [FAIL] Forbidden irrelevant source found matching "${bad}"!`);
          testPassed = false;
        }
      }

      // Check 4: No false "Both well-supported" verdicts on contradictory sources
      for (const ev of result.evidences) {
        if (actualContradiction && ev.polarity === 'SUPPORT') {
          console.error(`  [FAIL] Found SUPPORT polarity on a contradictory claim! Evidence: ${ev.verificationReasoning}`);
          testPassed = false;
        }
      }

      if (testPassed) {
        console.log(`  >>> [PASS] All criteria satisfied!`);
        passed++;
      } else {
        failed++;
      }
    } catch (err: any) {
      console.error(`  [ERROR] Execution threw:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================================================');
  console.log(`FINAL RESULT: ${passed}/${TEST_CASES.length} PASSED (${failed} FAILED)`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runRelevanceAudit();
