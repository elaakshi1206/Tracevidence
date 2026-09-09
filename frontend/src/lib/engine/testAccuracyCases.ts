import { executeTracevidencePipeline } from './pipelineOrchestrator';

interface TestCase {
  query: string;
  expectedDecision: 'TRUST' | 'ABSTAIN' | 'VERIFY';
  description: string;
}

const TEST_CASES: TestCase[] = [
  {
    query: 'Indian Flag has black colour',
    expectedDecision: 'ABSTAIN',
    description: 'Flag of India color mismatch (contains saffron, white, green, navy blue; not black)',
  },
  {
    query: 'Ashoka Chakra has 23 lines',
    expectedDecision: 'ABSTAIN',
    description: 'Ashoka Chakra spoke count mismatch (contains 24 spokes, not 23)',
  },
  {
    query: 'Ashoka Chakra has 24 spokes',
    expectedDecision: 'TRUST',
    description: 'Ashoka Chakra canonical 24 spokes fact',
  },
  {
    query: "India's national bird is peacock",
    expectedDecision: 'TRUST',
    description: 'Indian peacock is official national bird of India',
  },
  {
    query: "India's national bird is eagle",
    expectedDecision: 'ABSTAIN',
    description: 'National bird entity mismatch (peacock vs eagle)',
  },
];

async function runTests() {
  console.log('=====================================================');
  console.log('  RUNNING ACCURACY VERIFICATION SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    console.log(`Testing: "${tc.query}"`);
    console.log(`Expected: ${tc.expectedDecision} | Reason: ${tc.description}`);

    try {
      const result = await executeTracevidencePipeline(tc.query, { mode: 'live' });
      const primaryClaim = result.claims[0];
      const actualDecision = primaryClaim ? primaryClaim.decision : 'ABSTAIN';

      console.log(`Actual Decision: ${actualDecision}`);
      console.log(`Contradiction Detected: ${primaryClaim?.contradictionDetected}`);
      console.log(`Decision Reason: ${primaryClaim?.decisionReason}`);
      console.log(`Sources Count: ${result.sources.length} (Backend: ${result.provider})`);

      if (actualDecision === tc.expectedDecision) {
        console.log('>>> [PASS] Result matches requirement!\n');
        passed++;
      } else {
        console.error(`>>> [FAIL] Expected ${tc.expectedDecision} but got ${actualDecision}!\n`);
        failed++;
      }
    } catch (err) {
      console.error(`>>> [ERROR] Test threw exception:`, err);
      failed++;
    }
  }

  console.log('=====================================================');
  console.log(`SUMMARY: ${passed}/${TEST_CASES.length} PASSED (${failed} FAILED)`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
